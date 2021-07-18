import {
    responseAnalyzer,
    getAuthTokenFormat,
} from '../util/util';

const { REACT_APP_API_URL: API_URL } = process.env;

export const getUserInfo = tokenId => {
    return fetch(`${API_URL}/db-connections/fetchUser`, {
        method: 'GET',
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}

export const deleteUser = (email, tokenId) => {
    return fetch(`${API_URL}/db-connections/deleteUser?email=${email}`, {
        method: 'DELETE',
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}