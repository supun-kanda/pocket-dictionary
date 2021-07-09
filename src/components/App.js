import Table from './CustomPaginationActionsTable'
import Manager from './Manager'
import Adder from './Adder'
import React, { useState, useEffect } from 'react';
import {
  fetchTableData,
  updateTableData,
  updateViewdWords,
} from '../actions/tableData';
import { ClipLoader } from 'react-spinners'
import '../App.css';

function App() {

  // adder
  const [isValid, setValidity] = useState(true);
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [isTableLoading, setTableLoading] = useState(true);

  // table
  const [tableData, setTableData] = useState([]);
  const [exposed, setExposed] = useState([]);
  const [viewingData, setViewingData] = useState([]);

  // manager
  const [isResetEnabled, setResetEnabled] = useState(false);
  const [isViewEnabled, setViewEnabled] = useState(true);

  const onAdd = async () => {
    setTableLoading(true);

    if (!word || !meaning || tableData.find(e => e.word === word)) {
      setValidity(false);
      return setTableLoading(false);

    }

    try {
      // add new word to the table
      const wordId = await updateTableData({ word, meaning });

      // update react states
      setTableData([
        { word, meaning, key: wordId },
        ...tableData
      ]);
      setExposed([...exposed, `${wordId}`]);
      setWord('');
      setMeaning('');

    } catch (error) {
      setValidity(false);

    } finally {
      setTableLoading(false);
    }

  };

  const onViewAll = () => {
    const viewedIds = viewingData.map(e => `${e.key}`);
    const newlyExposed = viewedIds.filter(e => !exposed.includes(e));

    setExposed([...exposed, ...newlyExposed]);
    updateViewdWords(viewedIds);
    setViewEnabled(false);
  }

  const onReset = async () => {
    setTableLoading(true);
    setTableData(await fetchTableData());
    setResetEnabled(false);
    setExposed([]);
    setViewEnabled(true);
    setTableLoading(false);
  }

  useEffect(() => {
    setTableLoading(true);
    async function fetchData() {
      setTableData(await fetchTableData());
    }

    fetchData();
    setTableLoading(false);
  }, []);

  useEffect(() => {
    if (exposed.length) {
      setResetEnabled(true);
    }
  }, [exposed]);

  return (
    <div className="App">
      <Manager
        onViewAll={onViewAll}
        onReset={onReset}
        isResetEnabled={isResetEnabled}
        isViewEnabled={isViewEnabled}
      />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <ClipLoader color={'blue'} loading={isTableLoading} css={'override'} size={150} />
      </div>
      <Table
        data={tableData}
        exposed={exposed}
        setExposed={setExposed}
        viewingData={viewingData}
        setViewingData={setViewingData}
        setViewEnabled={setViewEnabled}
      />
      <Adder
        isValid={isValid}
        word={word}
        meaning={meaning}
        onAdd={onAdd}
        setWord={setWord}
        setMeaning={setMeaning}
        setValidity={setValidity}
      />
    </div>
  );
}

export default App;
