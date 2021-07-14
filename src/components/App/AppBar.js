import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Profile from './Profile';
import words from '../../util/words.png';

import {
  InputBase,
  Toolbar,
  AppBar,
} from '@material-ui/core';

import {
  Search as SearchIcon,
  RefreshRounded as RefreshRoundedIcon,
  Add as AddIcon,
} from '@material-ui/icons';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    top: 0,
    marginBottom: 10,
    width: '75%',
    backgroundImage: 'linear-gradient(to right, #ffffff , #006080)',
    borderRadius: '10px',
    minHeight: '5%'
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
  button: {
    position: 'relative',
    borderRadius: '0px 10px 10px 0px',
    width: '10%',
    display: 'flex',
    background: 'linear-gradient(45deg, #35F321 30%, #75ED89 60%)',
    // borderStyle: 'none',
    border: 'none',
    overflow: 'hidden',
    cursor: 'pointer',

  },
  refresh: {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    cursor: 'pointer',
    '&:hover': {
      // backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    // borderStyle: 'none',
  },
  searchIcon: {
    paddingRight: '2%',
    paddingLeft: '2%',
    color: 'black',
    display: 'flex',
    alignItems: 'center',
  },
  divider: {
    height: 28,
    display: 'flex',
    alignItems: 'center',
    color: 'black',
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
  onAdd,
  isValid,
  setWord,
  setMeaning,
  word,
  meaning,
  setValidity,
}) {
  const classes = useStyles();

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
              />
            </div>
            <button
              className={classes.button}
              onClick={onAdd}
            >
              <AddIcon style={{
                margin: 'auto',
                height: '40px',
                width: '40px',
                color: 'white',
              }} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              className={classes.refresh}
              onClick={onReset}
              disabled={!isResetEnabled}
            >
              <RefreshRoundedIcon
                aria-label="RefreshRounded"
                aria-controls="long-menu"
                aria-haspopup="true"
                style={{ stroke: 'white', color: 'white' }}
              />
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
  isValid: PropTypes.bool,
  word: PropTypes.string,
  meaning: PropTypes.string,
  onAdd: PropTypes.func,
  setWord: PropTypes.func,
  setMeaning: PropTypes.func,
  setValidity: PropTypes.func,
};
