const {
    fetchWordsByOwnerId,
    addWord,
    updateWord,
    deleteWordByWordId,
    resetViewCountByWordId,
    incrementViewCountByWordId,
} = require('../dao/word');
const {
    fetchUserByOwnerId,
    deleteUserByEmailAndOwnerId,
} = require('../dao/user');

/**
 * route relevant dao call based on the uri
 * @param {Object} pool database connection pool object
 * @param {String} endpoint endpoint uri
 * @param {Number} ownerId owner Id
 * @param {Object} body request body
 * @param {Object} qp request query params
 * @returns response body
 */
async function router(pool, endpoint, ownerId, body, qp) {
    let response;
    const validEndpoint = endpoint ? endpoint.trim() : null;

    switch (validEndpoint) {
        case '/db-connections/fetchAll':
            response = await fetchWordsByOwnerId(pool, ownerId);
            break;
        case '/db-connections/addWord':
            response = await addWord(pool, body, ownerId)
            break;
        case '/db-connections/deleteUser':
            response = await deleteUserByEmailAndOwnerId(pool, qp.email, ownerId);
            break;
        case '/db-connections/fetchUser':
            return await fetchUserByOwnerId(pool, ownerId);
        case '/db-connections/updateWord':
            response = await updateWord(pool, body);
            break;
        case '/db-connections/deleteWord':
            response = await deleteWordByWordId(pool, qp.key);
            break;
        case '/db-connections/view/reset':
            response = await resetViewCountByWordId(pool, qp.key)
            break;
        case '/db-connections/view/increment':
            response = await incrementViewCountByWordId(pool, qp.key);
            break;
        default:
            response = {};
            break;
    }

    return response;
}

module.exports = {
    router,
}
