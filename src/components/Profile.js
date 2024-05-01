import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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

//TODO: Poner botón para ir a ruta upload | En Profile o Inicio

export function Profile() {
    const apiUrl = process.env.REACT_APP_API_URL;

    const delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // Obtiene el parámetro de búsqueda de la URL
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const usuarioParam = query.get('usuario');

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [ilustraciones, setIlustraciones] = useState([]);
    const [modalData, setModalData] = useState(null);

    const userLocalStorage = localStorage.getItem('user');
    const email = localStorage.getItem('email');

    // Inicializa el estado con el usuario del parámetro o con un valor por defecto
    const [user] = useState(usuarioParam || userLocalStorage);

    const enviarCorreoRecuperacion = async () => {
        try {
            //TODO: Cambiar ruta | Hacer en backend
            await axios.post('https://ilusekibackend.onrender.com/api/correo/recuperar-pass', {
                email: email
            });

            setShowAlertSuccess(true);
            await delay(2000);
            goInicio();

        } catch (error) { }
    };

    //Sacar imágenes del usuario logueado
    useEffect(() => {
        const fetchIlustraciones = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/ilustration/listarIlustraciones`);
                const ilustracionesUser = response.data.ilustraciones.filter(
                    (ilustracion) => ilustracion.usuario === user
                );
                setIlustraciones(ilustracionesUser);
            } catch (error) {
                //TODO: Quitar console
                console.error('Error al obtener las ilustraciones:', error);
            }
        };

        fetchIlustraciones();
    }, [apiUrl, user]);

    //Abrir y cerrar modal
    const handleOpenModal = (ilustracion) => {
        setModalData(ilustracion);
    };

    const handleCloseModal = () => {
        setModalData(null);
    };

    const handleCloseModalClickOutside = (event) => {
        if (event.target === event.currentTarget) {
            handleCloseModal();
        }
    };

    return (
        <>
            {/* Comprobar si hay usuario logueado */}
            {user ? (
                <>
                    {/* TODO: Ver si hacer más ancho (menos separación a los lados) */}
                    <h1>Perfil de {user}</h1>
                    <Box display="flex" justifyContent="center">
                        <List sx={{ display: 'flex', flexDirection: 'row' }}>
                            <ListItem>
                                <ListItemIcon sx={{ color: '#c2185b' }}>
                                    <AccountBoxTwoToneIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <React.Fragment>
                                            <strong>Usuario:</strong>
                                            <br />
                                            {user}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>

                            {userLocalStorage === user && (
                                <>
                                    <ListItem>
                                        <ListItemIcon sx={{ color: '#c2185b' }}>
                                            <EmailTwoToneIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <React.Fragment>
                                                    <strong>Email:</strong>
                                                    <br />
                                                    {email}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>

                                    {/* TODO: Configurar backend para correo de Cambiar contraseña */}
                                    <ListItem>
                                        <ListItemIcon sx={{ color: '#c2185b' }}>
                                            <LockTwoToneIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <React.Fragment>
                                                    <strong>Contraseña:</strong>
                                                    <br />
                                                    <Link to="#" color="#c2185b" onClick={enviarCorreoRecuperacion} underline="hover"
                                                    className='custom-link'>
                                                        {'Cambiar contraseña'}
                                                    
                                                    </Link>

                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                </>
                            )}

                            {showAlertSuccess && (
                                <Stack sx={{ width: '100%' }} spacing={2}>
                                    <Alert severity="success">Revise su correo para cambiar la contraseña</Alert>
                                </Stack>
                            )}

                        </List>
                    </Box>
                    {/* TODO: Añadir botón me gusta y guardados */}
                    <div className="profile-container">
                        <h1>Ilustraciones de {user}</h1>
                        <div className="profile-grid-container">
                            {ilustraciones.map((ilustracion) => (
                                <div key={ilustracion._id} className="profile-grid-item" onClick={() => handleOpenModal(ilustracion)}>
                                    <img src={ilustracion.imagen.secure_url} alt={ilustracion.nombre} />
                                    <p>{ilustracion.descripcion}</p>
                                </div>
                            ))}
                        </div>
                        {modalData && (
                            <div className="modal" onClick={handleCloseModalClickOutside}>
                                <div className="modal-content">
                                    <span className="close" onClick={handleCloseModal}>&times;</span>
                                    <img src={modalData.imagen.secure_url} alt={modalData.nombre} />
                                    <p>{modalData.descripcion}</p>
                                </div>
                            </div>
                        )}
                    </div>

                </>
            ) : (
                <>
                    <section id="content">
                        <h2>Sesión no iniciada</h2>
                        <p>Debes iniciar sesión para poder acceder a tu perfil</p>
                    </section>
                </>
            )}
        </>
    );
}