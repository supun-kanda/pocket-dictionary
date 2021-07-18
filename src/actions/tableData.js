import {
    responseAnalyzer,
    getAuthTokenFormat,
} from '../util/util';

const { REACT_APP_API_URL: API_URL } = process.env;


export const insertNewWord = ({ word, meaning, synonyms }, tokenId) => {
    return fetch(`${API_URL}/db-connections/addWord`, {
        method: 'POST',
        body: JSON.stringify({ word, meaning, synonyms }),
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}

export const updateWord = ({ word, meaning, key, synonyms }, tokenId) => {
    return fetch(`${API_URL}/db-connections/updateWord`, {
        method: 'PUT',
        body: JSON.stringify({ word, meaning, key, synonyms, }),
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

export const deleteWord = (key, tokenId) => {
    return fetch(`${API_URL}/db-connections/deleteWord?key=${key}`, {
        method: 'DELETE',
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}

export const resetView = (key, tokenId) => {
    return fetch(`${API_URL}/db-connections/view/reset?key=${key}`, {
        method: 'DELETE',
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}

export const incrementView = (key, tokenId) => {
    return fetch(`${API_URL}/db-connections/view/increment?key=${key}`, {
        method: 'PUT',
        ...getAuthTokenFormat(tokenId),
    })
        .then(responseAnalyzer)
        .then(response => response.json());
}
