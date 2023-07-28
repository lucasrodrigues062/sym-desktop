import { CssBaseline } from '@mui/material';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

import Teste from './teste';

function Home() {
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
