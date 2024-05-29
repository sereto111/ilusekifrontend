import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import axios from 'axios';
import { goInicio } from './Header';

export function MailPass() {
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

    const [email, setEmail] = useState('');

    const enviarCorreoRecuperacion = async () => {
        try {
            await axios.post(`${apiUrl}/api/correo/recuperar-pass`, {
                email: email
            });

            setShowAlertSuccess(true);
            await delay(2000);
            goInicio();

        } catch (error) {
            setShowAlertError(true);
            await delay(1500);
            setShowAlertError(false);
        }
    };

    return (
        <>
            <h1>Recuperar contraseña</h1>
            <Box display="flex" justifyContent="center">
                <form style={{ width: '90%', maxWidth: '500px' }}>
                    <Stack
                        direction="column"
                        spacing={2}
                        noValidate
                        autoComplete="off"
                        style={{ minHeight: '100vh' }}
                    >
                        <TextField
                            className='register'
                            required
                            id="outlined-required"
                            label="Email"
                            variant="filled"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            sx={{
                                '&:focus-within label': {
                                    color: '#C2185B',
                                },
                                '& .MuiFilledInput-underline:after': {
                                    borderBottomColor: '#C2185B',
                                },
                            }}
                        />
                        <Box display="flex" justifyContent="center">
                            <ColorButton
                                variant="contained"
                                onClick={enviarCorreoRecuperacion}
                                sx={{ width: '60%' }}
                            >
                                Recuperar contraseña
                            </ColorButton>
                        </Box>
                        {showAlertSuccess && (
                            <Box display="flex" justifyContent="center">
                                <Stack sx={{ width: '60%', maxWidth: '300px', margin: '0 auto' }} spacing={2}>
                                    <Alert severity="success">Se le enviará un correo para cambiar la contraseña</Alert>
                                </Stack>
                            </Box>
                        )}
                        {showAlertError && (
                            <Box display="flex" justifyContent="center">
                                <Stack sx={{ width: '60%', maxWidth: '300px', margin: '0 auto' }} spacing={2}>
                                    <Alert severity="error">Email no registrado</Alert>
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                </form>
            </Box>
        </>
    )
}