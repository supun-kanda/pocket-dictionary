import {
    responseAnalyzer,
    getAuthTokenFormat,
} from '../util/util';

export const updateTableData = ({ word, meaning }, tokenId) => {
    return fetch(`/api/db-connections/addWord`, {
        method: 'POST',
        body: JSON.stringify({ word, meaning }),
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}

export const fetchTableData = tokenId => {
    return fetch(`/api/db-connections/fetchAll`, getAuthTokenFormat(tokenId))
        .then(responseAnalyzer)
        .then(response => response.json());
}

export const updateViewdWords = (ids, tokenId) => {
    return fetch(`/api/db-connections/updateViewedWords`, {
        method: 'POST',
        body: JSON.stringify({ keys: [...ids] }),
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}
