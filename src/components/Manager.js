import React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
});

export default function Manager({
    onViewAll,
    onReset,
    isResetEnabled,
    isViewEnabled,
}) {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Button variant="contained" disabled={!isViewEnabled} color="secondary" onClick={onViewAll} >
                View All
            </Button>
            <div style={{ width: 10 }} />
            <Button variant="contained" disabled={!isResetEnabled} onClick={onReset}>
                Reset
            </Button>
        </Box>
    );
}

Manager.propTypes = {
    onViewAll: PropTypes.func,
    onReset: PropTypes.func,
    isResetEnabled: PropTypes.bool,
    isViewEnabled: PropTypes.bool,
};