import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';
import axios from 'axios';
import { TextField, Autocomplete } from '@mui/material';
import "../App.css";

/* TODO: Añadir me gusta a Profile y aquí */
export function Buscador() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [ilustraciones, setIlustraciones] = useState([]);
    const [modalData, setModalData] = useState(null);

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

    // Manejar la apertura y cierre del modal
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
        <div>
            {/* TODO: Ver si cambiar diseño del TextField */}
            {/* TODO: Ver si al principio no muestro nombre hasta que no introduzca letras */}
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
                        </div>
                    ))}
                </div>

                {/* Modal para mostrar detalles de la ilustración */}
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
        </div>
    );
}
