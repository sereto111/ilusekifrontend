import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
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
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import { pink, red, green, grey, teal, deepOrange } from '@mui/material/colors';
import { goInicio, obtenerUserDescifrado, obtenerEmailDescifrado } from './Header';

export function Profile() {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedIlustracion, setSelectedIlustracion] = useState(null);
    const [ilustracionesGuardadas, setIlustracionesGuardadas] = useState([]);
    const [newDescripcion, setNewDescripcion] = useState('');

    const [, setIlustracionesConMeGusta] = useState([]);

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

    const handleToggleGuardado = async (event, ilustracion) => {
        event.stopPropagation();

        try {
            if (!esPropietario(ilustracion)) {
                await axios.post(`${apiUrl}/api/ilustration/guardados/agregar`, {
                    nombre: ilustracion.nombre,
                    propietario: userLocalStorage,
                });

                setIlustracionesGuardadas([...ilustracionesGuardadas, { ...ilustracion, propietario: userLocalStorage }]);

                // Actualizar el estado local de la ilustración para reflejar el cambio de guardado
                setIlustraciones(prevIlustraciones =>
                    prevIlustraciones.map(prevIlustracion =>
                        prevIlustracion.nombre === ilustracion.nombre
                            ? { ...prevIlustracion, guardado: true }
                            : prevIlustracion
                    )
                );
            } else {
                await axios.delete(`${apiUrl}/api/ilustration/guardados/eliminar/${ilustracion.nombre}/${userLocalStorage}`);

                setIlustracionesGuardadas(ilustracionesGuardadas.filter((item) => item.nombre !== ilustracion.nombre));

                // Actualizar el estado local de la ilustración para reflejar el cambio de guardado
                setIlustraciones(prevIlustraciones =>
                    prevIlustraciones.map(prevIlustracion =>
                        prevIlustracion.nombre === ilustracion.nombre
                            ? { ...prevIlustracion, guardado: false }
                            : prevIlustracion
                    )
                );
            }
        } catch (error) {
            console.error('Error al actualizar el estado de guardado:', error);
        }
    };

    //Likes
    const handleToggleLike = async (event, ilustracion) => {
        event.stopPropagation();

        try {
            if (!ilustracion.likes.includes(userLocalStorage)) {
                await axios.post(`${apiUrl}/api/ilustration/me-gusta/${ilustracion.nombre}`, {
                    usuario: userLocalStorage,
                });

                // Agregar el usuario actual a la lista de likes de la ilustración
                ilustracion.likes.push(userLocalStorage);
            } else {
                await axios.post(`${apiUrl}/api/ilustration/eliminar-me-gusta/${ilustracion.nombre}`, {
                    usuario: userLocalStorage,
                });

                // Quitar el usuario actual de la lista de likes de la ilustración
                ilustracion.likes = ilustracion.likes.filter(user => user !== userLocalStorage);
            }

            // Actualizar el estado de las ilustraciones con los me gusta del usuario actual
            setIlustracionesConMeGusta(prevIlustraciones =>
                prevIlustraciones.map(prevIlustracion =>
                    prevIlustracion.nombre === ilustracion.nombre
                        ? { ...prevIlustracion, likes: ilustracion.likes }
                        : prevIlustracion
                )
            );
        } catch (error) {
            console.error('Error al manejar el me gusta:', error);
        }
    };
    //FIN Likes

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

    const handleOpenEditDialog = (ilustracion) => {
        setSelectedIlustracion(ilustracion);
        setNewDescripcion(ilustracion.descripcion || '');
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setSelectedIlustracion(null);
    };

    const handleSaveDescripcion = async () => {
        if (selectedIlustracion) {
            // Verifica si la nueva descripción es diferente de la actual
            if (selectedIlustracion.descripcion === newDescripcion) {
                // Cierra el diálogo sin hacer la petición
                handleCloseEditDialog();
                return;
            }

            try {
                await axios.put(`${apiUrl}/api/ilustration/actualizarIlustracion/${selectedIlustracion.nombre}`, {
                    descripcion: newDescripcion,
                });
                setIlustraciones(prevIlustraciones =>
                    prevIlustraciones.map(prevIlustracion =>
                        prevIlustracion.nombre === selectedIlustracion.nombre
                            ? { ...prevIlustracion, descripcion: newDescripcion }
                            : prevIlustracion
                    )
                );
                handleCloseEditDialog();
            } catch (error) {
                console.error('Error al editar la descripción:', error);
            }
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedIlustracion) {
            // Verificar si la ilustración está en la lista de guardados y eliminarla si es así
            if (esPropietario(selectedIlustracion)) {
                await axios.delete(`${apiUrl}/api/ilustration/guardados/eliminar/${selectedIlustracion.nombre}/${userLocalStorage}`);

            }
            // Eliminar la ilustración seleccionada
            try {
                await axios.delete(`${apiUrl}/api/ilustration/eliminarIlustracion/${selectedIlustracion.nombre}`);

                // Cerrar el diálogo después de eliminar la ilustración
                handleCloseDialog();
                window.location.reload();
            } catch (error) {
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
                    <div className="profile-container">
                        <h1>Ilustraciones de {user}</h1>
                        <div className="profile-grid-container prof">
                            {ilustraciones.slice().reverse().map((ilustracion) => (
                                <div key={ilustracion._id} className="profile-grid-item" onClick={() => handleOpenModal(ilustracion)}>
                                    <img src={ilustracion.imagen.secure_url} alt={ilustracion.nombre} />
                                    {userLocalStorage && userLocalStorage.trim() && (
                                        <>
                                            <div>
                                                {userLocalStorage === ilustracion.usuario && (
                                                    <>
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
                                                        {/* Botón de editar */}
                                                        <Button
                                                            variant="contained"
                                                            className='edit-button'
                                                            onClick={(event) => {
                                                                // Evitar que se abra el modal
                                                                event.stopPropagation();

                                                                handleOpenEditDialog(ilustracion)
                                                            }}
                                                            sx={{
                                                                backgroundColor: deepOrange[600],
                                                                color: '#FFF',
                                                                '&:hover': {
                                                                    backgroundColor: deepOrange[900],
                                                                },
                                                            }}
                                                        >
                                                            <EditIcon />
                                                        </Button>
                                                    </>

                                                )}


                                                {/* Botón de guardado */}
                                                <Button
                                                    variant="contained"
                                                    className={userLocalStorage === ilustracion.usuario ? 'second-button' : ''}
                                                    onClick={(event) => {
                                                        // Evitar que se abra el modal
                                                        event.stopPropagation();
                                                        handleToggleGuardado(event, ilustracion);
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

                                                {/* Botón de me gusta */}
                                                <Button
                                                    variant="contained"
                                                    className={userLocalStorage === ilustracion.usuario ? 'third-button' : 'second-button'}
                                                    onClick={(event) => {
                                                        // Evitar que se abra el modal
                                                        event.stopPropagation();
                                                        handleToggleLike(event, ilustracion);
                                                    }}
                                                    sx={{
                                                        backgroundColor: pink[400],
                                                        color: '#FFF',
                                                        '&:hover': {
                                                            backgroundColor: pink[700],
                                                        },
                                                    }}
                                                >
                                                    {/* Si el usuario ha dado me gusta, muestra el icono relleno, de lo contrario, muestra el icono hueco */}
                                                    {ilustracion.likes.includes(userLocalStorage) ? (
                                                        <FavoriteIcon />
                                                    ) : (
                                                        <FavoriteBorderIcon />
                                                    )}
                                                    {/* Contador de me gusta */}
                                                    <span>&nbsp;{ilustracion.likes.length}</span>
                                                </Button>
                                                {/* FIN boton me gusta */}

                                            </div>
                                        </>
                                    )}
                                </div>

                            ))}
                        </div>
                        {modalData && (
                            <div className="modal" onClick={handleCloseModalClickOutside}>
                                <div className="modal-content">
                                    <span className="close" onClick={handleCloseModal}>&times;</span>
                                    <img src={modalData.imagen.secure_url} alt={modalData.nombre} />
                                    <p className='descOverflow'>{modalData.descripcion && modalData.descripcion.trim() !== ""
                                        ? modalData.descripcion
                                        : <span className='bold'>Imagen sin descripción</span>
                                    }</p>
                                </div>
                            </div>
                        )}

                        {/* Dialog de confirmación */}
                        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                            <DialogTitle className='dialog b-bt'><span className='bold'>Confirmación</span></DialogTitle>
                            <DialogContent className='dialog'>
                                <p>¿Estás seguro de que deseas eliminar esta ilustración?</p>
                            </DialogContent>
                            <DialogActions className='dialog'>
                                <Button onClick={handleCloseDialog} variant="contained"
                                    sx={{
                                        backgroundColor: grey[700],
                                        color: '#FFF',
                                        '&:hover': {
                                            backgroundColor: grey[800],
                                        },
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button onClick={handleConfirmDelete} variant="contained"
                                    sx={{
                                        backgroundColor: green[600],
                                        color: '#FFF',
                                        '&:hover': {
                                            backgroundColor: green[800],
                                        },
                                    }}
                                >
                                    Confirmar
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
                            <DialogTitle className='dialogEdit b-bt'><span className='bold'>Editar Descripción</span></DialogTitle>
                            <DialogContent className='dialogEdit' >
                                <br />
                                <TextField
                                    fullWidth
                                    sx={{ width: '380px' }}
                                    multiline
                                    className='custom-textfield-edit'
                                    rows={4}
                                    variant="outlined"
                                    value={newDescripcion}
                                    onChange={(e) => setNewDescripcion(e.target.value)}
                                    placeholder="Descripción"
                                    InputProps={{
                                        style: {
                                            color: '#FFF',
                                        },
                                    }}
                                    InputLabelProps={{
                                        style: {
                                            color: '#FFF',
                                        },
                                    }}
                                />
                            </DialogContent>
                            <DialogActions className='dialogEdit'>
                                <Button onClick={handleCloseEditDialog} variant="contained"
                                    sx={{
                                        backgroundColor: grey[700],
                                        color: '#FFF',
                                        '&:hover': {
                                            backgroundColor: grey[800],
                                        },
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button onClick={handleSaveDescripcion} variant="contained"
                                    sx={{
                                        backgroundColor: green[600],
                                        color: '#FFF',
                                        '&:hover': {
                                            backgroundColor: green[800],
                                        },
                                    }}
                                >
                                    Guardar
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