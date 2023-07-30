import { Box, useTheme } from '@mui/material';
import { PedidoPalm } from 'main/channels/buscaPedidoPalm';
import { useState } from 'react';
import { tokens } from 'renderer/styles/theme';
import SearchBar from '../components/SearchBar';
import PedidoPalmTableProps from '../components/PedidoPalmGrid';
import PedidoPalmTable from '../components/PedidoPalmGrid';

function Home() {
  const [pedidos, setPedidos] = useState<PedidoPalm>([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" />

      <Box
        display="flex"
        flexDirection="column"
        // gridTemplateColumns="repeat(12, 1fr)"
        // gridAutoRows="80px"
        gap="15px"
      >
        <Box
          gridColumn="span 12"
          gridRow="span 1"
          sx={{ backgroundColor: colors.primary[400] }}
        >
          <SearchBar setPedidos={setPedidos} />
        </Box>
        <Box
          // gridColumn="span 12"
          // gridRow="span 3"
          sx={{ backgroundColor: colors.primary[400] }}
        >
          <PedidoPalmTable pedidos={pedidos} />
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
