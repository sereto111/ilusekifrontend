import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { obtenerUserDescifrado } from './Header';

export function InitialWindow() {
  const user = obtenerUserDescifrado('user');
  const [modalData, setModalData] = useState(null);

  // Estado para almacenar las ilustraciones mezcladas
  const [ilustracionesMezcladas, setIlustracionesMezcladas] = useState([]);

  // URL de la API
  const apiUrl = process.env.REACT_APP_API_URL;

  // Función para mezclar array
  const mezclarArray = (array) => {
    const mezclado = [...array];
    for (let i = mezclado.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mezclado[i], mezclado[j]] = [mezclado[j], mezclado[i]];
    }
    return mezclado;
  };

  // Función para obtener todas las ilustraciones de la API
  const obtenerIlustraciones = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/ilustration/listarIlustraciones`);
      if (response.data.ok) {
        // Mezclar las ilustraciones
        const ilustracionesMezcladas = mezclarArray(response.data.ilustraciones);

        // Filtrar las ilustraciones mezcladas para excluir las del usuario logueado antes de guardarlas en el estado
        const ilustracionesFiltradas = ilustracionesMezcladas.filter(ilustracion => ilustracion.usuario !== user);

        setIlustracionesMezcladas(ilustracionesFiltradas);
      }
    } catch (error) {
      console.error('Error al obtener las ilustraciones:', error);
    }
  }, [apiUrl, user]);

  // Llama a la función obtenerIlustraciones cuando se monta el componente
  useEffect(() => {
    obtenerIlustraciones();
  }, [obtenerIlustraciones]);

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

  // Renderizar el componente
  return (
    /* TODO: Mirar si cambiar CSS para centrarlos o posicionarlos mejor */
    <div className="profile-container">
      <h1>Descubre ilustradores</h1>
      <div className="home-container">
        <ul>
          {ilustracionesMezcladas.map((ilustracion) => (
            <li key={ilustracion._id} className="home-item" onClick={() => handleOpenModal(ilustracion)}>
              <div className='div-border'>
                <img src={ilustracion.imagen.secure_url} alt={ilustracion.nombre} />
                <p><span className='bold'>Autor: </span>{ilustracion.usuario}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {modalData && (
        <div className="modal" onClick={handleCloseModalClickOutside}>
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            {/* <p className='big'><span className='bold'>Autor: </span>{modalData.usuario}</p> */}
            {/* Enlace a la página de perfil con el usuario especificado */}
            <Link to={`/profile?usuario=${modalData.usuario}`} className='custom-link'><p className='big'><span className='bold'>Autor: </span>{modalData.usuario}</p></Link>
            <img src={modalData.imagen.secure_url} alt={modalData.nombre} />
            <p>{modalData.descripcion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
