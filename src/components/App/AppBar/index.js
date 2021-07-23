import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Profile from './Profile';
import words from '../../../util/words.png';

import {
  InputBase,
  Toolbar,
  AppBar,
  Tooltip,
} from '@material-ui/core';

import {
  Search as SearchIcon,
  RefreshRounded as RefreshRoundedIcon,
  Add as AddIcon,
} from '@material-ui/icons';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    marginBottom: 10,
    width: '75%',
    backgroundImage: 'linear-gradient(to right, #ffffff , #3e50b0)', //rgba(62,80,176,255)
    borderRadius: '10px',
    minHeight: '50px',
  },
  bar: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    maxHeight: 'inherit',
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: '10px 0px 0px 10px',
    backgroundColor: 'white',
    width: '90%',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 10,
  },
  error: {
    backgroundColor: 'red',
  },
  button: {
    position: 'relative',
    borderRadius: '0px 10px 10px 0px',
    width: '10%',
    display: 'flex',
    background: 'linear-gradient(45deg, #35F321 30%, #75ED89 60%)',
    border: 'none',
    overflow: 'hidden',
    cursor: 'pointer',
    '&:disabled': {
      background: '#cccccc',
      cursor: 'default',
    },
  },
  refresh: {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    cursor: 'pointer',
  },
  searchIcon: {
    paddingRight: '2%',
    paddingLeft: '2%',
    color: 'black',
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function Bar({
  onReset,
  isResetEnabled,
  userData,
  deleteAccount,
  logOut,
  isOpen,
  setOpen,
  onSearchChange,
  isAddDisabled,
  onAdd,
  keyword,
}) {
  const classes = useStyles();

  /**
   * handle on enter key press
   * @param {Event} e event
   */
  const onKeyPress = e => {
    if (e.charCode === 13 && !isAddDisabled) {
      onAdd();
    }
  }

  return (
    <div>
      <AppBar position="static" className={classes.root}>
        <Toolbar className={classes.bar}>
          <img src={words} />
          <div style={{ display: 'flex', flexDirection: 'row', width: '50%' }}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search or Add"
                inputProps={{ 'aria-label': 'search' }}
                onChange={onSearchChange}
                style={{ width: '100%' }}
                classes={{ error: classes.error }}
                type='search'
                value={keyword || ''}
                onKeyPress={onKeyPress}
              />
            </div>
            <button
              className={classes.button}
              onClick={onAdd}
              disabled={isAddDisabled}
            >
              <Tooltip title='Add searched term'>
                <AddIcon style={{
                  margin: 'auto',
                  height: '40px',
                  width: '40px',
                  color: 'white',
                }} />
              </Tooltip>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              className={classes.refresh}
              onClick={onReset}
              disabled={!isResetEnabled}
            >
              <Tooltip title='Refresh words'>
                <RefreshRoundedIcon
                  aria-label="RefreshRounded"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  style={{
                    color: 'white',
                    visibility: isResetEnabled ? 'visible' : 'hidden',
                  }}
                />
              </Tooltip>
            </button>
            <Profile
              userData={userData}
              logOut={logOut}
              deleteAccount={deleteAccount}
              isOpen={isOpen}
              setOpen={setOpen}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

AppBar.propTypes = {
  onReset: PropTypes.func,
  isResetEnabled: PropTypes.bool,
  userData: PropTypes.object,
  deleteAccount: PropTypes.func,
  logOut: PropTypes.func,
  isOpen: PropTypes.bool,
  setOpen: PropTypes.func,
  onSearchChange: PropTypes.func,
  isAddDisabled: PropTypes.bool,
  onAdd: PropTypes.bool,
  keyword: PropTypes.string,
};
