import {
    responseAnalyzer,
    getAuthTokenFormat,
} from '../util/util';

import { API_URL } from '../util/const';

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