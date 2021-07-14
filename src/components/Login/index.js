import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { ClipLoader } from 'react-spinners'
import {
    useLocation,
    Redirect,
} from 'react-router-dom';
import {
    getTokenId,
    setUserData as setLocalStorage,
} from '../../util/util';
import { getUserInfo } from '../../actions/user';
import PropTypes from 'prop-types';

export default function Login({
    setInfo,
    setUserData,
    getGoogleLogin,
}) {
    const location = useLocation();
    const [loginSuccessful, setLoginSuccessful] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);

    const announceLoginIssue = (error) => {
        setInfo({
            isOpen: true,
            alert: error.message || 'Error occured while login in',
            code: 17,
        });
        setLoginFailed(true);
    }

    const onTokenAquisition = async () => {
        const hash = location.hash;
        if (hash) {
            try {
                const tokenId = getTokenId(hash);
                const { id, email, name } = await getUserInfo(tokenId);

                setUserData({ userId: id, email, name, tokenId });
                setLocalStorage({ userId: id, email, name, tokenId });

                setLoginSuccessful(true);
            } catch (error) {
                announceLoginIssue(error);
            }

        } else {
            announceLoginIssue({});
        }
    }

    const getTryAgain = () => (
        <div>
            <h2>Try Again</h2>
            <br />
            {getGoogleLogin()}
        </div>);

    useEffect(() => {
        async function asyncFunc() {
            onTokenAquisition();
        }

        asyncFunc();
    }, [location.hash]);

    return (
        <div>
            {loginSuccessful ? <Redirect to='/' /> : null}
            <Dialog
                open={true}
                PaperProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                }}
                BackdropProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                }}
            >
                <div style={{
                    overflow: 'hidden'
                }}>
                    {loginFailed ? null : <ClipLoader color={'blue'} loading={true} css='override' size={100} />}
                    {loginFailed ? getTryAgain() : <h2>Loggin In</h2>}
                </div>

            </Dialog>
        </div>
    );
}

Login.propTypes = {
    setInfo: PropTypes.func,
    setUserData: PropTypes.func,
    getGoogleLogin: PropTypes.func,
};
