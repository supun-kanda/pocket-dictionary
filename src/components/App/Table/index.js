import React, { useState, useEffect } from 'react';
import {
  List,
  AutoSizer,
} from "react-virtualized";
import { makeStyles } from '@material-ui/core/styles';
import Row from './Row';
import PropTypes from 'prop-types';
import { ROW_MODS } from '../../../util/const';

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
}));

let DynamicRows;
function setRef(ref) {
  DynamicRows = ref;
}
export default function Table({
  data,
  exposed,
  setExposed,
  getWordByKey,
  keyword,
  editor,
}) {
  const classes = useStyles();
  const [expandedKey, setExpandedKey] = useState(null);
  const [scrollTo, setScrollTo] = useState(-1);
  const getRowHeight = (props) => {
    return data[props.index].key === expandedKey ? 100 : 50;
  }

  const handleExpandClick = index => {
    const newKey = data[index].key;
    const isExpanded = expandedKey !== newKey;

    setExpandedKey(isExpanded ? newKey : null);

    if (isExpanded && !exposed.includes(newKey)) {
      setExposed([...exposed, newKey]);
    }

    DynamicRows.recomputeRowHeights();
    DynamicRows.forceUpdate();
  };

  /**
   * componentDidUpdate with keyword change
   */
  useEffect(() => {
    const editMode = editor.mode;
    if ([ROW_MODS.UPDATE, ROW_MODS.WRITE].includes(editMode)) {
      setExpandedKey(editor.id);
      if (editMode === ROW_MODS.WRITE) {
        setScrollTo(0);
      }
    }
    DynamicRows.recomputeRowHeights();
    DynamicRows.forceUpdate();
  }, [keyword, editor]);

  const renderRow = ({ index, key, style }) => {
    return (
      <Row
        key={key}
        isExpanded={data[index].key === expandedKey}
        index={index}
        rowKey={key}
        style={style}
        data={data || []}
        handleExpandClick={handleExpandClick}
        exposed={exposed}
        getWordByKey={getWordByKey}
      />
    );

  };

  return (
    <div className={classes.root} >
      <AutoSizer>
        {
          ({ width, height }) => {
            return <List
              ref={setRef}
              width={width}
              height={height}
              rowHeight={getRowHeight}
              rowRenderer={renderRow}
              rowCount={data.length || 0}
              overscanRowCount={10}
              scrollToIndex={scrollTo}
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
  getWordByKey: PropTypes.func,
  keyword: PropTypes.string,
  editor: PropTypes.object,
};
