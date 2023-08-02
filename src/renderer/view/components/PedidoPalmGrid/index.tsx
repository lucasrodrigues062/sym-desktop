import { Box, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { ItemPedidopalm, PedidoPalm } from 'main/channels/buscaPedidoPalm';
import { tokens } from 'renderer/styles/theme';

import { useEffect, useState } from 'react';
import ItemPedidoModal from './ItemPedidoPalmModal';

interface PedidoPalmTableProps {
  pedidos: PedidoPalm[];
  setPedido: (arg: PedidoPalm) => void;
}

export default function PedidoPalmTable({
  pedidos,
  setPedido,
}: PedidoPalmTableProps) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<PedidoPalm | null>(null);
  const [itemsPedido, setItemsPedido] = useState<ItemPedidopalm[]>([]);

  useEffect(() => {
    if (selectedPedido !== null) {
      window.electron.ipcRenderer.sendMessage(
        'buscaItemPedidoPalm',
        selectedPedido?.IdPedidoPalm
      );
    }
  }, [selectedPedido]);

  window.electron.ipcRenderer.once('buscaItemPedidoPalm', (arg) => {
    setItemsPedido(arg as ItemPedidopalm[]);
  });

  const columns: GridColDef[] = [
    { field: 'IdPedidoPalm', headerName: 'IdPedido' },
    { field: 'CodFilial', headerName: 'Cod. Filial' },
    {
      field: 'Origem',
      headerName: 'Origem',
      cellClassName: 'name-column--cell',
    },
    {
      field: 'NumPedidoPalm',
      headerName: 'Num. Pedido',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'DataPedido',
      headerName: 'Data Pedido',
    },
    {
      field: 'CodCliFor',
      headerName: 'Cod. Cliente',
    },
    {
      field: 'CnpjCpfCliFor',
      headerName: 'CPF/CNPJ',
    },
    {
      field: 'TotalPedido',
      headerName: 'Vr. Total',
    },
    {
      field: 'Observacoes',
      headerName: 'Obs',
    },
    {
      field: 'SituacaoPedido',
      headerName: 'Situacao',
    },
    {
      field: 'NOMECLIFOR',
      headerName: 'Fantasia',
    },
    {
      field: 'NOMEVENDEDOR',
      headerName: 'Vendedor',
    },
    {
      field: 'CONDPAG',
      headerName: 'Cond. Pagamento',
    },
    {
      field: 'TipoMovGerado',
      headerName: 'Tipo Mov. Gerado',
    },
    {
      field: 'SituacaoMov',
      headerName: 'Situacao Mov.',
    },
    {
      field: 'CodRetorno',
      headerName: 'Cod. Retorno',
    },
    {
      field: 'DscRetorno',
      headerName: 'Dsc. Retorno',
    },
    {
      field: 'NumNF',
      headerName: 'Num NF',
    },
    {
      field: 'NumPedidoCRONOS',
      headerName: 'Num. Pedido Cronos',
    },
    {
      field: 'ArqRetPed',
      headerName: 'Arq. Ret Ped',
    },
    {
      field: 'ArqRet2Ped',
      headerName: 'Arq. Ret NF',
    },
  ];

  return (
    <Box
      height="75vh"
      sx={{
        '& .MuiDataGrid-root': {
          border: 'none',
        },
        '& .MuiDataGrid-cell': {
          borderBottom: 'none',
        },
        '& .name-column--cell': {
          color: colors.greenAccent[300],
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: colors.blueAccent[700],
          borderBottom: 'none',
        },
        '& .MuiDataGrid-virtualScroller': {
          backgroundColor: colors.primary[400],
        },
        '& .MuiDataGrid-footerContainer': {
          borderTop: 'none',

          backgroundColor: colors.blueAccent[700],
        },
        '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
          color: `${colors.grey[100]} !important`,
        },
      }}
    >
      <DataGrid
        getRowId={(row) => row.IdPedidoPalm}
        rows={pedidos}
        columns={columns}
        onRowClick={(e) => {
          setPedido(e.row);
          setSelectedPedido(e.row);
        }}
        onRowDoubleClick={(e) => {
          setOpen(true);
        }}
        components={{ Toolbar: GridToolbar }}
      />
      <ItemPedidoModal open={open} handleOpen={setOpen} rows={itemsPedido} />
    </Box>
  );
}
