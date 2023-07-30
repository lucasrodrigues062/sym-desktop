/* eslint-disable @typescript-eslint/no-shadow */
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import { Box, FormControl, IconButton, MenuItem, Select } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/pt-br';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { PedidoPalm } from 'main/channels/buscaPedidoPalm';

interface IFilialProps {
  filial: string;
  codFilial: string;
}

interface SearchBarProps {
  setPedidos: (arg: PedidoPalm[]) => void;
}

export default function SearchBar({ setPedidos }: SearchBarProps) {
  const initialDay = dayjs().startOf('month').format('YYYY-MM-DD');
  const endDay = dayjs().endOf('month').format('YYYY-MM-DD');
  const [filiais, setFiliais] = useState<IFilialProps[]>([]);
  const [origens, setOrigens] = useState<string[]>([]);
  const [selectedFilial, setSelectedFilial] = useState<string>('0');
  const [selectedOrigem, setSelectedOrigem] = useState<string>('');
  const [dataInicial, setDataInicial] = useState<string>(initialDay);
  const [dataFinal, setDataFinal] = useState<string>(endDay);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    console.log(arg);
    setPedidos(arg as PedidoPalm[]);
    setIsLoading(false);
  });

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
        <IconButton
          size="large"
          color="inherit"
          onClick={handleSearch}
          disabled={isLoading}
        >
          <SearchOutlinedIcon />
        </IconButton>
        <IconButton size="large" color="inherit">
          <CheckCircleOutlinedIcon />
        </IconButton>
        <IconButton size="large" color="inherit">
          <CachedOutlinedIcon />
        </IconButton>
        <IconButton size="large" color="inherit">
          <DriveFileMoveOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
