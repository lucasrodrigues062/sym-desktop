import { Box, IconButton, InputBase, useTheme } from '@mui/material';
import { useContext } from 'react';

import DarkModelOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModelOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsModelOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import SettingsModelOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { ColorModeContext, tokens } from 'renderer/styles/theme';
import SideBar from '../SideBar';

function Topbar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display="flex" justifyContent="space-between">
      <SideBar />
      <Box display="flex" justifyContent="space-between" p={2}>
        <Box
          display="flex"
          borderRadius="3px"
          sx={{ backgroundColor: colors.primary[400] }}
        >
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? (
              <DarkModelOutlinedIcon />
            ) : (
              <LightModelOutlinedIcon />
            )}
          </IconButton>
          <IconButton>
            <NotificationsModelOutlinedIcon />
          </IconButton>
          <IconButton>
            <SettingsModelOutlinedIcon />
          </IconButton>
          <IconButton>
            <PersonOutlinedIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default Topbar;
