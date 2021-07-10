import React, { useState, useEffect } from 'react';

// components
import { ClipLoader } from 'react-spinners'

import Table from './DataTable'
import Manager from './Manager'
import Adder from './Adder'
import LoginModal from './LoginModal';

// utils
import {
  fetchTableData,
  updateTableData,
  updateViewdWords,
  deleteUser,
} from '../actions/tableData';
import {
  formatText,
  getUserData,
  setUserData as setLocalStorage
} from '../util/util';
import { userInitialState } from '../util/const';
import { StatusCodes } from 'http-status-codes';

// styles
import '../App.css';

function App() {

  // adder
  const [isValid, setValidity] = useState(true);
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [isTableLoading, setTableLoading] = useState(false);

  // table
  const [tableData, setTableData] = useState([]);
  const [exposed, setExposed] = useState([]);
  const [viewingData, setViewingData] = useState([]);

  // manager
  const [isResetEnabled, setResetEnabled] = useState(false);
  const [isViewEnabled, setViewEnabled] = useState(true);

  // login
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [userData, setUserData] = useState({ ...userInitialState });

  const fetchData = async () => {
    const {
      accessToken,
      name,
      email,
      tokenId,
    } = getUserData();

    if (tokenId) {
      setUserData({ accessToken, name, email, tokenId });
      await fetchDataForValidUser(tokenId);
    } else {
      setLoginModalOpen(true);
    }
  }

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
    const viewedIds = viewingData.map(e => `${e.key}`);
    const newlyExposed = viewedIds.filter(e => !exposed.includes(e));

    setExposed([...exposed, ...newlyExposed]);
    updateViewdWords(viewedIds, userData.tokenId);
    setViewEnabled(false);
  }

  /**
   * On reset button click
   */
  const onReset = async () => {
    try {
      setTableData(await fetchTableData(userData.tokenId));
    } catch (error) {
      onResponseNotOk(error);
    }
    setTableLoading(true);
    setResetEnabled(false);
    setExposed([]);
    setViewEnabled(true);
    setTableLoading(false);
  }

  /**
   * executes when google successfully autheticates 
   * @param {Object} data google response data
   */
  const onLoginSuccess = async data => {
    try {
      const {
        accessToken,
        tokenId,
        profileObj: {
          email,
          name,
        },
      } = data;
      console.log(data);

      setLocalStorage({ accessToken, email, name, tokenId });
      setUserData({ accessToken, email, name, tokenId });

      // close modal
      setLoginModalOpen(false);

      fetchDataForValidUser(tokenId);

    } catch (error) {
      // close modal
      setLoginModalOpen(true);
    }
  }

  const clearAll = () => {
    setValidity(false);
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
  }

  const logOut = () => {
    setLocalStorage('');
    clearAll();
  }

  const deleteAccount = () => {
    deleteUser(userData.email, userData.tokenId)
      .then(() => {
        setLocalStorage('');
        clearAll();
      })
      .catch(onResponseNotOk);
  }

  const onResponseNotOk = error => {
    const statusCode = error.code;
    if (statusCode && statusCode === StatusCodes.UNAUTHORIZED) {
      setLoginModalOpen(true);
      setLocalStorage('');
      return true;
    }
    return false;
  }

  /**
   * conponenetDidMount
   */
  useEffect(() => {
    const asyncFunc = async () => await fetchData();
    asyncFunc();
  }, []);

  /**
   * componentDidUpdate with exposedChange
   */
  useEffect(() => {
    if (exposed.length) {
      setResetEnabled(true);
    }
  }, [exposed]);

  return (
    <div className="App">
      <Manager
        onViewAll={onViewAll}
        onReset={onReset}
        isResetEnabled={isResetEnabled}
        isViewEnabled={isViewEnabled}
        userData={{
          ...userData,
        }}
        logOut={logOut}
        deleteAccount={deleteAccount}
      />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <ClipLoader color={'blue'} loading={isTableLoading} css={'override'} size={150} />
      </div>
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
      <LoginModal
        isOpen={isLoginModalOpen}
        setOpen={setLoginModalOpen}
        onSuccess={onLoginSuccess}
        onFailure={() => setLoginModalOpen(true)}
      />
    </div>
  );
}

export default App;
