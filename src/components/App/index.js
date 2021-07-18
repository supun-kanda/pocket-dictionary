import React, { useState, useEffect } from 'react';

// components
import AppBar from './AppBar';
import Table from './Table';

// utils
import {
  fetchTableData,
  insertNewWord,
  updateWord,
  deleteWord,
  resetView,
  incrementView,
} from '../../actions/tableData';
import { deleteUser } from '../../actions/user';
import {
  formatText,
  getUserData,
  setUserData as setLocalStorage,
  isValidEntry,
  filterData as searchData,
} from '../../util/util';
import {
  userInitialState,
  infoInitialState,
  editorInitialState,
  ROW_MODS,
} from '../../util/const';

import PropTypes from 'prop-types';

//styles
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    height: "100%"
  },
  bar: {
    maxHeight: '50px',
  },
  table: {
    height: 'calc(100vh - 80px)',
  }
}));
export default function App({
  info,
  setInfo,
  isTableLoading,
  setTableLoading,
  isLoginModalOpen,
  setLoginModalOpen,
  userData,
  setUserData,
  shouldClear,
  setShouldClear,
  onResponseNotOk,
}) {
  const classes = useStyles();

  const [editor, setEditor] = useState(editorInitialState);
  const [abort, setAbort] = useState(false);

  // table
  const [tableData, setTableData] = useState([]);
  const [exposed, setExposed] = useState([]);
  const [id2Data, setId2Data] = useState({});
  const [expandedKey, setExpandedKey] = useState(null);

  // search
  const [filterData, setFilterData] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [exactId, setExactId] = useState(null);

  // manager
  const [isResetEnabled, setResetEnabled] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  const fetchDataForValidUser = async tokenId => {
    setTableLoading(true);
    try {
      setTableData(await fetchTableData(tokenId));
    } catch (error) {
      onResponseNotOk(error);
    } finally {
      setTableLoading(false);
    }
  }
  /**
   * On Submit click
   * @returns None
   */
  const onSubmit = async () => {
    setTableLoading(true);

    let {
      word,
      meaning,
      synonyms,
      mode,
      key,
    } = editor;

    word = word ? word.toLowerCase().trim() : null;
    meaning = meaning ? meaning.toLowerCase().trim() : null;
    const { isValid, code: errCodes } = isValidEntry(word, meaning, synonyms, tableData, mode)

    if (isValid) {
      setEditor({ ...editor, word, meaning })
    } else {
      setEditor({ ...editor, word, meaning, isValid, errCodes });
      return setTableLoading(false);
    }
    const newWord = { word: formatText(word), meaning: formatText(meaning), synonyms };

    try {
      let wordId;
      // update react states
      if (mode === ROW_MODS.WRITE) {
        const response = await insertNewWord(newWord, userData.tokenId);
        wordId = response.key;

        const tD = [...tableData];
        tD.shift();

        setTableData([{
          ...newWord,
          key: wordId,
          views: 1,
        }, ...tD]);
      } else if (mode === ROW_MODS.UPDATE) {
        const updatedRecord = {
          word: newWord.word,
          key,
          meaning: newWord.meaning,
          synonyms: synonyms,
        }
        await updateWord(updatedRecord, userData.tokenId);

        const newTd = tableData.map(e => {
          const isUpdatedWord = e.key === key;
          if (isUpdatedWord) {
            wordId = e.key;
          }
          return isUpdatedWord ? updatedRecord : e
        });

        setTableData(newTd);
      }

      setExposed([...exposed, wordId]);
      setEditor(editorInitialState);
      setExpandedKey(wordId);
    } catch (error) {
      onResponseNotOk(error)
    } finally {
      setTableLoading(false);
    }

  };

  /**
   * On reset button click
   */
  const onReset = async () => {
    try {
      setTableLoading(true)
      setTableData(await fetchTableData(userData.tokenId));
    } catch (error) {
      onResponseNotOk(error);
    } finally {
      setTableLoading(false);
      setResetEnabled(false);
      setExposed([]);
      setExpandedKey(null);
    }
  }

  /**
   * clear all info while login out of delete account
   */
  const clearAll = () => {
    setTableLoading(false);
    setTableData([]);
    setExposed([]);
    setResetEnabled(false);
    setUserData(userInitialState);

    // open login modal when logout
    setLoginModalOpen(true);
    setInfo({
      ...infoInitialState,
      isOpen: true,
      code: 27,
    })
  }

  /**
   * on logout
   */
  const logOut = () => {
    setProfileOpen(false);
    setTableLoading(true);
    setLocalStorage('');
    clearAll();
  }

  /**
   * on account deletion
   */
  const deleteAccount = () => {
    setInfo({ ...infoInitialState });
    setTableLoading(true);
    deleteUser(userData.email, userData.tokenId)
      .then(() => {
        setLocalStorage('');
        clearAll();
      })
      .catch(onResponseNotOk);
  }

  /**
   * on delete option click
   */
  const onDeleteAccountClick = () => {
    setProfileOpen(false);
    setInfo({
      isOpen: true,
      code: 9,
      alert: 'Are you sure you want to delete?'
    })
  }

  const onSearchChange = e => {
    setKeyword(e.target.value);
  }

  const getWordByKey = key => id2Data[key] || {};

  const onAddClick = () => {
    const editingObj = {
      ...editorInitialState,
      isEditing: true,
      word: keyword,
      mode: ROW_MODS.WRITE,
      key: -1,
      meaning: '',
    };

    setEditor(editingObj);
    setKeyword('');
    setTableData([{ word: keyword, key: -1, meaning: '' }, ...tableData])
  }

  const onEdit = (wordId) => {
    const word = id2Data[wordId];

    const editingObj = {
      ...editorInitialState,
      isEditing: true,
      word: word.word,
      mode: ROW_MODS.UPDATE,
      key: wordId,
      meaning: word.meaning,
      synonyms: word.synonyms,
    };

    setEditor(editingObj);
  }

  const onDeleteWord = key => {
    setTableLoading(true);
    deleteWord(key, userData.tokenId)
      .then(() => setTableData(tableData.filter(e => e.key !== key)))
      .catch(onResponseNotOk)
      .finally(() => setTableLoading(false));
  }

  const onViewIncrement = key => {
    incrementView(key, userData.tokenId)
      .then(() => setTableData(tableData.map(e => e.key === key ? { ...e, views: e.views + 1 } : e)))
      .catch(onResponseNotOk);
  }

  const onViewReset = key => {
    resetView(key, userData.tokenId)
      .then(() => setTableData(tableData.map(e => e.key === key ? { ...e, views: 1 } : e)))
      .catch(onResponseNotOk);
  }

  /**
   * conponenetDidMount (all props are from parent and methods)
   */
  useEffect(() => {
    const fetchData = async () => {
      let storageData;
      try {
        storageData = getUserData();
      } catch (error) {
        setLoginModalOpen(true);
        setInfo({ alert: 'Please Login again', isOpen: true, code: 27 });
        return;
      }

      const {
        name,
        email,
        tokenId,
        userId,
      } = storageData;

      if (tokenId) {

        setUserData({ name, email, tokenId, userId });
        try {
          await fetchDataForValidUser(tokenId);
        } catch (error) {
          onResponseNotOk(error);
        }

      } else {

        setLoginModalOpen(true);
        setInfo({ alert: null, isOpen: true, code: 27 });

      }
    }
    fetchData();
  }, [setInfo, setLoginModalOpen, setUserData]);

  /**
   * componentDidUpdate with exposed change
   */
  useEffect(() => {
    if (exposed.length) {
      setResetEnabled(true);
    }
  }, [exposed]);

  /**
   * componentDidUpdate with shoudClear change
   */
  useEffect(() => {
    if (shouldClear) {
      setShouldClear(false);
      deleteAccount();
    }
  }, [shouldClear, setShouldClear]);

  /**
   * componentDidUpdate with search keyword/tableData change
   */
  useEffect(() => {
    if (!keyword) {
      setFilterData(tableData);
    } else {
      const { filteredData: searchedData, exactId: perfectMatchId } = searchData(keyword, tableData);
      setFilterData(searchedData);
      setExactId(perfectMatchId);
    }
  }, [keyword, tableData]);

  /**
   * componentDidUpdate with data change
   */
  useEffect(() => {

    let map = {}
    for (let word of tableData) {
      map[word.key] = { ...word };
    }
    setId2Data({ ...map });
  }, [tableData]);

  /**
   * componentDidUpdate with data change
   */
  useEffect(() => {
    if (abort) {
      const isWrite = editor.mode === ROW_MODS.WRITE;
      setEditor(editorInitialState);

      if (isWrite) {
        tableData.shift()
        setTableData([...tableData]);
      }
      setAbort(false);
    }
  }, [abort]);

  return (
    <div className={classes.root}>
      <AppBar
        onReset={onReset}
        isResetEnabled={isResetEnabled}
        userData={{
          ...userData,
        }}
        logOut={logOut}
        deleteAccount={onDeleteAccountClick}
        isOpen={isProfileOpen}
        setOpen={setProfileOpen}
        keyword={keyword}
        onSearchChange={onSearchChange}
        isAddDisabled={!!exactId || editor.isEditing}
        onAdd={onAddClick}
      />
      <div className={classes.table}>
        <Table
          data={filterData}
          source={tableData.filter(e => editor.key !== e.key)}
          exposed={exposed}
          setExposed={setExposed}
          getWordByKey={getWordByKey}
          keyword={keyword}
          editor={editor}
          setEditor={setEditor}
          setAbort={setAbort}
          map={id2Data}
          onSubmit={onSubmit}
          onEdit={onEdit}
          expandedKey={expandedKey}
          setExpandedKey={setExpandedKey}
          onDeleteWord={onDeleteWord}
          onViewIncrement={onViewIncrement}
          onViewReset={onViewReset}
        />
      </div>
    </div>
  );
}

App.propTypes = {
  info: PropTypes.object,
  setInfo: PropTypes.func,
  isTableLoading: PropTypes.bool,
  setTableLoading: PropTypes.func,
  isLoginModalOpen: PropTypes.bool,
  setLoginModalOpen: PropTypes.func,
  userData: PropTypes.object,
  setUserData: PropTypes.func,
  shouldClear: PropTypes.bool,
  setShouldClear: PropTypes.func,
  onResponseNotOk: PropTypes.func,
};