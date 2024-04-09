import React, { useState } from 'react';
import axios from 'axios';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import { goInicio } from './Header';

export function Login() {

  function goMailPass() {
    window.open("/mail-pass", "_self");
  }

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setUser] = useState('');

  const handleButtonClick = async () => {
    const logedUser = {
      email,
      password
    };

    const requestBody = JSON.stringify(logedUser);

    try {
      const response = await axios.post('https://ilusekibackend.onrender.com/api/user/login', requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      //Mensaje de inicio correcto - Ir a inicio y cambiar botones header
      setShowAlertSuccess(true);
      await delay(1500); // Espera de 1.5 segundos
      const user = response.data.nombre;
      setUser(user);
      const email = response.data.email;
      setEmail(email);
      localStorage.setItem('user', user);
      localStorage.setItem('email', email);
      goInicio();
    } catch (error) {
      setShowAlertError(true);
      await delay(5000); // Espera de 5 segundos
      setShowAlertError(false);
    }
  };

  return (
    <>
      <h1>Login</h1>

      <Box display="flex" justifyContent="center">
        <Stack
          component="form"
          sx={{
            width: '25ch',
          }}
          direction="column"
          spacing={2}
          noValidate
          autoComplete="off"
          style={{ minHeight: '100vh' }}
        >

          <TextField className='register'
            id="outlined-required"
            label="Email"
            variant="filled"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField className='register'
            id="outlined-required"
            label="Contraseña"
            variant="filled"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Link to="#" onClick={goMailPass} color="#C2185B" underline="hover">
            <b>{'Recuperar contraseña'}</b>
          </Link>
          <ColorButton variant="contained" onClick={handleButtonClick}>Iniciar sesión</ColorButton>
          <div className='center'>
            {showAlertSuccess && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="success">Inicio de sesión correcto</Alert>
              </Stack>
            )}
          </div>

          <div className='center'>
            {showAlertError && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="error">Inicio de sesión fallido</Alert>
              </Stack>
            )}
          </div>
        </Stack>

      </Box>

    </>
  )
}
