import React, { /* useRef ,*/ useState } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import { goInicio } from './Header';
import Alert from '@mui/material/Alert';
/* import Webcam from 'react-webcam'; */

export function AddIllustration() {
    const apiUrl = process.env.REACT_APP_API_URL;

    const usuario = localStorage.getItem('user');

    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(pink[700]),
        backgroundColor: pink[700],
        '&:hover': {
            backgroundColor: pink[900],
        },
    }));

    /* const webcamRef = useRef(Webcam); */
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState(null);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [showAlertToast, setShowAlertToast] = useState(false);

    const handleImagenChange = e => {
        const file = e.target.files[0];

        if (!file) {
            // Si el usuario cancela la selección de archivo, no hay archivo seleccionado
            setImagen(null);
            setImagenPreview(null);
            return;
        }

        setImagen(file);

        const reader = new FileReader();
        reader.onload = () => {
            // Una vez que el archivo se ha leído, actualiza el estado `imagePreview` con la URL de datos
            setImagenPreview(reader.result);
        };

        // Lee el archivo como una URL de datos
        reader.readAsDataURL(file);
    };

    /* const handleCaptureImage = async () => {
        try {

            //En caso de que no se encuentre cámara    
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("No se ha podido acceder a la cámara");
            }

            if (webcamRef.current) {
                const imageData = webcamRef.current.getScreenshot();

                if (imageData) {
                    const blob = dataURLtoBlob(imageData, "image/jpeg");

                    const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });

                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('filename', file.name);
                    formData.append('originalName', file.name);

                    axios.post('http://localhost:5000/upload', formData)
                        .then(response => {
                            const imagePath = response.data.imagePath;                            
                            setImagenUrl(imagePath);
                        })
                        .catch(error => { });
                }
            }
        } catch (error) { }
    }; 

    function dataURLtoBlob(dataURL, type) {
        const binaryString = window.atob(dataURL.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(binaryString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }

        return new Blob([uint8Array], { type });
    };*/

    const handleButtonClick = async () => {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('imagen', imagen); // Añade la imagen al objeto FormData
        formData.append('usuario', usuario); //Subido por:


        if (!imagen || !nombre || !descripcion) {
            // Si falta alguno de los campos obligatorios, muestra un mensaje de error
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

                //TODO: Ver si redirigir a perfil o dejar a inicio
                goInicio(); //Ir a Inicio

            } catch (error) {
                setShowAlertToast(true);
            } finally {                
                setImagen(null);
                setImagenPreview(null);
                setTimeout(() => {
                    setShowAlertToast(false);
                }, 2000); // Espera 2 segundos antes de ocultar el AlertToast
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
                        width: '25ch',
                    }}
                    direction="column"
                    spacing={2}
                    noValidate
                    autoComplete="off"
                    style={{ minHeight: '100vh' }}
                >

                    {/* TODO: Quitar nombre | Eliminar del backend o poner aleatorio */}
                    <TextField className='register'
                        required
                        id="outlined-required"
                        label="Nombre"
                        variant="filled"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                    />
                    {/* TODO: Quitar que sea obligatoria en el backend y poner una descripción por defecto en caso de vacía */}
                    <TextField className='register'
                        required
                        id="filled-multiline-flexible"
                        label="Descripción"
                        multiline
                        rows={4}
                        variant="filled"
                        value={descripcion}
                        onChange={e => setDescripcion(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImagenChange}
                        required
                    />
                    {/* <Webcam
                        audio={false}
                        ref={webcamRef}
                    />
                    <button type='button' onClick={handleCaptureImage}>Capturar imagen</button> */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {imagenPreview && <img src={imagenPreview} alt="previewImg" style={{ width: '200px' }} />}
                    </div>
                    <TextField className='register'
                        required
                        id="outlined-required"
                        label="Subido por:"
                        variant="filled"
                        defaultValue={usuario}
                        disabled
                    />

                    <ColorButton variant="contained" onClick={handleButtonClick}>Añadir</ColorButton>

                    {showAlertToast && (
                        <Alert severity="warning" sx={{ textAlign: 'center' }}>
                            No se han rellenado todos los campos obligatorios.
                        </Alert>
                    )}

                </Stack>
            </Box>
        </>
    )
}