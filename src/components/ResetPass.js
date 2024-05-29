import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import axios from 'axios';
import { goLogin } from './Header';

const ResetPass = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(pink[700]),
    backgroundColor: pink[700],
    '&:hover': {
      backgroundColor: pink[900],
    },
  }));

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    try {
      await axios.post(`${apiUrl}/api/pass/reset-password/${token}`, {
        password: password
      });
      setShowAlertSuccess(true);
      await delay(2000);
      goLogin();

    } catch (error) {
      setShowAlertError(true);
      await delay(5000); // Espera de 5 segundos
      setShowAlertError(false);
    }
  };

  return (
    <div>
      <h1>Restablecer contraseña</h1>
      <Box display="flex" justifyContent="center">
        <form onSubmit={handleSubmit} style={{ width: '90%', maxWidth: '500px' }}>
          <TextField
            className='register'
            required
            id="outlined-required"
            label="Nueva Contraseña"
            type="password"
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <ColorButton
            type="submit"
            variant="contained"
            sx={{ width: '60%' }}
          >
            Cambiar contraseña
          </ColorButton>
          {showAlertSuccess && (
            <Stack sx={{ width: '60%', maxWidth: '300px', margin: '0 auto', mt: 2 }} spacing={2}>
              <Alert severity="success">Contraseña cambiada con éxito | Redirigiendo...</Alert>
            </Stack>
          )}
          {showAlertError && (
            <Stack sx={{ width: '60%', maxWidth: '300px', margin: '0 auto', mt: 2 }} spacing={2}>
              <Alert severity="error">El enlace ha caducado o ya se ha cambiado la contraseña</Alert>
            </Stack>
          )}
        </form>
      </Box>
    </div>

  );
};

export default ResetPass;