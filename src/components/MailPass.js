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
            //TODO: Cambiar ruta
            await axios.post('http://localhost:5000/api/correo/recuperar-pass', {
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
                        label="Email"
                        variant="filled"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <ColorButton variant="contained" onClick={enviarCorreoRecuperacion}>Recuperar contraseña</ColorButton>

                    <div className='center'>
                        {showAlertSuccess && (
                            <Stack sx={{ width: '100%' }} spacing={2}>
                                <Alert severity="success">Se le enviará un correo para cambiar la contraseña</Alert>
                            </Stack>
                        )}
                    </div>

                    <div className='center'>
                        {showAlertError && (
                            <Stack sx={{ width: '100%' }} spacing={2}>
                                <Alert severity="error">Email no registrado</Alert>
                            </Stack>
                        )}
                    </div>
                </Stack>
            </Box>

        </>
    )
}