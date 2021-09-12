const { Pool } = require('pg');
const { getUser } = require('./dao/user');
const { router } = require('./router');
const { respond } = require('./util/util');

exports.handler = async (event) => {
    const pool = new Pool();

    const {
        body,
        requestContext: { authorizer: { email, name } },
        queryStringParameters: qp,
    } = event;

    if (!email) {
        return respond({
            statusCode: 404,
            body: JSON.stringify({ message: "no email decoded" }),
        }, pool);
    }

    try {
        const userId = await getUser(pool, { email: email.toLowerCase(), name });
        const output = await router(pool, event.path, userId, body, qp);

        return respond({
            statusCode: 200,
            body: JSON.stringify(output),
        }, pool);
    } catch (error) {

        return respond({
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        }, pool);
    }
};
