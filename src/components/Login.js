import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
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
  const apiUrl = process.env.REACT_APP_API_URL;
  const claveCifrado = process.env.REACT_APP_CLAVE_CIFRADO;

  // Define funciones para cifrar datos
  function cifrarUser(user) {
    return CryptoJS.AES.encrypt(user, claveCifrado).toString();
  }

  function cifrarEmail(email) {
    return CryptoJS.AES.encrypt(email, claveCifrado).toString();
  }

  // Define funciones para almacenar datos cifrados en localStorage
  function almacenarUserCifrado(user) {
    const userCifrado = cifrarUser(user);
    localStorage.setItem('user', userCifrado);
  }

  function almacenarEmailCifrado(email) {
    const emailCifrado = cifrarEmail(email);
    localStorage.setItem('email', emailCifrado);
  }

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
  const [user, setUser] = useState('');

  const handleButtonClick = async () => {
    const logedUser = {
      email,
      password
    };

    const requestBody = JSON.stringify(logedUser);

    try {
      const response = await axios.post(`${apiUrl}/api/user/login`, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Inicio de sesión exitoso
      setShowAlertSuccess(true);
      await delay(1500); // Espera de 1.5 segundos

      // Actualiza el estado de user y email
      const user = response.data.nombre;
      const email = response.data.email;
      setUser(user);
      setEmail(email);

      // Ir a inicio
      goInicio();
    } catch (error) {
      // Manejo de error de inicio de sesión
      setShowAlertError(true);
      await delay(5000);
      setShowAlertError(false);
    }
  };

  // Efecto para almacenar user y email cifrados en localStorage cuando user cambia
  useEffect(() => {
    if (user && email) {
      almacenarUserCifrado(user);
      almacenarEmailCifrado(email);
    }
  }, [user, email, almacenarEmailCifrado, almacenarUserCifrado]); // Se ejecuta cuando user o email cambian

  return (
    <>
      {localStorage.getItem('user') ? (
        <>
          {/* Mostrar contenido cuando el usuario está autenticado */}
          <section id="content">
            <h2>Sesión ya iniciada</h2>
            <p>Ya tienes una sesión iniciada.<br/>Cierra la sesión actual en caso de querer entrar con otra cuenta.</p>
          </section>
        </>
      ) : (
        <>
          {/* Mostrar contenido cuando el usuario no está autenticado */}
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
                sx={{
                  '&:focus-within label': {
                    color: '#C2185B',
                  },
                  '& .MuiFilledInput-underline:after': {
                    borderBottomColor: '#C2185B',
                  },
                }}
              />
              <TextField className='register'
                id="outlined-required"
                label="Contraseña"
                variant="filled"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                sx={{
                  '&:focus-within label': {
                    color: '#C2185B',
                  },
                  '& .MuiFilledInput-underline:after': {
                    borderBottomColor: '#C2185B',
                  },
                }}
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
      )}
    </>
  );
}
