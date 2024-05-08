import React, { useContext } from 'react';
import CryptoJS from 'crypto-js';
import { ThemeContext } from '../App';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';

const claveCifrado = process.env.REACT_APP_CLAVE_CIFRADO;

export function descifrarUser(userCifrado) {
  const bytes = CryptoJS.AES.decrypt(userCifrado, claveCifrado);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function descifrarEmail(emailCifrado) {
  const bytes = CryptoJS.AES.decrypt(emailCifrado, claveCifrado);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function obtenerUserDescifrado() {
  const userCifrado = localStorage.getItem('user');
  return userCifrado ? descifrarUser(userCifrado) : null;
}

export function obtenerEmailDescifrado() {
  const emailCifrado = localStorage.getItem('email');
  return emailCifrado ? descifrarEmail(emailCifrado) : null;
}

export function goInicio() {
  window.open("/", "_self");
}

export function goSaved() {
  window.open("/saved", "_self");
}

function goBuscador() {
  window.open("/search", "_self");
}

function goRegister() {
  window.open("/register", "_self");
}

function goLogin() {
  window.open("/login", "_self");
}

function goAbout() {
  window.open("/about", "_self");
}

function goProfile() {
  window.open("/profile", "_self");
}

function goClose() {
  localStorage.removeItem('user');
  localStorage.removeItem('email');
  goInicio();
}

//Switch
const MaterialUISwitch = styled(Switch)(() => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#3f3f3f',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#931051',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#fff',
    borderRadius: 20 / 2,
  },
}));
//Fin Switch

export default function Header() {

  const user = obtenerUserDescifrado('user');

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const { theme, setTheme } = useContext(ThemeContext);

  const handleChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <>

      <AppBar position="static">
        <Container maxWidth="auto" sx={{ bgcolor: "#1a1a1a" }}>
          <Toolbar disableGutters>
            <PhotoLibraryIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              IluSeki
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >

                {/* Pages tamaño móvil -- Rutas desplegable izquierdo móvil */}

                <Button
                  onClick={goInicio}
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  INICIO
                </Button>

                <Button
                  onClick={goBuscador}
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  BUSCADOR
                </Button>

                <Button
                  onClick={goSaved}
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  GUARDADOS
                </Button>

                <Button
                  onClick={goAbout}
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  ACERCA DEL SITIO
                </Button>

              </Menu>
            </Box>

            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              IluSeki
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

              {/* Pages tamaño PC -- Rutas AppBar tamaño grande */}

              <Button
                onClick={goInicio}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                INICIO
              </Button>

              <Button
                onClick={goBuscador}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                BUSCADOR
              </Button>

              <Button
                onClick={goSaved}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                GUARDADOS
              </Button>

              <Button
                onClick={goAbout}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                ACERCA DEL SITIO
              </Button>

            </Box>

            <Typography textAlign="center">Tema:&nbsp;</Typography>
            <div className="switch">
              <MaterialUISwitch sx={{ m: 1 }} onChange={handleChange} checked={theme === "dark"} />
            </div>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 'fit-content'
              }}
            >
              
              {user ?
                <Button
                  onClick={goProfile}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {`Hola, ${user}`}&nbsp;&nbsp;
                </Button>
                :
                <Button
                  onClick={goLogin}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Iniciar Sesión
                </Button>
              }
              <Divider orientation="vertical" color="#FFFFFF" flexItem></Divider>
              {user ?
                <Button
                  onClick={goClose}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Cerrar Sesión
                </Button>
                :
                <Button
                  onClick={goRegister}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Registrarse
                </Button>
              }
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}