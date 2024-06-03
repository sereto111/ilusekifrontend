import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { pink, teal, deepOrange } from '@mui/material/colors';
import { goInicio, obtenerUserDescifrado } from './Header';
import Alert from '@mui/material/Alert';
import Webcam from 'react-webcam';

export function AddIllustration() {
    const apiUrl = process.env.REACT_APP_API_URL;

    const usuario = obtenerUserDescifrado('user');

    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(pink[700]),
        backgroundColor: pink[700],
        '&:hover': {
            backgroundColor: pink[900],
        },
    }));

    const ColorButtonTwo = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
        '&:hover': {
            backgroundColor: teal[700],
        },
    }));

    const ColorButtonThree = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
        '&:hover': {
            backgroundColor: deepOrange[700],
        },
    }));

    const webcamRef = useRef(null);
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState(null);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [showAlertToast, setShowAlertToast] = useState(false);
    const [useRearCamera, setUseRearCamera] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detectar si el dispositivo es móvil (o tamaño móvil)
        const checkIsMobile = () => {
            setIsMobile(window.matchMedia("(max-width: 767px)").matches);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    const handleImagenChange = e => {
        const file = e.target.files[0];

        if (!file) {
            setImagen(null);
            setImagenPreview(null);
            return;
        }

        setImagen(file);

        const reader = new FileReader();
        reader.onload = () => {
            setImagenPreview(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const handleCaptureImage = async () => {
        if (webcamRef.current) {
            const imageData = webcamRef.current.getScreenshot();

            if (imageData) {
                const blob = dataURLtoBlob(imageData, "image/jpeg");
                const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });

                setImagen(file);

                const reader = new FileReader();
                reader.onload = () => {
                    setImagenPreview(reader.result);
                };
                reader.readAsDataURL(blob);
            }
        }
    };

    function dataURLtoBlob(dataURL, type) {
        const binaryString = window.atob(dataURL.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(binaryString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }

        return new Blob([uint8Array], { type });
    };

    const handleButtonClick = async () => {
        const formData = new FormData();
        formData.append('descripcion', descripcion);
        formData.append('imagen', imagen);
        formData.append('usuario', usuario);

        if (!imagen) {
            setShowAlertToast(true);
            setTimeout(() => {
                setShowAlertToast(false);
            }, 2000);
        } else {
            try {
                await axios.post(`${apiUrl}/api/ilustration/subirIlustracion`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                goInicio();
            } catch (error) {
                setShowAlertToast(true);
            } finally {
                setImagen(null);
                setImagenPreview(null);
                setTimeout(() => {
                    setShowAlertToast(false);
                }, 2000);
            };
        }
    };

    return (
        <>
            <h1>Subir Ilustración</h1>

            <Box display="flex" justifyContent="center">
            <Stack
                component="form"
                sx={{
                    width: '60%',
                }}
                direction="column"
                spacing={2}
                noValidate
                autoComplete="off"
                style={{ minHeight: '100vh' }}
            >
                <TextField
                    className='register'
                    id="filled-multiline-flexible"
                    label="Descripción (Opcional)"
                    multiline
                    rows={4}
                    variant="filled"
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    sx={{
                        '&:focus-within label': {
                          color: '#C2185B',
                        },
                        '& .MuiFilledInput-underline:after': {
                          borderBottomColor: '#C2185B',
                        }
                      }}
                />
                {/* TODO: Quitar si no se pone el TextField
                <TextField
                    className='register'
                    required
                    id="outlined-required"
                    label="Subido por:"
                    variant="filled"
                    defaultValue={usuario}
                    disabled
                /> 
                */}
                <Box display="flex" justifyContent="center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImagenChange}
                        required
                        style={{
                            width: '100%',
                            maxWidth: '320px',
                            margin: '0 auto',
                        }}
                    />
                </Box>
                <br />
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                        width: 320,
                        height: 240,
                        facingMode: useRearCamera ? "environment" : "user",
                    }}
                    style={{
                        width: '100%',
                        maxWidth: '320px',
                        margin: '0 auto',
                    }}
                />
                <Box display="flex" justifyContent="center">
                    <ColorButtonTwo 
                        variant="contained" 
                        type='button' 
                        onClick={handleCaptureImage}
                        sx={{
                            width: '100%',
                            maxWidth: '250px',
                            margin: '0 auto',
                        }}>
                        Capturar imagen
                    </ColorButtonTwo>
                </Box>
                {isMobile && (
                    <Box display="flex" justifyContent="center">
                        <ColorButtonThree
                            variant="contained"
                            type='button'
                            onClick={() => setUseRearCamera(prev => !prev)}
                            sx={{
                                width: '100%',
                                maxWidth: '250px',
                            }}
                        >
                            {useRearCamera ? 'Cambiar a cámara frontal' : 'Cambiar a cámara trasera'}
                        </ColorButtonThree>
                    </Box>
                )}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {imagenPreview && <img src={imagenPreview} alt="previewImg" style={{ width: '600px' }} />}
                </div>                
                <Box display="flex" justifyContent="center" paddingBottom="20px">
                    <ColorButton 
                        variant="contained" 
                        onClick={handleButtonClick}
                        sx={{
                            width: '100%',
                            maxWidth: '250px',
                            margin: '0 auto',                            
                        }}>
                        Añadir
                    </ColorButton>                    
                </Box>
                {showAlertToast && (
                    <Alert severity="warning" sx={{ textAlign: 'center' }}>
                        No se han rellenado todos los campos obligatorios.
                    </Alert>
                )}
            </Stack>
        </Box>
        </>
    );
}
