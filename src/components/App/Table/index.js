import React from 'react';
import { List, AutoSizer } from "react-virtualized";
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
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
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function Table({
  data,
}) {
  const classes = useStyles();

  const renderRow = ({ index, key, style }) => {
    return (
      <div key={key} style={style} className={classes.row}>
        <div className={classes.content}>
          <div>{data[index].word}</div>
          <div>{data[index].meaning}</div>
        </div>
      </div>
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
