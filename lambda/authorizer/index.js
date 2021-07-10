const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.CLIENT_ID;

async function verify(token) {
    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
}

exports.handler = async function (event, context) {
    let response = { isAuthorized: false };
    try {
        const token = event.headers.authorization;
        const jwtToken = token.replace('token ', '').trim()

        const { email, picture, name } = await verify(jwtToken);
        response = {
            isAuthorized: true,
            context: {
                email,
                picture,
                name,
            }
        };
    } catch (error) {
        console.error("Error occured", error);
    }
    return response;
}
