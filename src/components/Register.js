import React, { useState } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
/* import { goInicio } from './Header'; */

export function Register() {

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
  const [showAlertError400, setShowAlertError400] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const handleButtonClick = async () => {
    const newUser = {
      nombre,
      email,
      password
    };

    const requestBody = JSON.stringify(newUser);

    try {
      await axios.post('https://ilusekibackend.onrender.com/api/user/registro', requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      setShowAlertSuccess(true);
      await delay(1500); // Espera de 1.5 segundos
      /* goInicio(); */
      //TODO: Quitar
      setShowAlertSuccess(false);
    } catch (error) {
      //Primer caso: usuario existente | Segundo caso: email existente
      //TODO: Añadir mensaje personalizado para el error 500 y cambiar condición
      if (error.response.data.mensaje === "usuario ya existe en la BD" || error.response.status === 500) {
        setShowAlertError400(true);
        await delay(5000); // Espera de 5 segundos
        setShowAlertError400(false);
      } else {
        setErrors(error.response.data);
        setShowAlertError(true);
        await delay(5000); // Espera de 5 segundos
        setShowAlertError(false);
      }
    }
  };

  return (
    <>
      <h1>Registro</h1>

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
            required
            id="outlined-required"
            label="Usuario"
            variant="filled"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <TextField className='register'
            required
            id="outlined-required"
            label="Email"
            variant="filled"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField className='register'
            required
            id="outlined-required"
            label="Contraseña"
            variant="filled"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <ColorButton variant="contained" onClick={handleButtonClick}>Registrar</ColorButton>
          <div className='center'>
            {showAlertSuccess && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="success">Registrado correctamente</Alert>
              </Stack>
            )}
          </div>

          <div className='center'>
            {showAlertError && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                {errors.mensaje.nombre && (
                  <Alert severity="warning">Registro fallido: {errors.mensaje.nombre.msg}</Alert>
                )}
                {errors.mensaje.email && (
                  <Alert severity="warning">Registro fallido: {errors.mensaje.email.msg}</Alert>
                )}
                {errors.mensaje.password && (
                  <Alert severity="warning">Registro fallido: {errors.mensaje.password.msg}</Alert>
                )}
              </Stack>
            )}
          </div>

          <div className='center'>
            {showAlertError400 && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="warning">Ese usuario y/o email ya está registrado</Alert>
              </Stack>
            )}
          </div>
        </Stack>
      </Box>
    </>
  )
}
