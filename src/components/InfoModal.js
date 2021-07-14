import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function getTitle(code) {
    let title;
    switch (code) {
        case 27:
            title = 'Login';
            break;
        case 9:
            title = 'Delet Account';
            break;
        case 17:
            title = 'Login Issue';
            break;
        default:
            title = 'Alert';
            break;
    }
    return title;
}
export default function InfoModal({
    isOpen,
    alert,
    showLogin,
    Login,
    handleClose,
    code,
    onDeleteAccount,
}) {
    const getModalActions = (statusCode, onClose, onDelete) => {
        let component;
        switch (statusCode) {
            case 27:
                component = null;
                break;
            case 9:
                component = (
                    <div>
                        <Button onClick={onDelete} color="secondary">
                            DELETE
                        </Button>
                        <Button onClick={onClose} color="primary">
                            CANCEL
                        </Button>
                    </div>);
                break;
            default:
                component = (
                    <div>
                        <Button onClick={onClose} color="primary">
                            OK
                        </Button>
                    </div>)
                break;
        }
        return component;
    }
    return (
        <div>
            <Dialog
                open={isOpen}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{getTitle(code)}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {alert}
                    </DialogContentText>
                    {showLogin ? Login() : null}
                </DialogContent>
                <DialogActions>
                    {getModalActions(code, handleClose, onDeleteAccount)}
                </DialogActions>
                {
                }
            </Dialog>
        </div>
    );
}

InfoModal.propTypes = {
    alert: PropTypes.string,
    code: PropTypes.number,
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func,
    Login: PropTypes.func,
    showLogin: PropTypes.bool.isRequired,
    onDeleteAccount: PropTypes.func,
};