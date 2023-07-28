import { CssBaseline } from '@mui/material';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

import { useState } from 'react';
import Teste from './teste';

function Home() {
  const [sqlResult, setSqlResult] = useState<string>('');

  window.electron.ipcRenderer.once('testeSql', (arg) => {
    setSqlResult(JSON.stringify(arg.recordset[0]));
    console.log(arg);
  });
  const testeSql = () => {
    window.electron.ipcRenderer.sendMessage('testeSql');
  };
  return (
    <div>
      <h1>Home</h1>

      <button
        onClick={() => {
          console.log('clicou');
          testeSql();
        }}
        type="button"
      >
        Teste
      </button>
      <span>{sqlResult}</span>
    </div>
  );
}

export default function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teste" element={<Teste />} />
        </Routes>
      </Router>
    </>
  );
}
