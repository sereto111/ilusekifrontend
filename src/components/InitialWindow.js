import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { teal, pink } from '@mui/material/colors';
import { obtenerUserDescifrado } from './Header';

export function InitialWindow() {
  const user = obtenerUserDescifrado('user');
  const [modalData, setModalData] = useState(null);
  const [ilustracionesGuardadas, setIlustracionesGuardadas] = useState([]);

  // Estado para almacenar las ilustraciones mezcladas
  const [ilustracionesMezcladas, setIlustracionesMezcladas] = useState([]);

  const [, setIlustracionesConMeGusta] = useState([]);

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

      } else {
        await axios.delete(`${apiUrl}/api/ilustration/guardados/eliminar/${ilustracion.nombre}/${userLocalStorage}`);

        setIlustracionesGuardadas(ilustracionesGuardadas.filter((item) => item.nombre !== ilustracion.nombre));

      }
    } catch (error) {
      console.error('Error al actualizar el estado de guardado:', error);
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
                {/* Botón de guardado */}
                <Button
                  variant="contained"
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
                &nbsp;

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
            <p className='descOverflow'>{modalData.descripcion && modalData.descripcion.trim() !== ""
              ? modalData.descripcion
              : <span className='bold'>Imagen sin descripción</span>
            }</p>
          </div>
        </div>
      )}
    </div>
  );
}
