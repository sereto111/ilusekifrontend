import React, { useEffect, useState } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import moment from 'moment';
import Rating from '@mui/material/Rating';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { cyan, pink, teal, deepOrange, indigo } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import { goInicio } from './Header';

export function InitialWindow() {

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [videojuegoToDelete, setVideojuegoToDelete] = useState('');
  const [showWishlistSuccessToast, setShowWishlistAlertSuccessToast] = useState(false);
  const [showWishlistErrorToast, setShowWishlistAlertErrorToast] = useState(false);
  const [showCompletadosSuccessToast, setShowCompletadosAlertSuccessToast] = useState(false);
  const [showCompletadosErrorToast, setShowCompletadosAlertErrorToast] = useState(false);
  const [filterDate, setFilterDate] = useState('');

  const ColorButtonEdit = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(cyan[700]),
    backgroundColor: cyan[700],
    '&:hover': {
      backgroundColor: cyan[900],
    },
  }));

  const ColorButtonDelete = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(pink[700]),
    backgroundColor: pink[700],
    '&:hover': {
      backgroundColor: pink[900],
    },
  }));

  const ColorButtonAddWhistlist = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(teal[700]),
    backgroundColor: teal[700],
    '&:hover': {
      backgroundColor: teal[900],
    },
  }));

  const ColorButtonAddCompleted = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(deepOrange[700]),
    backgroundColor: deepOrange[700],
    '&:hover': {
      backgroundColor: deepOrange[900],
    },
  }));

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(indigo[700]),
    backgroundColor: indigo[700],
    '&:hover': {
      backgroundColor: indigo[900],
    },
  }));

  const history = useHistory();
  const user = localStorage.getItem('user');

  const StyledRating = styled(Rating)({
    '& .MuiRating-icon': {
      color: '#bbdff8',
    },
    '& .MuiRating-iconFilled': {
      color: '#4cb6ff',
    },
    '& .MuiRating-iconHover': {
      color: '#28a7fe',
    },
  });

  const getChunkSize = () => {
    const containerWidth = window.innerWidth;
    if (containerWidth < 800) {
      return 1;
    } else if (containerWidth < 1500) {
      return 2;
    } else {
      return 4;
    }
  };

  const handleAddWhishlist = async (nombreJuego) => {
    try {
      const response = await axios.post('http://localhost:5000/api/videojuego/listadeseos/agregar', {
        "nombre": nombreJuego,
        "propietario": user
      });

      if (response.status === 200) {
        // El juego se añadió a la lista de deseos exitosamente
        setShowWishlistAlertSuccessToast(true);
        await delay(2000);
        setShowWishlistAlertSuccessToast(false);
      } else {
        // Ocurrió un error al añadir el juego a la lista de deseos
        setShowWishlistAlertErrorToast(true);
        await delay(2000);
        setShowWishlistAlertErrorToast(false);
      }
    } catch (error) {
      setShowWishlistAlertErrorToast(true);
      await delay(2000);
      setShowWishlistAlertErrorToast(false);
    }
  };

  const handleAddCompleted = async (nombreJuego) => {
    try {
      const response = await axios.post('http://localhost:5000/api/videojuego/completados/agregar', {
        "nombre": nombreJuego,
        "propietario": user
      });

      if (response.status === 200) {
        // El juego se añadió a completados exitosamente
        setShowCompletadosAlertSuccessToast(true);
        await delay(2000);
        setShowCompletadosAlertSuccessToast(false);
      } else {
        // Ocurrió un error al añadir el juego a completados
        setShowCompletadosAlertErrorToast(true);
        await delay(2000);
        setShowCompletadosAlertErrorToast(false);
      }
    } catch (error) {
      setShowCompletadosAlertErrorToast(true);
      await delay(2000);
      setShowCompletadosAlertErrorToast(false);
    }
  };

  const handleEdit = (nombre) => {
    history.push(`/editgame/${nombre}`);
  };

  const handleDelete = async (nombre) => {
    setVideojuegoToDelete(nombre);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/videojuego/eliminarVideojuego/${videojuegoToDelete}`);
      

      setOpenDeleteDialog(false);
      window.location.reload(); // Recargar la página después de eliminar el videojuego
    } catch (error) {}
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleFilterChange = (event) => {
    setFilterDate(event.target.value);
  };

  const [games, setGames] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [chunkSize, setChunkSize] = useState(getChunkSize());

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/videojuego/listarVideojuegos');
      setGames(response.data.videojuegos);
      setDataLoaded(true);
    } catch (error) {}
  };

  useEffect(() => {
    // Función para realizar la carga de datos
    const loadData = () => {
      fetchData();
    };

    loadData();
  }, []);

  const chunk = (array, size) => {
    if (!Array.isArray(array)) {
      return [];
    }
    return array.reduce((chunks, element, index) => {
      if (index % size === 0) {
        chunks.push([element]);
      } else {
        chunks[chunks.length - 1].push(element);
      }
      return chunks;
    }, []);
  };

  const handleResize = () => {
    setChunkSize(getChunkSize());
  }

  useEffect(() => {

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  function goAddGame() {
    window.open("/addgame", "_self");
  }

  const pages = chunk(games, chunkSize); //nº de items por cada página del Carousel

  const filteredPages = filterDate
  ? pages.map((page) =>
      page.filter((videojuegos) => {
        const isSameDate = moment(videojuegos.fecha_lanzamiento).isSame(filterDate, 'day');
        const isToday = moment(filterDate).isSame(moment(), 'day');
        const isYesterday = moment(filterDate).isSame(moment().subtract(1, 'day'), 'day');
        const isLastMonth = moment(videojuegos.fecha_lanzamiento).isBetween(
          moment().subtract(1, 'month').startOf('month'),
          moment().subtract(1, 'month').endOf('month'),
          'day',
          '[]'
        );
        const isLastYear = moment(videojuegos.fecha_lanzamiento).isBetween(
          moment().subtract(1, 'year').startOf('year'),
          moment().subtract(1, 'year').endOf('year'),
          'day',
          '[]'
        );
        return isSameDate || (isToday && isSameDate) || (isYesterday && isSameDate) || (filterDate === 'lastMonth' && isLastMonth) ||(filterDate === 'lastYear' && isLastYear);
      })
    )
  : pages;

  // Verifica si no hay resultados después de aplicar el filtro
  const noResults = filteredPages.every((page) => page.length === 0);

  let mergedPage = [];
  let hasResults = false;

  if (!noResults) {
    for (let i = 1; i < filteredPages.length; i++) {
      if (filteredPages[i].length > 0) {
        mergedPage = mergedPage.concat(filteredPages[i]);
        hasResults = true;
      }
      filteredPages[i] = [];
    }

    if (hasResults) {
      filteredPages[0] = filteredPages[0].concat(mergedPage);
    }
  }

  const chunkedPages = chunk(filteredPages[0], chunkSize);

  return (
    <div style={{ overflowX: 'hidden' }}>
      <h1>Todos los juegos</h1>



      {dataLoaded ? (
        <>       
          <Carousel
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            renderArrowPrev={(onClickHandler, hasPrev) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  style={{
                    zIndex: 2,
                    position: 'absolute',
                    left: 15,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  &lt;
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext) =>
              hasNext && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  style={{
                    zIndex: 2,
                    position: 'absolute',
                    right: 15,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  &gt;
                </button>
              )
            }
          >

            {noResults ? (
              <>

                <FormControl variant="standard" sx={{ minWidth: 300 }} className='register'>
                  <InputLabel id="filter-date-label"><b>Filtrar por fecha de lanzamiento</b></InputLabel>
                  <Select
                    labelId="filter-date-label"
                    id="filter-date-select"
                    value={filterDate}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Todas las fechas</MenuItem>
                    <MenuItem value={moment().format('YYYY-MM-DD')}>Hoy</MenuItem>
                    <MenuItem value={moment().subtract(1, 'day').format('YYYY-MM-DD')}>Ayer</MenuItem>
                    <MenuItem value="lastMonth">Mes pasado</MenuItem>
                    <MenuItem value="lastYear">Año pasado</MenuItem>
                    <MenuItem value={moment().subtract(1, 'year').format('YYYY-MM-DD')}>Hace un año 🥳</MenuItem>
                  </Select>
                </FormControl>


                <Stack sx={{ width: '33%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <br />
                  <Alert severity="info" sx={{ textAlign: 'center' }} variant="filled">
                    No se encontraron resultados
                  </Alert>
                  <br />
                </Stack>
              </>
            ) : (


              chunkedPages.map((page, index) => (
                <div className='items' key={index}>
                  {index === 0 && ( // Verifica si es la primera página

                    <div className="filter-form">

                      <FormControl variant="standard" sx={{ minWidth: 300 }} className='register'>
                        <InputLabel id="filter-date-label"><b>Filtrar por fecha de lanzamiento</b></InputLabel>
                        <Select
                          labelId="filter-date-label"
                          id="filter-date-select"
                          value={filterDate}
                          onChange={handleFilterChange}
                        >
                          <MenuItem value="">Todas las fechas</MenuItem>
                          <MenuItem value={moment().format('YYYY-MM-DD')}>Hoy</MenuItem>
                          <MenuItem value={moment().subtract(1, 'day').format('YYYY-MM-DD')}>Ayer</MenuItem>
                          <MenuItem value="lastMonth">Mes pasado</MenuItem>
                          <MenuItem value="lastYear">Año pasado</MenuItem>
                          <MenuItem value={moment().subtract(1, 'year').format('YYYY-MM-DD')}>Hace un año 🥳</MenuItem>
                        </Select>
                      </FormControl>


                    </div>
                  )}
                  {page.map((videojuegos) => (
                    <div className='item' key={videojuegos._id}>
                      <img src={videojuegos.imagen} alt="game img" />  {/*Link a la imagen. */}
                      <h2>{videojuegos.nombre}</h2>
                      <p>{videojuegos.descripcion}</p>
                      <p><b>Desarrollador: </b><br />{videojuegos.desarrollador}</p>
                      <p><b>Editor: </b><br />{videojuegos.editor}</p>
                      <p><b>Fecha de salida: </b><br />{moment(videojuegos.fecha_lanzamiento).format('DD/MM/YYYY')}</p>
                      <p><b>Subido por: </b><br />{videojuegos.usuario}</p>
                      <p><b>Valoración: </b><br />
                        <StyledRating
                          name="customized-color-read-only"
                          defaultValue={1}
                          size="large"
                          precision={1}
                          value={videojuegos.valoracion}
                          icon={<SportsEsportsIcon fontSize="inherit" />}
                          emptyIcon={<SportsEsportsOutlinedIcon fontSize="inherit" />}
                          readOnly
                        />
                      </p>
                      <p>
                        {'admin' === localStorage.getItem('user') && (
                          <ColorButtonEdit onClick={() => handleEdit(videojuegos.nombre)}>
                            <EditIcon />
                          </ColorButtonEdit>
                        )}

                        {videojuegos.usuario === localStorage.getItem('user') && localStorage.getItem('user') !== 'admin' && (
                          <ColorButtonEdit onClick={() => handleEdit(videojuegos.nombre)}>
                            <EditIcon />
                          </ColorButtonEdit>
                        )}

                        {'    '}

                        {'admin' === localStorage.getItem('user') && (
                          <ColorButtonDelete onClick={() => handleDelete(videojuegos.nombre)}>
                            <DeleteIcon />
                          </ColorButtonDelete>
                        )}

                        {videojuegos.usuario === localStorage.getItem('user') && localStorage.getItem('user') !== 'admin' && (
                          <ColorButtonDelete onClick={() => handleDelete(videojuegos.nombre)}>
                            <DeleteIcon />
                          </ColorButtonDelete>
                        )}

                        <br /><br />

                        {localStorage.getItem('user') && (
                          <ColorButtonAddWhistlist onClick={() => handleAddWhishlist(videojuegos.nombre)}>
                            <PlaylistAddIcon />
                          </ColorButtonAddWhistlist>

                        )}

                        {'    '}

                        {localStorage.getItem('user') && (
                          <ColorButtonAddCompleted onClick={() => handleAddCompleted(videojuegos.nombre)}>
                            <PlaylistAddCheckIcon />
                          </ColorButtonAddCompleted>

                        )}

                      </p>
                    </div>
                  ))}

                </div>
              ))
            )}



          </Carousel>

          <div className='center'>

            <Stack sx={{ width: 'auto', marginLeft: 'auto', marginRight: 'auto' }} spacing={2}>
              {showWishlistSuccessToast && (
                <Alert severity="info" sx={{ textAlign: 'center' }}>
                  Juego añadido con éxito a la lista de deseos
                </Alert>
              )}
              {showWishlistErrorToast && (
                <Alert severity="warning" sx={{ textAlign: 'center' }}>
                  Error al añadir. El juego ya estaba en la lista de deseos
                </Alert>
              )}
              {showCompletadosSuccessToast && (
                <Alert severity="info" sx={{ textAlign: 'center' }}>
                  Juego añadido con éxito a la lista de completados
                </Alert>
              )}
              {showCompletadosErrorToast && (
                <Alert severity="warning" sx={{ textAlign: 'center' }}>
                  Error al añadir. El juego ya estaba en la lista de completados
                </Alert>
              )}
            </Stack>


          </div>

          <Dialog open={openDeleteDialog} onClose={cancelDelete}>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogContent>
              <p>¿Deseas eliminar el videojuego <b>{videojuegoToDelete}</b>?</p>
            </DialogContent>
            <DialogActions>
              <ColorButton onClick={cancelDelete}>Cancelar</ColorButton>
              <ColorButtonDelete onClick={confirmDelete} autoFocus>
                Eliminar
              </ColorButtonDelete>
            </DialogActions>
          </Dialog>

        </>
      ) : (
        <p>Cargando...</p>
      )}

      <div className="container">
        <div className="addButtonInWin">
          <Fab color="primary" aria-label="add" onClick={goInicio}>
            <CachedIcon />
          </Fab>
          <div className="space"></div>
          {user ?
            <Fab color="primary" aria-label="add" onClick={goAddGame}>
              <AddIcon />
            </Fab>
            :
            <div></div>
          }
        </div>
      </div>

    </div>
  );
}