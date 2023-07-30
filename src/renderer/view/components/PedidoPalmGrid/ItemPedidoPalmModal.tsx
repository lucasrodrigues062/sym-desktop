import { Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ItemPedidopalm } from 'main/channels/buscaPedidoPalm';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface CustomizedDialogsProps {
  open: boolean;
  handleOpen: (open: boolean) => void;
  rows: ItemPedidopalm[];
}
export default function CustomizedDialogs({
  open,
  handleOpen,
  rows,
}: CustomizedDialogsProps) {
  const handleClose = () => {
    handleOpen(false);
  };

  const columns: GridColDef[] = [
    { field: 'IdItempedidopalm', headerName: 'IdItemPedido' },
    {
      field: 'NOMEPRODUTO',
      headerName: 'Nome Produto',
      cellClassName: 'name-column--cell',
      width: 200,
    },
    {
      field: 'CodProduto',
      headerName: 'Cod. Produto',
      type: 'string',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'CODEAN',
      headerName: 'Cod. Produto Arq',
      width: 200,
    },
    {
      field: 'Qtd',
      headerName: 'Qtd',
      type: 'number',
    },
    {
      field: 'SituacaoItemPedido',
      headerName: 'Situacao',
      width: 80,
    },
    {
      field: 'CodRetornoItem',
      headerName: 'Cod. Retorno',
    },
    {
      field: 'DscRetornoItem',
      headerName: 'Desc. Retorno',
      width: 200,
    },
    {
      field: 'QtdConfirmada',
      headerName: 'Qtd Confirmada',
    },
  ];

  return (
    <BootstrapDialog
      fullWidth
      maxWidth="lg"
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DataGrid
        getRowId={(row) => row.IdItempedidopalm}
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
      />
    </BootstrapDialog>
  );
}
