export default class ResponseError extends Error {
    constructor(code, response, message) {
        super(message);
        this.code = code;
        this.response = response;
    }
}