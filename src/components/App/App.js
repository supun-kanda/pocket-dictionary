import React, { useState, useEffect } from 'react';

// components
import Table from './DataTable'
import Manager from './Manager'
import Adder from './Adder'

// utils
import {
  fetchTableData,
  updateTableData,
  updateViewdWords,
} from '../../actions/tableData';
import { deleteUser } from '../../actions/user';
import {
  formatText,
  getUserData,
  setUserData as setLocalStorage
} from '../../util/util';
import { userInitialState, infoInitialState } from '../../util/const';
import { StatusCodes } from 'http-status-codes';
import PropTypes from 'prop-types'

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

  // adder
  const [isValid, setValidity] = useState(true);
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');

  // table
  const [tableData, setTableData] = useState([]);
  const [exposed, setExposed] = useState([]);
  const [viewingData, setViewingData] = useState([]);

  // manager
  const [isResetEnabled, setResetEnabled] = useState(false);
  const [isViewEnabled, setViewEnabled] = useState(true);
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
   * On Add click
   * @returns None
   */
  const onAdd = async () => {
    setTableLoading(true);

    if (!word || !meaning || tableData.find(e => e.word === word)) {
      setValidity(false);
      return setTableLoading(false);
    }

    try {

      const newWord = { word: formatText(word), meaning: formatText(meaning) };

      // add new word to the table
      const wordId = await updateTableData(newWord, userData.tokenId);

      // update react states
      setTableData([
        { ...newWord, key: wordId },
        ...tableData
      ]);
      setExposed([...exposed, `${wordId}`]);
      setWord('');
      setMeaning('');

    } catch (error) {
      if (!onResponseNotOk(error)) {
        setValidity(false);
      }
    } finally {
      setTableLoading(false);
    }

  };

  /**
   * On view all button click
   */
  const onViewAll = () => {
    if (!viewingData.length) {
      return;
    }

    const viewedIds = viewingData.map(e => `${e.key}`);
    const newlyExposed = viewedIds.filter(e => !exposed.includes(e));

    updateViewdWords(viewedIds, userData.tokenId)
      .catch(onResponseNotOk);
    setExposed([...exposed, ...newlyExposed]);
    setViewEnabled(false);
  }

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
      setViewEnabled(true);
    }
  }

  /**
   * clear all info while login out of delete account
   */
  const clearAll = () => {
    setValidity(true);
    setWord('');
    setMeaning('');
    setTableLoading(false);
    setTableData([]);
    setExposed([]);
    setViewingData([]);
    setResetEnabled(false);
    setViewEnabled(true);
    setUserData({ ...userInitialState });

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

  return (
    <div>
      <Manager
        onViewAll={onViewAll}
        onReset={onReset}
        isResetEnabled={isResetEnabled}
        isViewEnabled={isViewEnabled}
        userData={{
          ...userData,
        }}
        logOut={logOut}
        deleteAccount={onDeleteAccountClick}
        isOpen={isProfileOpen}
        setOpen={setProfileOpen}
      />
      <Table
        data={tableData}
        exposed={exposed}
        setExposed={setExposed}
        viewingData={viewingData}
        setViewingData={setViewingData}
        setViewEnabled={setViewEnabled}
        updateViewdWords={ids => updateViewdWords(ids, userData.tokenId).catch(onResponseNotOk)}
      />
      <Adder
        isValid={isValid}
        word={word}
        meaning={meaning}
        onAdd={onAdd}
        setWord={setWord}
        setMeaning={setMeaning}
        setValidity={setValidity}
      />
    </div>
  );
}

App.propTypes = PropTypes.shape({
  info: PropTypes.string,
  setInfo: PropTypes.func,
  isTableLoading: PropTypes.string,
  setTableLoading: PropTypes.func,
  isLoginModalOpen: PropTypes.string,
  setLoginModalOpen: PropTypes.func,
  userData: PropTypes.string,
  setUserData: PropTypes.func,
  shouldClear: PropTypes.string,
  setShouldClear: PropTypes.func,
  onResponseNotOk: PropTypes.func,
});