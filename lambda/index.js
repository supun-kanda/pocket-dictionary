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

async function manager(endpoint, params, body) {
    const pool = new Pool();
    const { ownerId } = params || {};
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
        default:
            break;
    }

    pool.end();
    return response;

}

exports.handler = async (event) => {
    const {
        queryStringParameters,
        body,
    } = event;
    const output = await manager(event.path, queryStringParameters, body)
    return {
        statusCode: 200,
        body: JSON.stringify(output),
    };
};
