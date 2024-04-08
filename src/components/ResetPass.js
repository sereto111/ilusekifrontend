import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import axios from 'axios';

const ResetPass = () => {

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(indigo[700]),
    backgroundColor: indigo[700],
    '&:hover': {
      backgroundColor: indigo[900],
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
      await axios.post(`http://localhost:5000/api/pass/reset-password/${token}`, {
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
                  <Alert severity="success">Contraseña cambiada con exito</Alert>
                </Stack>
              )}
            </div>
            <br />
            <div className='center'>
              {showAlertError && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                  <Alert severity="error">Error al cambiar la contraseña</Alert>
                </Stack>
              )}
            </div>

          </form>
       

      </Box>
    </div>

  );
};

export default ResetPass;