export const userInitialState = {
    email: null,
    name: null,
    tokenId: null,
    userId: null,
};

export const infoInitialState = {
    isOpen: false,
    alert: null,
    code: 0,
}

export const ROW_MODS = {
    READ: 0,
    WRITE: 1,
    UPDATE: 2,
}

export const editorInitialState = {
    isEditing: false,
    mode: ROW_MODS.READ,
    word: null,
    meaning: null,
    id: null,
    synonyms: [],
    isValid: true,
    errCodes: [],
}

export const INVALID_INPUTS = {
    WORD: 0,
    MEANING: 1,
    SYNONYM: 2,
}
