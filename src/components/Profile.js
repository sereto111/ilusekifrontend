import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { goInicio } from './Header';

export function Profile() {

    const delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);

    const user = localStorage.getItem('user');
    const email = localStorage.getItem('email');

    const enviarCorreoRecuperacion = async () => {
        try {
            //TODO: Cambiar ruta
            await axios.post('http://localhost:5000/api/correo/recuperar-pass', {
                email: email
            });

            setShowAlertSuccess(true);
            await delay(2000);
            goInicio();

        } catch (error) {}
    };

    return (
        <>
            {/* TODO: Ver si hacer más ancho (menos separación a los lados) */}
            <h1>Perfil de {user}</h1>
            <Box display="flex" justifyContent="center">
                <List sx={{ display: 'flex', flexDirection: 'row'}}>
                    <ListItem>
                        <ListItemIcon sx={{ color: '#c2185b' }}>
                            <AccountBoxTwoToneIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    <strong>Usuario:</strong>
                                    <br/>
                                    {user}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon sx={{ color: '#c2185b' }}>
                            <EmailTwoToneIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    <strong>Email:</strong>
                                    <br/>
                                    {email}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon sx={{ color: '#c2185b' }}>
                            <LockTwoToneIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    <strong>Contraseña:</strong>
                                    <br/>
                                    <Link to="#" color="#c2185b" onClick={enviarCorreoRecuperacion} underline="hover">
                                        {'Cambiar contraseña'}
                                    </Link>

                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    {showAlertSuccess && (
                        <Stack sx={{ width: '100%' }} spacing={2}>
                            <Alert severity="success">Revise su correo para cambiar la contraseña</Alert>
                        </Stack>
                    )}

                </List>
            </Box>
            <h1>Ilustraciones de {user}</h1>
        </>
    )
}