import { CssBaseline, ThemeProvider } from '@mui/material';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

import HomePage from './view/pages/home-page';
import LoginPage from './view/pages/login-page';
import { ColorModeContext, useMode } from './styles/theme';
import Topbar from './view/components/TopBar';

export default function App() {
  const [theme, colorMode] = useMode();

  return (
    <>
      {/* @ts-ignore */}
      <ColorModeContext.Provider value={colorMode}>
        {/* @ts-ignore */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Topbar />

          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}
