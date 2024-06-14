import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { red, grey, green, teal, pink } from '@mui/material/colors';
import { TextField, Autocomplete } from '@mui/material';
import { obtenerUserDescifrado } from './Header';
import "../App.css";

export function Buscador() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedIlustracion, setSelectedIlustracion] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [ilustraciones, setIlustraciones] = useState([]);
    const [modalData, setModalData] = useState(null);
    const [ilustracionesGuardadas, setIlustracionesGuardadas] = useState([]);
    const [, setIlustracionesConMeGusta] = useState([]);

    const userLocalStorage = obtenerUserDescifrado('user');

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


    // Función para obtener las ilustraciones y los usuarios
    //callback para que la función se mantenga constante entre renders (a menos que cambie apiUrl)
    const fetchIlustraciones = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/ilustration/listarIlustraciones`);
            const ilustracionesData = response.data.ilustraciones;
            setIlustraciones(ilustracionesData);

            // Extraer nombres de usuario de cada ilustración
            const userNames = ilustracionesData.map(ilustracion => ilustracion.usuario);

            // Eliminar nombres duplicados y guardar los usuarios en el estado
            setUsers([...new Set(userNames)]);
        } catch (error) {
            console.error('Error al obtener las ilustraciones:', error);
        }
    }, [apiUrl]);

    // Realizar la petición para obtener las ilustraciones al iniciar el componente
    useEffect(() => {
        fetchIlustraciones();
    }, [apiUrl, fetchIlustraciones]);

    // Filtrar ilustraciones por usuario seleccionado
    const filteredIlustraciones = ilustraciones.filter(
        ilustracion => ilustracion.usuario === selectedUser
    );

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

    const handleConfirmDelete = async () => {
        if (selectedIlustracion) {
            try {
                await axios.delete(`${apiUrl}/api/ilustration/eliminarIlustracion/${selectedIlustracion.nombre}`);
                handleCloseDialog();
                window.location.reload();
            } catch (error) {
                console.error('Error al eliminar la ilustración:', error);
            }
        }
    };

    return (
        <div>
            {/* Campo de búsqueda con autocompletado */}
            <Autocomplete
                options={users}
                value={selectedUser}
                onChange={(event, newValue) => setSelectedUser(newValue)}
                inputValue={searchQuery}
                onInputChange={(event, newInputValue) => setSearchQuery(newInputValue)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Buscar usuario"
                        variant="filled"
                        fullWidth
                        margin="normal"
                        className="custom-textfield"
                        sx={{
                            width: '75%',
                            '&:focus-within label': {
                                color: '#C2185B',
                            },
                            '& .MuiFilledInput-underline:after': {
                                borderBottomColor: '#C2185B',
                            }
                        }}
                    />
                )}
                // Cambiar el mensaje por defecto para cuando no se encuentran opciones
                noOptionsText="No se encontró este usuario"
            />

            {/* Lista de ilustraciones filtradas */}
            <div className="profile-container">
                <div className="profile-grid-container">
                    {filteredIlustraciones.map((ilustracion) => (
                        <div key={ilustracion._id} className="profile-grid-item" onClick={() => handleOpenModal(ilustracion)}>
                            <img src={ilustracion.imagen.secure_url} alt={ilustracion.nombre} />
                            <p>{ilustracion.descripcion}</p>
                            {userLocalStorage && userLocalStorage.trim() && (
                                <>
                                    <div className='d'>
                                        {/* Solo poner botón de borrar al usuario logueado */}
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
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Modal para mostrar detalles de la ilustración */}
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
        </div>
    );
}
