const HOST = 'https://aicj966nz7.execute-api.us-east-1.amazonaws.com';
const ownerId = 0;

export const updateTableData = ({ word, meaning }) => {
    return fetch(`${HOST}/db-connections/addWord?ownerId=${ownerId}`, {
        method: 'POST',
        body: JSON.stringify({ word, meaning }),
    })
        .then(response => response.json());
}

export const fetchTableData = () => {
    return fetch(`${HOST}/db-connections/fetchAll?ownerId=${ownerId}`)
        .then(response => response.json());
}

export const updateViewdWords = ids => {
    return fetch(`${HOST}/db-connections/updateViewedWords?ownerId=${ownerId}`, {
        method: 'POST',
        body: JSON.stringify({ keys: [...ids] }),
    })
        .then(response => response.json());
}
