import { CssBaseline } from '@mui/material';
import { Link, Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import Teste from './teste';

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/teste">
        <button type="button">Teste</button>
      </Link>
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
