import React, { useState, useEffect } from 'react';

// components
import { ClipLoader } from 'react-spinners'

import Table from './DataTable'
import Manager from './Manager'
import Adder from './Adder'
import InfoModal from './InfoModal';
import { GoogleLogin } from 'react-google-login';


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
import { userInitialState, infoInitialState } from '../util/const';
import { StatusCodes } from 'http-status-codes';
import { GOOGLE_CLIENT_ID } from '../util/const';
import ResponseError from '../util/ResponseError';

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
  const [isProfileOpen, setProfileOpen] = useState(false);

  // profile
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [info, setInfo] = useState({ ...infoInitialState });
  const [userData, setUserData] = useState({ ...userInitialState });

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

      setLocalStorage({ accessToken, email, name, tokenId });
      setUserData({ accessToken, email, name, tokenId });

      // close modal
      setLoginModalOpen(false);
      setInfo({ ...infoInitialState });

      fetchDataForValidUser(tokenId);

    } catch (error) {
      // close modal
      setLoginModalOpen(true);
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
      code: StatusCodes.UNAUTHORIZED,
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
   * act on error
   * @param {Error|ResponseError} error
   * @returns is authorization error
   */
  const onResponseNotOk = error => {
    const statusCode = error.code;
    if (statusCode && statusCode === StatusCodes.UNAUTHORIZED) {
      setLoginModalOpen(true);
      setInfo({
        isOpen: true,
        alert: `${StatusCodes.UNAUTHORIZED} Unauthorized`,
        code: StatusCodes.UNAUTHORIZED,
      });
      setLocalStorage('');
      return true;
    }

    setLoginModalOpen(false);
    setInfo({ isOpen: true, alert: error.message, code: 0 })
    setLocalStorage('');
    return false;
  }

  /**
   * conponenetDidMount
   */
  useEffect(() => {
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
        setInfo({ alert: null, isOpen: true, code: StatusCodes.UNAUTHORIZED });
      }
    }
    fetchData();
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
        deleteAccount={onDeleteAccountClick}
        isOpen={isProfileOpen}
        setOpen={setProfileOpen}
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
      <InfoModal
        isOpen={info.isOpen}
        showLogin={isLoginModalOpen}
        alert={info.alert}
        code={info.code}
        Login={() => (
          <div onClick={() => setInfo({ ...infoInitialState })}>
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Log in with Google"
              onSuccess={onLoginSuccess}
              onFailure={e => onResponseNotOk(new ResponseError(400, null, e.error))}
              cookiePolicy={'single_host_origin'}
            />
          </div>
        )}
        handleClose={() => setInfo({ alert: info.alert, isOpen: false, code: 0 })}
        onDeleteAccount={deleteAccount}
      />
    </div>
  );
}

export default App;
