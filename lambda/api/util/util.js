/**
 * Format word objects
 * @param {Array} rows database result rows
 * @returns 
 */
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

/**
 * Set synonyms from primary/secondary columns to a word table
 * @param {Object} dataPoint row data-point
 * @param {String} s1 synonym primary
 * @param {String} s2 synonym secondary
 */
function setSynonyms(dataPoint, s1, s2) {
    if (s1 > 0 && !dataPoint.synonyms.includes(s1)) {
        dataPoint.synonyms.push(s1);
    }
    if (s2 > 0 && !dataPoint.synonyms.includes(s2)) {
        dataPoint.synonyms.push(s2);
    }
}

/**
 * Derive database changes required to store the synonym changes
 * @param {Array} updatedSynonyms api changed synonyms
 * @param {Array} dbSynonyms db already stored synonyms
 * @returns object of what Ids to be added & what needs to be deleted
 */
function deriveSynonyms(updatedSynonyms, dbSynonyms) {
    return { add: updatedSynonyms.filter(e => !dbSynonyms.includes(e)), delete: dbSynonyms.filter(e => !updatedSynonyms.includes(e)) }
}

/**
 * respond by closing the pool
 * @param {Object} pool database connection pool object
 * @param {Object} body response body
 * @returns response
 */
 function respond(body, pool) {
    pool.end();
    return body;
}

module.exports = {
    format,
    setSynonyms,
    deriveSynonyms,
    respond,
}
