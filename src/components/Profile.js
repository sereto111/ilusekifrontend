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
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { pink, red, green, grey, teal } from '@mui/material/colors';
import { goInicio, obtenerUserDescifrado, obtenerEmailDescifrado } from './Header';

//TODO: Poner botón para ir a ruta upload | En Profile o Inicio

export function Profile() {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedIlustracion, setSelectedIlustracion] = useState(null);
    const [ilustracionesGuardadas, setIlustracionesGuardadas] = useState([]);

    function goAddIllustration() {
        window.open("/upload", "_self");
    }

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

    const userLocalStorage = obtenerUserDescifrado('user');
    const email = obtenerEmailDescifrado('email');

    // Inicializa el estado con el usuario del parámetro o con un valor por defecto
    const [user] = useState(usuarioParam || userLocalStorage);

    const enviarCorreoRecuperacion = async () => {
        try {
            await axios.post(`${apiUrl}/api/correo/recuperar-pass`, {
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

    useEffect(() => {
        const fetchIlustracionesGuardadas = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/ilustration/guardados/listar`);
                setIlustracionesGuardadas(response.data.guardados);
            } catch (error) {
                console.error('Error al obtener las ilustraciones guardadas:', error);
            }
        };

        fetchIlustracionesGuardadas();
    }, [apiUrl]);

    const esPropietario = (imagen) => {
        return ilustracionesGuardadas.some(ilustracion => ilustracion.nombre === imagen.nombre);
    };

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

    const handleOpenDialog = (ilustracion) => {
        setSelectedIlustracion(ilustracion);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedIlustracion(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedIlustracion) {
            try {
                await axios.delete(`${apiUrl}/api/ilustration/eliminarIlustracion/${selectedIlustracion.nombre}`);
                handleCloseDialog();
                window.location.reload();
            } catch (error) {
                //TODO quitar console
                console.error('Error al eliminar la ilustración:', error);
            }
        }
    };

    return (
        <>
            {/* Comprobar si hay usuario logueado */}
            {user ? (
                <>
                    {/* Compruebo que el usuario loguado está en su perfil */}
                    {userLocalStorage === user && (
                        <>
                            <br />
                            <Fab
                                className="fabR"
                                aria-label="add"
                                onClick={goAddIllustration}
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
                                <UploadIcon />
                            </Fab>
                        </>
                    )}
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

                                    {/* Solo poner botón de borrar al usuario logueado */}
                                    {userLocalStorage === user ? (
                                        <div>
                                            {/* Botón de guardado */}
                                            <Button
                                                variant="contained"
                                                className='second-button'
                                                onClick={(event) => {
                                                    // Evitar que se abra el modal
                                                    event.stopPropagation();
                                                }}
                                                sx={{
                                                    backgroundColor: teal[400],
                                                    color: '#FFF',
                                                    '&:hover': {
                                                        backgroundColor: teal[700],
                                                    },
                                                }}
                                            >
                                                {/* Si está en su lista de guardados sale el icono relleno, si no, sale el icono hueco */}
                                                {esPropietario(ilustracion) ? (
                                                    <BookmarkIcon />
                                                ) : (
                                                    <BookmarkBorderIcon />
                                                )}
                                            </Button>

                                            {/* Botón de eliminar */}
                                            <Button
                                                variant="contained"
                                                onClick={(event) => {
                                                    // Evitar que se abra el modal
                                                    event.stopPropagation();

                                                    handleOpenDialog(ilustracion);
                                                }}
                                                sx={{
                                                    backgroundColor: red[600],
                                                    color: '#FFF',
                                                    '&:hover': {
                                                        backgroundColor: red[900],
                                                    },
                                                }}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div>
                                            {/* Botón de guardado */}
                                            <Button
                                                variant="contained"
                                                onClick={(event) => {
                                                    // Evitar que se abra el modal
                                                    event.stopPropagation();
                                                }}
                                                sx={{
                                                    backgroundColor: teal[400],
                                                    color: '#FFF',
                                                    '&:hover': {
                                                        backgroundColor: teal[700],
                                                    },
                                                }}
                                            >
                                                {/* Si está en su lista de guardados sale el icono relleno, si no, sale el icono hueco */}
                                                {esPropietario(ilustracion) ? (
                                                    <BookmarkIcon />
                                                ) : (
                                                    <BookmarkBorderIcon />
                                                )}
                                            </Button>
                                        </div>
                                    )}

                                </div>
                            ))}
                        </div>
                        {modalData && (
                            <div className="modal" onClick={handleCloseModalClickOutside}>
                                <div className="modal-content">
                                    <span className="close" onClick={handleCloseModal}>&times;</span>
                                    <img src={modalData.imagen.secure_url} alt={modalData.nombre} />
                                    <p className='descOverflow'>{modalData.descripcion}</p>
                                </div>
                            </div>
                        )}

                        {/* Dialog de confirmación */}
                        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                            <DialogTitle className='dialog'><span className='bold'>Confirmación</span></DialogTitle>
                            <DialogContent className='dialog'>
                                <p>¿Estás seguro de que deseas eliminar esta ilustración?</p>
                            </DialogContent>
                            <DialogActions className='dialog'>
                                {/* TODO: Ver si cambiar colores a los botones */}
                                <Button onClick={handleCloseDialog} variant="contained"
                                    sx={{
                                        backgroundColor: grey[700], // Color de fondo personalizado
                                        color: '#FFF', // Color de texto (blanco)
                                        '&:hover': {
                                            backgroundColor: grey[800], // Color de fondo en hover
                                        },
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button onClick={handleConfirmDelete} variant="contained"
                                    sx={{
                                        backgroundColor: green[600], // Color de fondo personalizado
                                        color: '#FFF', // Color de texto (blanco)
                                        '&:hover': {
                                            backgroundColor: green[800], // Color de fondo en hover
                                        },
                                    }}
                                >
                                    Confirmar
                                </Button>
                            </DialogActions>
                        </Dialog>
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