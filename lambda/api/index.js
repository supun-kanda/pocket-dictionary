const { Pool } = require('pg')

function format(rows) {
    if (!rows || !Array.isArray(rows)) {
        return [];
    }
    return rows.map(row => ({
        key: row.id,
        word: row.key,
        meaning: row.meaning,
    }));

}

async function manager(pool, endpoint, ownerId, body, qp) {
    let response = {};
    const validEndpoint = endpoint ? endpoint.trim() : null;

    switch (validEndpoint) {

        case '/db-connections/fetchAll':
            const { rows } = await pool.query(`select id, "key", meaning from words where "owner" = $1 order by (frequency, "key") asc`, [ownerId]);
            response = format(rows);
            break;

        case '/db-connections/updateViewedWords':
            let idString = '';
            if (!body) {
                break;
            }
            const { keys } = JSON.parse(body);

            for (let key of keys) {
                const validK = parseInt(key);
                if (validK) {
                    idString += `,${validK}`
                }
            }
            const ids = idString.substring(1);
            const res = await pool.query(`update words set frequency = frequency + 1 where id in (${ids}) and "owner" = $1`, [ownerId]);
            response = { rowCount: res.rowCount };
            break;

        case '/db-connections/addWord':
            if (!body) {
                break;
            }
            const { word, meaning } = JSON.parse(body);
            const result = await pool.query(`insert into words ("key", meaning, created_ts, "owner", frequency) values ($1, $2, now(), $3, 1) returning *`, [word, meaning, ownerId]);
            response = { key: result.rows[0].id };
            break;
        case '/db-connections/deleteUser':
            const { email } = qp;
            const { rows: delRows } = await pool.query(`select id from "user" where email = $1`, [email.toLowerCase()]);

            if (!Array.isArray(delRows) || delRows.length !== 1 || delRows[0].id !== ownerId) {
                return { message: 'Forbidden request' };
            }

            // validated request, hence deleting
            await pool.query(`delete from words where "owner" = $1`, [ownerId]);
            await pool.query(`delete from "user" where id = $1`, [ownerId]);

            break;
        case '/db-connections/fetchUser':
            const { rows: userRows } = await pool.query(`select id, email, "name" from "user" where id = $1`, [ownerId]);
            if (Array.isArray(userRows) && userRows.length == 1) {
                response = { ...userRows[0] }
            }
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
    const { rows } = await pool.query(`select id from "user" where email = $1`, [email.toLowerCase()]);

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
            const { rows: newRows } = await pool.query('insert into "user" (email, "name", created_ts) values ($1, $2, now()) returning *', [email.toLowerCase(), name]);
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
