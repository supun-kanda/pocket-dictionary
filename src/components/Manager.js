import React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Profile from './Profile';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
    user: {
        display: 'flex',
        justifyContent: 'flex-start',
    },
});

export default function Manager({
    onViewAll,
    onReset,
    isResetEnabled,
    isViewEnabled,
    userData,
    deleteAccount,
    logOut,
}) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Box className={classes.root}>

                <Button variant="contained" disabled={!isViewEnabled} color="secondary" onClick={onViewAll} >
                    View All
                </Button>
                <div style={{ width: 10 }} />
                <Button variant="contained" disabled={!isResetEnabled} onClick={onReset}>
                    Reset
                </Button>
                {/* <div style={{ width: 10 }} /> */}
                <Profile
                    userData={userData}
                    logOut={logOut}
                    deleteAccount={deleteAccount}
                />
            </Box>
        </div>
    );
}

Manager.propTypes = {
    onViewAll: PropTypes.func,
    onReset: PropTypes.func,
    isResetEnabled: PropTypes.bool,
    isViewEnabled: PropTypes.bool,
    userData: PropTypes.object,
    deleteAccount: PropTypes.func,
    logOut: PropTypes.func,
};
