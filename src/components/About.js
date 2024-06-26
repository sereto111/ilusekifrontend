import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import CachedIcon from '@mui/icons-material/Cached';
import Spline from '@splinetool/react-spline';
import { styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import { Box, Button, TextField, Container, Alert } from '@mui/material';

export function About() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [splinesLoaded, setSplinesLoaded] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const [serverTime, setServerTime] = useState('');
  const [clientTime, setClientTime] = useState('');
  const [isSameTime, setIsSameTime] = useState(null);

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(pink[700]),
    backgroundColor: pink[700],
    '&:hover': {
      backgroundColor: pink[900],
    },
  }));

  function goAbout() {
    window.open("/about", "_self");
  }

  useEffect(() => {
    setTimeout(() => {
      setSplinesLoaded(true);
    }, 100);


    // Capturar hora local
    const localTime = new Date();
    setClientTime("Fecha y hora local: " + localTime.toLocaleString());

    /* Con axios
    // Comparar con hora del servidor
    const compareTime = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/time/compare-time`, {
          clientTime: localTime.toISOString()
        });

        setServerTime("Fecha y hora del servidor: "+new Date(response.data.serverTime).toLocaleString());
        setIsSameTime(response.data.isSameTime);
      } catch (error) {
        console.error('Error comparando ', error);
      }
    };

    compareTime();
    */

    // Con AJAX | API Fetch
    // Comparar con hora del servidor
    const compareTime = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/time/compare-time`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ clientTime: localTime.toISOString() })
        });

        if (!response.ok) {
          throw new Error('Error en la petición');
        }

        const data = await response.json();
        setServerTime("Fecha y hora del servidor: " + new Date(data.serverTime).toLocaleString());
        setIsSameTime(data.isSameTime);
      } catch (error) {
        console.error('Error comparando ', error);
      }
    };

    compareTime();
  }, [apiUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormStatus('');

    try {
      const response = await axios.post(`${apiUrl}/api/correo/send`, {
        name,
        email,
        message,
      });

      if (response.status === 200) {
        setFormStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }

    setIsSubmitting(false);
  };

  const getAlertSeverity = () => {
    if (formStatus === 'success') return 'success';
    if (formStatus === 'error') return 'error';
    return 'info';
  };

  const getAlertMessage = () => {
    if (formStatus === 'success') return 'Mensaje enviado con éxito';
    if (formStatus === 'error') return 'Error al enviar el mensaje. Inténtalo de nuevo más tarde.';
    return 'Inténtalo de nuevo más tarde.';
  };

  return (
    <>
      <br />
      <div className="container">
        <Fab
          className="fabR"
          aria-label="reload"
          onClick={goAbout}
          sx={{
            backgroundColor: pink[700],
            '&:hover': {
              backgroundColor: pink[900],
            },
            '& .MuiSvgIcon-root': {
              color: '#FFF',
            },
          }}
        >
          <CachedIcon />
        </Fab>
      </div>

      <h1>Acerca del sitio</h1>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {splinesLoaded ? (
          <>
            <Spline scene="https://prod.spline.design/FcuklIi1EMHY8M2Q/scene.splinecode" style={{ width: '700px', height: '500px', backgroundColor: 'transparent' }} alt='keyboardModel' className='onlyBigScreen' />
            <img src='https://res.cloudinary.com/dmsqsogtj/image/upload/v1716403329/ilusekiFront/assets/sxnbjjgv28gffqsznrgt.jpg' height='500px' width='auto' alt='imagen acerca del sitio' />
            <Spline scene="https://prod.spline.design/GjMnrkFMmc8JNAEe/scene.splinecode" style={{ width: '700px', height: '500px', backgroundColor: 'transparent' }} alt='controllerModel' className='onlyBigScreen' />
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </div>

      <p className='aboutTxt'>
        &#x270F;&#xFE0F; Con esta web responsiva, podrás tener un perfil donde subir tus ilustraciones, descubrir otros ilustradores y dar me gusta a sus ilustraciones. Además, también dispondrás de una sección de 'Guardados' para poder ver tus ilustraciones favoritas facilmente.
        <br /><br />
        &#x1F58C;&#xFE0F; El sitio tiene funciones como buscador de perfiles, cambio de contraseña, modo oscuro y claro y formulario de contacto, para enviar un mensaje al encargado del sitio web.
        <br /><br />
        &#x1F58D;&#xFE0F; Puedes acceder como invitado (sin sesión iniciada), con este perfil podrás visualizar las ilustraciones y los perfiles de los ilustradores pero no dispondrás de un perfil al que subir tus ilustraciones y no podrás usar la lista de 'Guardados'.
        <br /><br />
        {clientTime}
        <br />
        {serverTime}
        <br />
        {isSameTime !== null && (
          <Typography variant="body1" color={isSameTime ? 'success.main' : 'error.main'} sx={{ fontWeight: 700 }}>
            La fecha y hora {isSameTime ? 'coinciden' : 'no coinciden'}
          </Typography>
        )}
      </p>

      <Container maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8, pb: 5 }}>
          <h2>Contáctanos</h2>
          <TextField
            label="Nombre"
            fullWidth
            variant="filled"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='register'
            sx={{
              '&:focus-within label': {
                color: '#C2185B',
              },
              '& .MuiFilledInput-underline:after': {
                borderBottomColor: '#C2185B',
              }
            }}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="filled"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='register'
            sx={{
              '&:focus-within label': {
                color: '#C2185B',
              },
              '& .MuiFilledInput-underline:after': {
                borderBottomColor: '#C2185B',
              }
            }}
            required
          />
          <TextField
            label="Mensaje"
            fullWidth
            variant="filled"
            margin="normal"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className='register'
            sx={{
              '&:focus-within label': {
                color: '#C2185B',
              },
              '& .MuiFilledInput-underline:after': {
                borderBottomColor: '#C2185B',
              }
            }}
            required
          />
          {formStatus && (
            <Alert severity={getAlertSeverity()} sx={{ textAlign: 'center', mt: 2 }}>
              {getAlertMessage()}
            </Alert>
          )}
          <ColorButton type="submit" variant="contained" color="primary" sx={{ mt: 3, width: '100%', maxWidth: '250px' }} disabled={isSubmitting}>
            Enviar
          </ColorButton>
        </Box>
      </Container>
    </>
  );
}