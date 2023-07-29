import { CssBaseline } from '@mui/material';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

import HomePage from './view/pages/home-page';
import LoginPage from './view/pages/login-page';

export default function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    </>
  );
}
