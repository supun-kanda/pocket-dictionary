import { API_GW_URL as HOST } from '../util/const';
import {
    responseAnalyzer,
    getAuthTokenFormat,
} from '../util/util';

export const updateTableData = ({ word, meaning }, tokenId) => {
    return fetch(`${HOST}/db-connections/addWord`, {
        method: 'POST',
        body: JSON.stringify({ word, meaning }),
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}

export const fetchTableData = tokenId => {
    return fetch(`${HOST}/db-connections/fetchAll`, getAuthTokenFormat(tokenId))
        .then(responseAnalyzer)
        .then(response => response.json());
}

export const updateViewdWords = (ids, tokenId) => {
    return fetch(`${HOST}/db-connections/updateViewedWords`, {
        method: 'POST',
        body: JSON.stringify({ keys: [...ids] }),
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}

export const deleteUser = (email, tokenId) => {
    return fetch(`${HOST}/db-connections/deleteUser?email=${email}`, {
        method: 'DELETE',
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}