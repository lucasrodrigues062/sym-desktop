import { Box, useTheme } from '@mui/material';
import { PedidoPalm } from 'main/channels/buscaPedidoPalm';
import { useState } from 'react';
import { tokens } from 'renderer/styles/theme';
import SearchBar from '../components/SearchBar';
import PedidoPalmTableProps from '../components/PedidoPalmGrid';
import PedidoPalmTable from '../components/PedidoPalmGrid';

function Home() {
  const [pedidos, setPedidos] = useState<PedidoPalm[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<PedidoPalm | null>(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" />

      <Box display="flex" flexDirection="column" gap="15px">
        <Box
          gridColumn="span 12"
          gridRow="span 1"
          pb={1.75}
          sx={{ backgroundColor: colors.primary[400] }}
        >
          <SearchBar setPedidos={setPedidos} pedido={selectedPedido} />
        </Box>
        <Box sx={{ backgroundColor: colors.primary[400] }}>
          <PedidoPalmTable pedidos={pedidos} setPedido={setSelectedPedido} />
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
