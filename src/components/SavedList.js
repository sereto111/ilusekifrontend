import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { obtenerUserDescifrado } from './Header';

/* TODO: Poner botón para agregar guardados en las ilustraciones | Poner botón para quitar de guardados */
export function SavedList() {
    const apiUrl = process.env.REACT_APP_API_URL;

    //const [dialogOpen, setDialogOpen] = useState(false);
    //const [selectedIlustracion, setSelectedIlustracion] = useState(null);

    //const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [ilustraciones, setIlustraciones] = useState([]);
    const [modalData, setModalData] = useState(null);

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

    return (
        <>
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

                                        {/* Solo poner botón de borrar al usuario logueado */}
                                        {/* {userLocalStorage === user && (
                                        <div>
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
                                    )} */}
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
                                    <img src={modalData.imagen.secure_url} alt={modalData.nombre} />
                                    <p className='descOverflow'>{modalData.descripcion}</p>
                                </div>
                            </div>
                        )}

                        {/* Dialog de confirmación */}
                        {/* TODO: Ver si cambiar colores a los botones */}
                        {/* <Dialog open={dialogOpen} onClose={handleCloseDialog}>
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
                        </Dialog> */}
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