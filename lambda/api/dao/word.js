const {
    GET_WORDS_WITH_SYNONYMS_BY_USER_ID,
    INSERT_SYNONYMS_BY_WORD_ID,
    INSERT_WORD,
    UPDATE_WORD,
    GET_SYNONYMS_BY_WORD_ID,
    DELETE_SYNONYM_ENTRY,
    DELETE_SYNONYM_BY_WORD_ID,
    DELETE_WORD_BY_WORD_ID,
    RESET_VIEW_COUNT,
    INCREMENT_VIEW_COUNT,
} = require('./queries');
const {
    format,
    deriveSynonyms,
} = require('../util/util');

/**
 * 
 * @param {Object} pool database connection pool object
 * @param {Number} ownerId owner Id
 * @returns words
 */
async function fetchWordsByOwnerId(pool, ownerId) {
    const { rows } = await pool.query(GET_WORDS_WITH_SYNONYMS_BY_USER_ID, [ownerId]);
    return format(rows);
}

/**
 * add word with synonyms
 * @param {Object} pool database connection pool object
 * @param {Object} body request POST body
 * @param {Number} ownerId owner Id
 * @returns 
 */
async function addWord(pool, body, ownerId) {
    if (!body) {
        return {};
    }
    const parsedBody = JSON.parse(body);

    const word = parsedBody.word;
    const meaning = parsedBody.meaning;
    const synonyms = parsedBody.synonyms;

    const { rows } = await pool.query(INSERT_WORD, [word, meaning, ownerId]);
    const key = rows[0].id;

    for (let s of synonyms) {
        await pool.query(INSERT_SYNONYMS_BY_WORD_ID, [key, s]);
    }

    return { key };
}

/**
 * Update word database with its synonyms
 * @param {Object} pool database connection pool object
 * @param {Object} body request PUT body
 * @returns updated synonym counts
 */
async function updateWord(pool, body) {
    if (!body) {
        return {};
    }
    const parsedBody = JSON.parse(body);

    const word = parsedBody.word;
    const meaning = parsedBody.meaning;
    const synonyms = parsedBody.synonyms;
    const key = parsedBody.key;

    await pool.query(UPDATE_WORD, [word, meaning, key]);
    const { rows } = await pool.query(GET_SYNONYMS_BY_WORD_ID, [key]);

    const change = deriveSynonyms(synonyms, rows.map(e => e['secondary_id']));

    for (let a of change.add) {
        await pool.query(INSERT_SYNONYMS_BY_WORD_ID, [key, a]);
    }

    for (let a of change.delete) {
        await pool.query(DELETE_SYNONYM_ENTRY, [key, a]);
    }

    return { add: change.add.length, delete: change.delete.length };
}

/**
 * Delete word and its synonyms
 * @param {Object} pool database connection pool object
 * @param {Number} key word Id to be removed
 * @returns deleted counts
 */
async function deleteWordByWordId(pool, key) {
    const { rowCount: wordCount } = await pool.query(DELETE_SYNONYM_BY_WORD_ID, [key]);
    const { rowCount: synonymCount } = await pool.query(DELETE_WORD_BY_WORD_ID, [key]);
    return { wordCount, synonymCount };
}

/**
 * reset view count of given wordId
 * @param {Object} pool database connection pool object
 * @param {Number} key word Id of view count
 * @returns 
 */
async function resetViewCountByWordId(pool, key) {
    const { rowCount } = await pool.query(RESET_VIEW_COUNT, [key]);
    return { updated: rowCount };
}

/**
 * Increment view count of the given wordId by 1
 * @param {Object} pool database connection pool object
 * @param {Number} key word Id of view count
 * @returns 
 */
async function incrementViewCountByWordId(pool, key) {
    const { rowCount } = await pool.query(INCREMENT_VIEW_COUNT, [key]);
    return { updated: rowCount };
}

module.exports = {
    fetchWordsByOwnerId,
    addWord,
    updateWord,
    deleteWordByWordId,
    resetViewCountByWordId,
    incrementViewCountByWordId,
}
