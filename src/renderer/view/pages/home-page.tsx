import { Box, useTheme } from '@mui/material';
import { tokens } from 'renderer/styles/theme';

function Home() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" />

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="80px"
        gap="15px"
      >
        <Box
          gridColumn="span 12"
          gridRow="span 1"
          sx={{ backgroundColor: colors.primary[400] }}
        />
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          sx={{ backgroundColor: colors.primary[400] }}
        />
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          sx={{ backgroundColor: colors.primary[400] }}
        />
      </Box>
    </Box>
  );
}

export default Home;
