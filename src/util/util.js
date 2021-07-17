import ResponseError from './ResponseError';

/**
 * Trim and capitalized first letter. eg: ' test   ' => 'Test'
 * @param {String} string text to be formatted
 * @returns trimmed text
 */
export function formatText(string) {
    let trimmed;

    if (string) {
        trimmed = string.replace(/\s+/g, ' ').trim();
    } else {
        return '';
    }

    return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : '';

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

/**
 * Extract id token from hash param
 * @param {String} hash eg: #scope=email%20profile%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile%20openid&id_token=jebberish_1&login_hint=jibberish_2&client_id=cliend_id
 * @returns {String} id_token value eg: jebberish_1
 */
export const getTokenId = hash => {
    const regex = /&id_token=.*&login_hint/g;
    const matches = hash.match(regex);
    return matches[0].replace('&id_token=', '').replace('&login_hint', '').trim();
}

/**
 * Is word entry valid
 * @param {String} word word key
 * @param {String} meaning word meaning
 * @param {Array} tableData table data
 * @returns {Boolean} should the word allowed to be entered
 */
export const isValidEntry = (word, meaning, tableData = []) => {
    if (word && meaning) {
        return !tableData.find(e => e && e.word && e.word.toLowerCase() === word.toLowerCase());
    }
    return false;
}

/**
 * search and filter the data based on keyword
 * @param {String} keyword search keyword eg: 'word'
 * @param {Array} data word data array eg: [{word:'word1'},{word:'word2'},{word:'abc'},...]
 * @returns {Object} filtered array eg: filteredData: {[{word:'word1'},{word:'word2'}], exactId: null}
 */
export const filterData = (keyword, data) => {
    if (!keyword) {
        return { filteredData: data, exactId: null };
    }
    if (!Array.isArray(data)) {
        return { filteredData: [], exactId: null };
    }

    const keywordLower = keyword.toLowerCase();
    let exactId = null;

    const filteredData = data.filter(element => {
        const elementWord = element && element.word && element.word.toLowerCase();
        const includes = element && elementWord && elementWord.includes(keywordLower);
        if (includes && elementWord === keywordLower) {
            exactId = element.key;
        }
        return includes;
    });
    return { filteredData, exactId }
}
