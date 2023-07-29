import { LoadingButton } from '@mui/lab';
import { Box, TextField } from '@mui/material';
import { Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

export interface ILoginProps {
  username: string;
  password: string;
  server: string;
  database: string;
}

const userSchema = yup.object().shape({
  username: yup.string().required('Obrigatorio'),
  password: yup.string().required('Obrigatorio'),
  server: yup.string().required('Obrigatorio'),
  database: yup.string().required('Obrigatorio'),
});

export default function LoginPage() {
  const initialValues = {
    username: '',
    password: '',
    server: '',
    database: '',
  };

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (values: ILoginProps) => {
    setIsLoading(true);
    window.electron.ipcRenderer.sendMessage('cronosSQL', values);
    await window.electron.ipcRenderer.once('cronosSQL', (arg) => {
      console.log(arg);
      if ((arg as string) === 'OK') {
        navigate('/home');
      } else {
        alert('Usuario e senha inválidos');
      }
    });
    setIsLoading(false);
  };
  return (
    <Box
      width="100vw"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      display="flex"
    >
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="flex"
              justifyItems="center"
              flexDirection="column"
              justifyContent="center"
              gap="30px"
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Usuario"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Senha"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Servidor"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.server}
                name="server"
                error={!!touched.server && !!errors.server}
                helperText={touched.server && errors.server}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Banco de dados"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.database}
                name="database"
                error={!!touched.database && !!errors.database}
                helperText={touched.database && errors.database}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <LoadingButton
                type="submit"
                color="secondary"
                variant="contained"
                loading={isLoading}
              >
                Entrar
              </LoadingButton>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}
