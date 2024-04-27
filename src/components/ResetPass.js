import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import axios from 'axios';

const ResetPass = () => {ç
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
        
          <form onSubmit={handleSubmit}>
            
            <TextField className='register'
              required
              id="outlined-required"
              label="Nueva Contraseña"
              type="password"
              variant="filled"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br /><br />
            <ColorButton type="submit" variant="contained" >Cambiar contraseña</ColorButton>
            <br /><br />
            <div className='center'>
              {showAlertSuccess && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity="success">Contraseña cambiada con éxito | Puede cerrar esta pestaña o iniciar sesión con su nueva contraseña</Alert>
                </Stack>
              )}
            </div>
            <br />
            <div className='center'>
              {showAlertError && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity="error">El enlace a caducado o ya se ha cambiado la contraseña</Alert>
                </Stack>
              )}
            </div>

          </form>
       

      </Box>
    </div>

  );
};

export default ResetPass;