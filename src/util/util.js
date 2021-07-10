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
    if (!data) {
        localStorage.clear();
        return false;
    }

    const sessionData = JSON.stringify(data);
    const encodedData = btoa(sessionData);

    localStorage.setItem('session', encodedData);
    return true;
}

export function responseAnalyzer(response) {
    if (!response.ok) {
        throw new ResponseError(response.status, response, `Status Code Error ${response.status}`);
    }
    return response;
}

export const getAuthTokenFormat = token => ({
    headers: {
        Authorization: `token ${token}`
    }
});

export const getTokenId = hash => {
    const regex = /&id_token=.*&login_hint/g;
    const matches = hash.match(regex);
    return matches[0].replace('&id_token=', '').replace('&login_hint', '').trim();
}