import {
    responseAnalyzer,
    getAuthTokenFormat,
} from '../util/util';

import { API_URL } from '../util/const';

export const updateTableData = ({ word, meaning }, tokenId) => {
    return fetch(`${API_URL}/db-connections/addWord`, {
        method: 'POST',
        body: JSON.stringify({ word, meaning }),
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}

export const fetchTableData = tokenId => {
    return fetch(`${API_URL}/db-connections/fetchAll`, getAuthTokenFormat(tokenId))
        .then(responseAnalyzer)
        .then(response => response.json());
}

export const updateViewdWords = (ids, tokenId) => {
    return fetch(`${API_URL}/db-connections/updateViewedWords`, {
        method: 'POST',
        body: JSON.stringify({ keys: [...ids] }),
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}
