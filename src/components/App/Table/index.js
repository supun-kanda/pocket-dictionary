import React, { useState, useEffect } from 'react';
import {
  List,
  AutoSizer,
} from "react-virtualized";
import { makeStyles } from '@material-ui/core/styles';
import Row, { EditableRow } from './Row';
import PropTypes from 'prop-types';

import { resetValidity } from '../../../util/util';
import { INVALID_INPUTS, ROW_MODS } from '../../../util/const';

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
  setEditor,
  setAbort,
  source,
  map,
  onSubmit,
  onEdit,
  expandedKey,
  setExpandedKey,
  onDeleteWord,
  onViewIncrement,
  onViewReset,
}) {
  const classes = useStyles();
  const [scrollTo, setScrollTo] = useState(-1);

  const getRowHeight = (props) => {
    return data[props.index].key === expandedKey ? 160 : 50;
  }

  const handleExpandClick = index => {
    const newKey = data[index].key;
    const isExpanded = expandedKey !== newKey;

    setExpandedKey(isExpanded ? newKey : null);

    if (isExpanded && !exposed.includes(newKey)) {
      setExposed([...exposed, newKey]);
      if (newKey >= 0) {
        onViewIncrement(newKey);
      }
    }

    // scroll to event index
    setScrollTo(index);

    DynamicRows.recomputeRowHeights();
    DynamicRows.forceUpdate();
  };

  /**
   * componentDidUpdate with keyword change
   */
  useEffect(() => {
    const editMode = editor.mode;
    if ([ROW_MODS.UPDATE, ROW_MODS.WRITE].includes(editMode)) {
      setExpandedKey(editor.key);
      if (editMode === ROW_MODS.WRITE) {
        setScrollTo(0);
      }
    }
    DynamicRows.recomputeRowHeights();
    DynamicRows.forceUpdate();
  }, [keyword, editor, setExpandedKey]);

  /**
   * Update row heights on data changes
   */
  useEffect(() => {
    DynamicRows.recomputeRowHeights();
    DynamicRows.forceUpdate();
  }, [data]);

  const renderRow = ({ index, key, style }) => {
    const currWordId = data[index].key;
    const isExpanded = currWordId === expandedKey;

    return currWordId === editor.key && isExpanded ? (
      <EditableRow
        key={key}
        index={index}
        rowKey={key}
        style={style}
        handleExpandClick={handleExpandClick}
        word={editor.word}
        meaning={editor.meaning}
        synonyms={editor.synonyms || []}
        onWordCange={e => setEditor({ ...editor, word: e.target.value, ...resetValidity(INVALID_INPUTS.WORD, editor.errCodes) })}
        onMeaningChange={e => setEditor({ ...editor, meaning: e.target.value, ...resetValidity(INVALID_INPUTS.MEANING, editor.errCodes) })}
        onSynonymChange={v => setEditor({ ...editor, synonyms: v, ...resetValidity(INVALID_INPUTS.SYNONYM, editor.errCodes) })}
        isExpanded={isExpanded}
        editMode={editor.mode}
        setAbort={() => setAbort(true)}
        source={source}
        map={map}
        onSubmit={onSubmit}
        isValid={editor.isValid}
        errCodes={editor.errCodes}
      />
    ) : (
      <Row
        key={key}
        isExpanded={isExpanded}
        index={index}
        rowKey={key}
        style={style}
        data={data || []}
        handleExpandClick={handleExpandClick}
        exposed={exposed}
        getWordByKey={getWordByKey}
        onEdit={onEdit}
        onDeleteWord={onDeleteWord}
        onViewReset={onViewReset}
      />
    )
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
              noRowsRenderer={() =>
                <div style={{ opacity: 0.2 }}>
                  <h1>Start by adding Words</h1>
                </div>
              }
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
  getWordByKey: PropTypes.func,
  keyword: PropTypes.string,
  editor: PropTypes.object.isRequired,
  setEditor: PropTypes.func.isRequired,
  setAbort: PropTypes.func,
  source: PropTypes.array,
  map: PropTypes.object,
  onSubmit: PropTypes.func,
  onEdit: PropTypes.func,
  expandedKey: PropTypes.number,
  setExpandedKey: PropTypes.func.isRequired,
  onDeleteWord: PropTypes.func.isRequired,
  onViewIncrement: PropTypes.func.isRequired,
  onViewReset: PropTypes.func.isRequired,
};
