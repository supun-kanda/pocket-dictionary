import React, { useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';

import PropTypes from 'prop-types';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CodeIcon from '@material-ui/icons/Code';

const { REACT_APP_VERSION: VERSION } = process.env;
export default function Profile({
    userData: {
        name,
        email,
    },
    deleteAccount,
    logOut,
    isOpen,
    setOpen,
}) {
    const [anchorEl, setAnchorEl] = useState(null);

    /**
     * on profile menu click
     * @param {Event} event event
     */
    const handleClick = (event) => {
        setOpen(true);
        setAnchorEl(event.currentTarget);
    };

    /**
     * on profile menu close
     */
    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false);
    };

    return (
        <div>
            <Tooltip title='Personal'>
                <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    style={{ stroke: 'white', color: 'white', strokeWidth: 2 }}
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
            </Tooltip>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={isOpen}
                onClose={handleClose}
            >
                <StyledMenuItem disabled>
                    <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={name || email || `Guest`} />
                </StyledMenuItem>
                <StyledMenuItem onClick={logOut}>
                    <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </StyledMenuItem>
                <StyledMenuItem onClick={deleteAccount}>
                    <ListItemIcon>
                        <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete Account" />
                </StyledMenuItem>
                <StyledMenuItem disabled>
                    <ListItemIcon>
                        <CodeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`v${VERSION}`} />
                </StyledMenuItem>
            </StyledMenu>
        </div>
    );
}

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

Profile.propTypes = {
    userData: PropTypes.object,
    deleteAccount: PropTypes.func,
    logOut: PropTypes.func,
    isOpen: PropTypes.bool,
    setOpen: PropTypes.func,
};