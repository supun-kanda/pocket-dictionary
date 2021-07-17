import React, { useState } from 'react';
import { List, AutoSizer } from "react-virtualized";
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import clsx from 'clsx';

import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.6em'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 10px rgba(0,0,0,0.3)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'darkgrey',
      outline: '2px solid slategrey',
    }
  },
  root: {
    padding: '10px',
    height: '100%',
    top: '50px',
  },
  row: {
    borderBottom: '1px solid #ebeced',
    textAlign: 'left',
    margin: '5px 0',
    alignItems: 'center',
    '&:hover $expand': {
      visibility: 'visible',
    },
    '&:hover $expandOpen': { // <-- pay attention to usage of $
      visibility: 'visible',
    },
  },
  word: {
    display: 'inline-block',
    position: 'relative',
    width: '30%',
    left: '1%'
  },
  meaning: {
    display: 'inline-block',
    position: 'relative',
    width: '54%',
  },
  views: {
    display: 'inline-block',
    opacity: '0.2',
    width: '10%'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    visibility: 'hidden',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
    visibility: 'hidden',
  },
}));

export default function Table({
  data,
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const renderRow = ({ index, key, style }) => {
    return (
      <div key={key} style={style} className={classes.row} onClick={handleExpandClick}>
        <div>
          <div className={classes.word}>
            <h3>{data[index].word}</h3>
          </div>
          <div className={classes.meaning}>{data[index].meaning}</div>
          <div className={classes.views}>
            123
            <div style={{
              verticalAlign: 'middle',
              paddingLeft: '5px',
              display: 'inline-block',
            }}><VisibilityIcon /></div>
          </div>
          <div style={{ display: 'inline-block' }}>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </div>
        </div>
      </div >
    )
  };

  return (
    <div className={classes.root} >
      <AutoSizer>
        {
          ({ width, height }) => {
            return <List
              width={width}
              height={height}
              rowHeight={50}
              rowRenderer={renderRow}
              rowCount={data.length || 0}
              overscanRowCount={10}
            />
          }
        }
      </AutoSizer>
    </div>
  );
}

Table.propTypes = {
  data: PropTypes.array,
  exposed: PropTypes.array,
  setExposed: PropTypes.func,
  setViewingData: PropTypes.func,
  viewingData: PropTypes.array,
  setViewEnabled: PropTypes.func,
  updateViewdWords: PropTypes.func,
};
