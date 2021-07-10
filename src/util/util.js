import ResponseError from './ResponseError';

export function formatText(string) {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}

export function getUserData() {
    const encodedData = localStorage.getItem('session');
    if (!encodedData) {
        return {};
    }
    const sessionData = atob(encodedData);
    return JSON.parse(sessionData);
}

export function setUserData(data) {
    const sessionData = JSON.stringify(data);

    const encodedData = btoa(sessionData);
    localStorage.setItem('session', encodedData);
    return true;
}

export function responseAnalyzer(response) {
    if (!response.ok) {
        throw new ResponseError(response.status, response, "Not OK");
    }
    return response;
}

export const getAuthTokenFormat = token => ({
    headers: {
        Authorization: `token ${token}`
    }
});