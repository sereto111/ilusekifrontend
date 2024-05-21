import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CachedIcon from '@mui/icons-material/Cached';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { pink, red, green, grey, teal } from '@mui/material/colors';
import { obtenerUserDescifrado, goSaved } from './Header';

/* TODO: Poner botón para agregar guardados en las ilustraciones | Poner botón para quitar de guardados */
export function SavedList() {
    const apiUrl = process.env.REACT_APP_API_URL;

    //const [dialogOpen, setDialogOpen] = useState(false);
    //const [selectedIlustracion, setSelectedIlustracion] = useState(null);

    //const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedIlustracion, setSelectedIlustracion] = useState(null);
    const [ilustraciones, setIlustraciones] = useState([]);
    const [modalData, setModalData] = useState(null);
    const [ilustracionesGuardadas, setIlustracionesGuardadas] = useState([]);
    const [, setIlustracionesConMeGusta] = useState([]);

    const userLocalStorage = obtenerUserDescifrado('user');

    // Inicializa el estado con el usuario del parámetro o con un valor por defecto
    const [user] = useState(userLocalStorage);

    //Sacar imágenes guardadas del usuario logueado
    useEffect(() => {
        const fetchGuardados = async () => {
            try {
                // Realiza la petición para obtener la lista de guardados
                const response = await axios.get(`${apiUrl}/api/ilustration/guardados/listar`);

                if (response.data.ok) {
                    // Filtra las ilustraciones donde `propietario` es igual a `user`
                    const ilustracionesGuardadasUser = response.data.guardados.filter(
                        (guardado) => guardado.propietario === user
                    );

                    // Actualiza el estado con las ilustraciones guardadas filtradas
                    setIlustraciones(ilustracionesGuardadasUser);
                }
            } catch (error) {
                console.error('Error al obtener las ilustraciones guardadas:', error);
            }
        };

        // Llama a la función para hacer la petición
        fetchGuardados();
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
    const handleOpenModal = (guardado) => {
        setModalData(guardado);
    };

    const handleCloseModal = () => {
        setModalData(null);
    };

    const handleCloseModalClickOutside = (event) => {
        if (event.target === event.currentTarget) {
            handleCloseModal();
        }
    };

    /* const handleOpenDialog = (ilustracion) => {
        setSelectedIlustracion(ilustracion);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedIlustracion(null);
    }; */

    //TODO: Cambiar al borrado de Guardados
    /*const handleConfirmDelete = async () => {
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
    };*/

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
                // Verificar si la ilustración está en la lista de guardados y eliminarla si es así
                if (esPropietario(selectedIlustracion)) {
                    await axios.delete(`${apiUrl}/api/ilustration/guardados/eliminar/${selectedIlustracion.nombre}/${userLocalStorage}`);

                }
                // Eliminar la ilustración seleccionada
                await axios.delete(`${apiUrl}/api/ilustration/eliminarIlustracion/${selectedIlustracion.nombre}`);



                // Cerrar el diálogo después de eliminar la ilustración
                handleCloseDialog();

                goSaved();
            } catch (error) {
                console.error('Error al eliminar la ilustración:', error);
            }
        }
    };

    return (
        <>

            <br />
            <Fab
                className="fabR"
                aria-label="reload"
                onClick={goSaved}
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

            {/* Comprobar si hay usuario logueado */}
            {user ? (
                <>
                    {/* TODO: Añadir botón me gusta y guardados */}
                    <div className="profile-container">
                        <h1>Tus guardados | {user}</h1>
                        <div className="profile-grid-container">
                            {/* Verifica si hay ilustraciones guardadas */}
                            {ilustraciones.length > 0 ? (
                                // Renderiza las ilustraciones guardadas
                                ilustraciones.map((ilustracion) => (
                                    <div key={ilustracion._id} className="profile-grid-item" onClick={() => handleOpenModal(ilustracion)}>
                                        <img src={ilustracion.imagen.secure_url} alt={ilustracion.nombre} />

                                        {userLocalStorage === ilustracion.usuario && (
                                            <div>
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
                                    </div>

                                ))

                            ) : (
                                // Muestra un mensaje si no hay ilustraciones guardadas
                                <>
                                    <span></span>
                                    <p>No hay ilustraciones guardadas.</p>
                                </>
                            )}


                        </div>
                        {modalData && (
                            <div className="modal" onClick={handleCloseModalClickOutside}>
                                <div className="modal-content">
                                    <span className="close" onClick={handleCloseModal}>&times;</span>
                                    <Link to={`/profile?usuario=${modalData.usuario}`} className='custom-link'><p className='big'><span className='bold'>Autor: </span>{modalData.usuario}</p></Link>
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