import {
    responseAnalyzer,
    getAuthTokenFormat,
} from '../util/util';

export const insertNewWord = ({ word, meaning, synonyms }, tokenId) => {
    return fetch(`/api/db-connections/addWord`, {
        method: 'POST',
        body: JSON.stringify({ word, meaning, synonyms }),
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}

export const updateWord = ({ word, meaning, id, synonyms }, tokenId) => {
    return fetch(`/api/db-connections/updateWord`, {
        method: 'PUT',
        body: JSON.stringify({ word, meaning, id, synonyms, }),
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
