import React from 'react';
import CookieConsent from 'react-cookie-consent';
import Cookies from 'js-cookie';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const CookieBanner = () => {
    const handleAcceptCookies = () => {
        console.log("Cookies aceptadas!");
        // Añadir cookie de analíticas
        Cookies.set('analyticsCookie', 'true', { expires: 365 });
        // Enviar evento a Google Analytics
        window.gtag('event', 'cookie_accepted', {
            'event_category': 'Cookie Consent',
            'event_label': 'Cookies Aceptadas',
            'value': 1
        });
    };

    const handleDeclineCookies = () => {
        console.log("Cookies rechazadas!");
        // Eliminar cookie de analíticas si existía
        Cookies.remove('analyticsCookie');
    };

    return (
        <CookieConsent
            location="bottom"
            buttonText="Aceptar"
            declineButtonText="Rechazar"
            enableDeclineButton
            cookieName="userAcceptedCookies"
            onAccept={handleAcceptCookies}
            onDecline={handleDeclineCookies}
            style={{ background: "#2B373B", color: "white" }}
            buttonStyle={{ color: "#4e503b", fontSize: "13px", background: "#f5b942", borderRadius: "5px" }}
            declineButtonStyle={{ color: "#fff", fontSize: "13px", background: "#c94c4c", borderRadius: "5px" }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    Utilizamos cookies para mejorar su experiencia en nuestro sitio web.{' '}
                    <a href="/privacy-policy" style={{ color: "#f5b942" }}>
                        Leer más
                    </a>
                </Typography>
            </Box>
        </CookieConsent>
    );
};

export default CookieBanner;

//G-0CGVTKRZ4H