const { Pool } = require('pg');
const {
    INSERT_USER,
    INSERT_WORD,
    GET_USER_BY_EMAIL,
    DELETE_WORDS_BY_USER_ID,
    DELETE_USER_BY_USER_ID,
    GET_USER_BY_USER_ID,
    GET_WORDS_WITH_SYNONYMS_BY_USER_ID,
    GET_SYNONYMS_BY_WORD_ID,
    INSERT_SYNONYMS_BY_WORD_ID,
    DELETE_WORD_BY_WORD_ID,
    DELETE_SYNONYM_BY_WORD_ID,
    UPDATE_WORD,
    DELETE_SYNONYMS_BY_USER_ID,
    RESET_VIEW_COUNT,
    INCREMENT_VIEW_COUNT,
    DELETE_SYNONYM_ENTRY,
} = require('./queries');

function setSynonyms(dataPoint, s1, s2) {
    if (s1 > 0 && !dataPoint.synonyms.includes(s1)) {
        dataPoint.synonyms.push(s1);
    }
    if (s2 > 0 && !dataPoint.synonyms.includes(s2)) {
        dataPoint.synonyms.push(s2);
    }
}

function deriveSynonyms(updatedSynonyms, dbSynonyms) {
    return { add: updatedSynonyms.filter(e => !dbSynonyms.includes(e)), delete: dbSynonyms.filter(e => !updatedSynonyms.includes(e)) }
}


function format(rows) {
    if (!rows || !Array.isArray(rows)) {
        return [];
    }
    const keys = [];
    const key2Idx = {};
    const response = [];

    for (let row of rows) {
        const { key, word, meaning, s1, s2, views } = row;

        if (keys.includes(key)) {
            const dataPoint = response[key2Idx[key]];
            setSynonyms(dataPoint, s1, s2);
        } else if (key >= 0) {
            keys.push(key);
            key2Idx[key] = response.length;

            const dataPoint = {
                key,
                word,
                meaning,
                views,
                synonyms: []
            };
            setSynonyms(dataPoint, s1, s2);

            response.push(dataPoint);
        }
    }
    return response;
}

async function manager(pool, endpoint, ownerId, body, qp) {
    let response = {};
    const validEndpoint = endpoint ? endpoint.trim() : null;
    let rows, key, word, meaning, synonyms, result, parsedBody;

    switch (validEndpoint) {

        case '/db-connections/fetchAll':
            result = await pool.query(GET_WORDS_WITH_SYNONYMS_BY_USER_ID, [ownerId]);
            rows = result.rows;

            response = format(rows);
            break;
        case '/db-connections/addWord':
            if (!body) {
                break;
            }
            parsedBody = JSON.parse(body);

            word = parsedBody.word;
            meaning = parsedBody.meaning;
            synonyms = parsedBody.synonyms;

            result = await pool.query(INSERT_WORD, [word, meaning, ownerId]);
            key = result.rows[0].id;

            for (let s of synonyms) {
                await pool.query(INSERT_SYNONYMS_BY_WORD_ID, [key, s]);
            }

            response = { key };
            break;
        case '/db-connections/deleteUser':
            const { email } = qp;
            result = await pool.query(GET_USER_BY_EMAIL, [email.toLowerCase()]);
            rows = result.rows;

            if (!Array.isArray(rows) || rows.length !== 1 || rows[0].id !== ownerId) {
                return { message: 'Forbidden request' };
            }

            // validated request, hence deleting
            await pool.query(DELETE_SYNONYMS_BY_USER_ID, [ownerId]);
            await pool.query(DELETE_WORDS_BY_USER_ID, [ownerId]);
            await pool.query(DELETE_USER_BY_USER_ID, [ownerId]);


            break;
        case '/db-connections/fetchUser':
            result = await pool.query(GET_USER_BY_USER_ID, [ownerId]);
            rows = result.rows;

            if (Array.isArray(rows) && rows.length == 1) {
                response = { ...rows[0] }
            }
            break;
        //here
        case '/db-connections/updateWord':
            if (!body) {
                break;
            }
            parsedBody = JSON.parse(body);

            word = parsedBody.word;
            meaning = parsedBody.meaning;
            synonyms = parsedBody.synonyms;
            key = parsedBody.key;

            await pool.query(UPDATE_WORD, [word, meaning, key]);
            result = await pool.query(GET_SYNONYMS_BY_WORD_ID, [word]);
            rows = result.rows;
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', rows)

            const change = deriveSynonyms(synonyms, rows.map(e => e['secondary_id']));
            for (let a of change.add) {
                await pool.query(INSERT_SYNONYMS_BY_WORD_ID, [key, a]);
            }

            for (let a of change.delete) {
                await pool.query(DELETE_SYNONYM_ENTRY, [key, a]);
            }
            response = { add: change.add.length, delete: change.delete.length };
            break;

        case '/db-connections/deleteWord':
            key = qp.key;
            const res1 = await pool.query(DELETE_SYNONYM_BY_WORD_ID, [key]);
            const res2 = await pool.query(DELETE_WORD_BY_WORD_ID, [key]);
            response = { wordCount: res2.rowCount, synonymCount: res1.rowCount };
            break;

        case '/db-connections/view/reset':
            key = qp.key;
            result = await pool.query(RESET_VIEW_COUNT, [key]);
            response = { updated: result.rowCount };
            break;

        case '/db-connections/view/increment':
            key = qp.key;
            result = await pool.query(INCREMENT_VIEW_COUNT, [key]);
            response = { updated: result.rowCount };
            break;

        default:
            break;
    }

    pool.end();
    return response;

}

exports.handler = async (event) => {
    const pool = new Pool();

    const {
        body,
        requestContext: { authorizer: { email, name } },
        queryStringParameters: qp,

    } = event;

    if (!email) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "no email decoded" }),
        };
    }
    const { rows } = await pool.query(GET_USER_BY_EMAIL, [email.toLowerCase()]);

    let userId;
    if (Array.isArray(rows) && rows.length == 1) {
        // if record exists, then assign
        userId = rows[0].id;
    } else if (Array.isArray(rows) && rows.length > 1) {
        // there can't be multiple user records to a single email
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `multiple rows:${rows} found for email:${email}` }),
        };
    } else {
        // create a user record
        try {
            const { rows: newRows } = await pool.query(INSERT_USER, [email.toLowerCase(), name]);
            userId = newRows[0].id;
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify(error.message),
            };
        }
    }

    try {
        const output = await manager(pool, event.path, userId, body, qp);
        return {
            statusCode: 200,
            body: JSON.stringify(output),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error.message),
        };
    }
};
