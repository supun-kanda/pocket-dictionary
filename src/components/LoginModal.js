import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';
import { GOOGLE_CLIENT_ID } from '../util/const';

const useStyles = makeStyles(() => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        boxShadow: '0px 0px 100px 0px white',
    },
}));

export default function LoginModal({
    isOpen,
    setOpen,
    onSuccess,
    onFailure,
}) {
    const classes = useStyles();

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={isOpen}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={isOpen}>
                    <div className={classes.paper}>
                        <GoogleLogin
                            clientId={GOOGLE_CLIENT_ID}
                            buttonText="Log in with Google"
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}

LoginModal.prototype = {
    isOpen: PropTypes.bool,
    setOpen: PropTypes.func,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
}