const {
    GET_USER_BY_USER_ID,
    DELETE_SYNONYMS_BY_USER_ID,
    DELETE_WORDS_BY_USER_ID,
    DELETE_USER_BY_USER_ID,
    GET_USER_BY_EMAIL,
    INSERT_USER,
} = require('./queries');

/**
 * Fetch user object by ownerId
 * @param {Object} pool database connection pool object
 * @param {Number} ownerId owner Id
 * @returns user details
 */
async function fetchUserByOwnerId(pool, ownerId) {
    const { rows } = await pool.query(GET_USER_BY_USER_ID, [ownerId]);

    if (Array.isArray(rows) && rows.length == 1) {
        console.log({ ...rows[0] });
        return { ...rows[0] }
    }

    return {};
}

/**
 * delete all table's records for the given user
 * @param {Object} pool database connection pool object
 * @param {Number} ownerId owner Id
 * @param {String} email user email
 * @returns error/nothing
 */
async function deleteUserByEmailAndOwnerId(pool, email, ownerId) {
    const { rows } = await pool.query(GET_USER_BY_EMAIL, [email.toLowerCase()]);

    if (!Array.isArray(rows) || rows.length !== 1 || rows[0].id !== ownerId) {
        return { message: 'Forbidden request' };
    }

    // validated request, hence deleting
    await pool.query(DELETE_SYNONYMS_BY_USER_ID, [ownerId]);
    await pool.query(DELETE_WORDS_BY_USER_ID, [ownerId]);
    await pool.query(DELETE_USER_BY_USER_ID, [ownerId]);

    return {};
}

/**
 * fetch user details by user email
 * @param {Object} pool database connection pool object
 * @param {String} email user email
 * @returns user Id
 */
async function fetchUserByEmail(pool, email) {
    const { rows } = await pool.query(GET_USER_BY_EMAIL, [email.toLowerCase()]);

    if (Array.isArray(rows) && rows.length == 1) {
        // if record exists, then assign
        return rows[0].id;
    } else if (Array.isArray(rows) && rows.length > 1) {
        // there can't be multiple user records to a single email
        throw new Error(`multiple rows: ${rows} found for email: ${email}`);
    }

    return null;
}

/**
 * create user by given user data
 * @param {Object} pool database connection pool object
 * @param {Object} param1 user data object {email,name}
 * @returns user Id
 */
async function createUser(pool, { email, name }) {
    const { rows } = await pool.query(INSERT_USER, [email.toLowerCase(), name]);
    return rows[0].id;
}

/**
 * get user id by fetching or creating user if not existing
 * @param {Object} pool database connection pool object
 * @param {Object} param1 user data object {email,name}
 * @returns userId
 */
async function getUser(pool, { email, name }) {
    const userId = await fetchUserByEmail(pool, email);

    if (!userId) {
        return await createUser(pool, { email, name });
    }

    return userId;
}

module.exports = {
    fetchUserByOwnerId,
    deleteUserByEmailAndOwnerId,
    fetchUserByEmail,
    createUser,
    getUser,
}
