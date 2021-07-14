import {
    responseAnalyzer,
    getAuthTokenFormat,
} from '../util/util';

export const getUserInfo = tokenId => {
    return fetch(`/api/db-connections/fetchUser`, {
        method: 'GET',
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}

export const deleteUser = (email, tokenId) => {
    return fetch(`/api/db-connections/deleteUser?email=${email}`, {
        method: 'DELETE',
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}