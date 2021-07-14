import React, { useState } from 'react';

// styles
import '../Main.css';

// components
import InfoModal from './InfoModal';
import { GoogleLogin } from 'react-google-login';
import Loader from './Loader';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import App from './App';
import Login from './Login';

import { setUserData as setLocalStorage } from '../util/util';
import { userInitialState, infoInitialState } from '../util/const';
import { StatusCodes } from 'http-status-codes';

const { GOOGLE_CLIENT_ID } = process.env;

function Main() {

  const [isTableLoading, setTableLoading] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [info, setInfo] = useState({ ...infoInitialState });
  const [userData, setUserData] = useState({ ...userInitialState });
  const [shouldClear, setShouldClear] = useState(false);

  const onResponseNotOk = error => {
    const statusCode = error.code;
    if (statusCode && [StatusCodes.UNAUTHORIZED, StatusCodes.FORBIDDEN].includes(statusCode)) {
      setLoginModalOpen(true);
      setInfo({
        isOpen: true,
        alert: `${statusCode} Please Log In Again`,
        code: 27,
      });
      setLocalStorage('');
      return true;
    }

    setLoginModalOpen(false);
    setInfo({ isOpen: true, alert: error.message, code: 0 });
    return false;
  }

  const getGoogleLogin = () => (
    <div onClick={() => setInfo({ ...infoInitialState })}>
      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
        buttonText="Log in with Google"
        cookiePolicy={'single_host_origin'}
        uxMode="redirect"
        redirectUri="https://dictionary.supun-kandambige.com/login"
      />
    </div>
  )

  return (
    <div className="App">

      <Router>
        <Switch>
          <Route path='/login'>
            <Login
              setInfo={setInfo}
              setUserData={setUserData}
              getGoogleLogin={getGoogleLogin}
            />
          </Route>
          <Route path='/'>
            <App
              info={info}
              setInfo={setInfo}
              isTableLoading={isTableLoading}
              setTableLoading={setTableLoading}
              isLoginModalOpen={isLoginModalOpen}
              setLoginModalOpen={setLoginModalOpen}
              userData={userData}
              setUserData={setUserData}
              shouldClear={shouldClear}
              setShouldClear={setShouldClear}
              onResponseNotOk={onResponseNotOk}
            />
          </Route>
        </Switch>
      </Router>

      <Loader isLoading={isTableLoading} />
      <InfoModal
        isOpen={info.isOpen}
        showLogin={isLoginModalOpen}
        alert={info.alert}
        code={info.code}
        Login={getGoogleLogin}
        handleClose={() => setInfo({ alert: info.alert, isOpen: false, code: 0 })}
        onDeleteAccount={() => setShouldClear(true)}
      />
    </div>
  );
}

export default Main;
