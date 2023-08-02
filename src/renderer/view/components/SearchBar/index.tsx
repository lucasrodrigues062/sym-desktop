/* eslint-disable @typescript-eslint/no-shadow */
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import {
  Alert,
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Tooltip,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/pt-br';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { PedidoPalm } from 'main/channels/buscaPedidoPalm';
import Cookies from 'js-cookie';
import { ILoginProps } from 'renderer/view/pages/login-page';
import axios from 'axios';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';

interface IFilialProps {
  filial: string;
  codFilial: string;
}

interface SearchBarProps {
  setPedidos: (arg: PedidoPalm[]) => void;
  pedido: PedidoPalm | null;
}

interface IToast {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export default function SearchBar({ setPedidos, pedido }: SearchBarProps) {
  const initialDay = dayjs().startOf('month').format('YYYY-MM-DD');
  const endDay = dayjs().endOf('month').format('YYYY-MM-DD');
  const [filiais, setFiliais] = useState<IFilialProps[]>([]);
  const [origens, setOrigens] = useState<string[]>([]);
  const [selectedFilial, setSelectedFilial] = useState<string>('0');
  const [selectedOrigem, setSelectedOrigem] = useState<string>('');
  const [dataInicial, setDataInicial] = useState<string>(initialDay);
  const [dataFinal, setDataFinal] = useState<string>(endDay);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<IToast>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('buscaFilial');
    window.electron.ipcRenderer.sendMessage('buscaOl');
  }, []);

  window.electron.ipcRenderer.once('buscaFilial', (arg) => {
    const filiais = arg as IFilialProps[];
    setFiliais(filiais);
  });
  window.electron.ipcRenderer.once('buscaOl', (arg) => {
    setOrigens(arg as string[]);
  });

  window.electron.ipcRenderer.once('buscaPedidoPalm', (arg) => {
    setPedidos(arg as PedidoPalm[]);
    setIsLoading(false);
  });

  const handleGerarPreVenda = async () => {
    const cookies = Cookies.get('user');
    if (cookies) {
      const user = JSON.parse(cookies) as ILoginProps;
      if (pedido) {
        setIsLoading(true);
        const response = await axios.post(
          `http://${user.server}:6500/api/v1/closeup/prevenda/${pedido.IdPedidoPalm}`
        );

        setIsLoading(false);
        if (response.status === 200) {
          setToast({
            open: true,
            message: 'Pre-venda gerado com sucesso',
            severity: 'success',
          });
        } else {
          setToast({
            open: true,
            message: 'Erro ao gerar pre-venda',
            severity: 'error',
          });
        }
      } else {
        setToast({
          open: true,
          message: 'Pedido não encontrado',
          severity: 'info',
        });
      }
    }
  };

  const handleProcessarStatus = async () => {
    const cookies = Cookies.get('user');
    if (cookies) {
      const user = JSON.parse(cookies) as ILoginProps;
      if (pedido) {
        setIsLoading(true);
        const response = await axios.post(
          `http://${user.server}:6500/api/v1/closeup/processar/pedido/${pedido.IdPedidoPalm}`
        );

        setIsLoading(false);
        if (response.status === 200) {
          setToast({
            open: true,
            message: 'Pre-venda gerado com sucesso',
            severity: 'success',
          });
        } else {
          setToast({
            open: true,
            message: 'Erro ao gerar pre-venda',
            severity: 'error',
          });
        }
      } else {
        setToast({
          open: true,
          message: 'Pedido não encontrado',
          severity: 'info',
        });
      }
    }
  };

  const handleGerarRetornoPedido = async () => {
    const cookies = Cookies.get('user');
    if (cookies) {
      const user = JSON.parse(cookies) as ILoginProps;
      if (pedido) {
        setIsLoading(true);

        const response = await axios.post(
          `http://${user.server}:6500/api/v1/closeup/gerar/pedido/${pedido.IdPedidoPalm}`
        );

        setIsLoading(false);
        if (response.status === 200) {
          setToast({
            open: true,
            message: 'Retorno pedido gerado com sucesso',
            severity: 'success',
          });
        } else {
          setToast({
            open: true,
            message: 'Erro ao gerar retorno pedido',
            severity: 'error',
          });
        }
      } else {
        setToast({
          open: true,
          message: 'Pedido não encontrado',
          severity: 'info',
        });
      }
    }
  };

  const handleGerarRetornoNF = async () => {
    const cookies = Cookies.get('user');
    if (cookies) {
      const user = JSON.parse(cookies) as ILoginProps;
      if (pedido) {
        setIsLoading(true);

        const response = await axios.post(
          `http://${user.server}:6500/api/v1/closeup/gerar/nf/${pedido.IdPedidoPalm}`
        );

        setIsLoading(false);
        if (response.status === 200) {
          setToast({
            open: true,
            message: 'Retorno NF gerado com sucesso',
            severity: 'success',
          });
        } else {
          setToast({
            open: true,
            message: 'Erro ao gerar Retorno NF',
            severity: 'error',
          });
        }
      } else {
        setToast({
          open: true,
          message: 'Pedido não encontrado',
          severity: 'info',
        });
      }
    }
  };

  const handleSearch = () => {
    setIsLoading(true);
    window.electron.ipcRenderer.sendMessage('buscaPedidoPalm', {
      codfilial: selectedFilial,
      origem: selectedOrigem,
      dataini: dataInicial,
      datafim: dataFinal,
    });
  };

  return (
    <Box display="flex" justifyContent="space-between">
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={toast.severity}
          sx={{ width: '100%' }}
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      <Box width={8000} display="flex">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <Box
            display="flex"
            pt={1.75}
            pl={1.75}
            justifyContent="space-between"
          >
            <DesktopDatePicker
              label="Data Inicial"
              defaultValue={dayjs().set('date', 1)}
              sx={{ width: 150, mr: 1.75 }}
              onChange={(e) => {
                setDataInicial(dayjs(e).format('YYYY-MM-DD'));
              }}
            />
            <DesktopDatePicker
              label="Data Final"
              defaultValue={dayjs().endOf('month')}
              sx={{ width: 150 }}
              onChange={(e) => {
                setDataFinal(dayjs(e).format('YYYY-MM-DD'));
              }}
            />
          </Box>
        </LocalizationProvider>
        <Box pt={1.75} pl={1.75} display="flex" justifyContent="space-between">
          <FormControl sx={{ mr: 2 }}>
            <Select
              label="Filial"
              defaultValue={0}
              fullWidth
              onChange={(e) => {
                setSelectedFilial(e.target.value.toString());
              }}
            >
              <MenuItem value={0}>Filial</MenuItem>
              {filiais.map((filial) => (
                <MenuItem key={filial.codFilial} value={filial.codFilial}>
                  {filial.filial}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 120 }}>
            <Select
              label="Origem"
              defaultValue="0"
              fullWidth
              onChange={(e) => {
                setSelectedOrigem(e.target.value.toString());
              }}
            >
              <MenuItem value="0">OL</MenuItem>
              {origens.map((filial) => (
                <MenuItem key={filial} value={filial}>
                  {filial}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box display="flex" pt={1.75} pl={1.75}>
        <Tooltip title="Buscar">
          <IconButton
            size="large"
            color="inherit"
            onClick={handleSearch}
            disabled={isLoading}
          >
            <SearchOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Gerar Pré-Venda">
          <IconButton
            size="large"
            color="inherit"
            onClick={handleGerarPreVenda}
            disabled={isLoading}
          >
            <CheckCircleOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Status Retorno">
          <IconButton
            size="large"
            color="inherit"
            onClick={handleProcessarStatus}
            disabled={isLoading}
          >
            <CachedOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Gerar Retorno Pedido">
          <IconButton
            size="large"
            color="inherit"
            disabled={isLoading}
            onClick={handleGerarRetornoPedido}
          >
            <DriveFileMoveOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Gerar Retorno NF">
          <IconButton
            size="large"
            color="inherit"
            disabled={isLoading}
            onClick={handleGerarRetornoNF}
          >
            <DriveFolderUploadOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
