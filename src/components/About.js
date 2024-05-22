import React, { useState, useEffect } from 'react';
import Fab from '@mui/material/Fab';
import CachedIcon from '@mui/icons-material/Cached';
import Spline from '@splinetool/react-spline';
import { pink } from '@mui/material/colors';

export function About() {
  const [splinesLoaded, setSplinesLoaded] = useState(false);

  function goAbout() {
    window.open("/about", "_self");
  }

  useEffect(() => {
    setTimeout(() => {
      setSplinesLoaded(true);
    }, 100);
  }, []);

  return (
    <>
      <br />
      <div className="container">
        <Fab
          className="fabR"
          aria-label="reload"
          onClick={goAbout}
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
      </div>

      <h1>Acerca del sitio</h1>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {splinesLoaded ? (
          <>
            <Spline scene="https://prod.spline.design/FcuklIi1EMHY8M2Q/scene.splinecode" style={{ width: '700px', height: '500px', backgroundColor: 'transparent' }} alt='keyboardModel' className='onlyBigScreen' />

            <img src='https://res.cloudinary.com/dmsqsogtj/image/upload/v1716403329/ilusekiFront/assets/sxnbjjgv28gffqsznrgt.jpg' height='500px' width='auto' alt='imagen acerca del sitio' />

            <Spline scene="https://prod.spline.design/GjMnrkFMmc8JNAEe/scene.splinecode" style={{ width: '700px', height: '500px', backgroundColor: 'transparent' }} alt='controllerModel' className='onlyBigScreen' />
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </div>

      <p className='aboutTxt'>
        &#x270F;&#xFE0F; Lorem ipsum dolor sit amet consectetur adipiscing elit, arcu fames lacus vitae augue dictum, venenatis cubilia leo platea pharetra varius.
        <br /><br />
        &#x1F58C;&#xFE0F; Lorem ipsum dolor sit amet consectetur adipiscing elit per nulla sagittis, pretium aliquam vulputate convallis tempor tellus cubilia accumsan ligula.
        <br /><br />
        &#x1F58D;&#xFE0F; Lorem ipsum dolor sit amet consectetur adipiscing elit ornare aliquam quis, quam pharetra metus dictum sagittis nisl torquent potenti habitant.
      </p>
    </>
  )
}
