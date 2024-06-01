import React from 'react';
import CookieConsent from 'react-cookie-consent';
import Cookies from 'js-cookie';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const CookieBanner = () => {
    const handleAcceptCookies = () => {
        // Añadir cookie de análisis
        Cookies.set('analyticsCookie', 'true', { expires: 365 });
        // Enviar evento a Google Analytics
        window.gtag('event', 'cookie_accepted', {
            'event_category': 'Cookie Consent',
            'event_label': 'Cookies Aceptadas',
            'value': 1
        });
    };

    const handleDeclineCookies = () => {
        // Eliminar cookie de análisis si existía
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
            style={{ background: "#1A1A1A", color: "#FFF" }}
            buttonStyle={{ color: "#FFF", fontSize: "13px", background: "#368B3A", borderRadius: "5px", display: 'flex', width: '90px', fontWeight: 600 }}
            declineButtonStyle={{ color: "#FFF", fontSize: "13px", background: "#E53935", borderRadius: "5px", display: 'flex', width: '90px', fontWeight: 600 }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    Utilizamos cookies para mejorar su experiencia en nuestro sitio web.{' '}
                    <a href="/privacy-policy" style={{ color: "#C22747" }}>
                        Leer más
                    </a>
                </Typography>
            </Box>
        </CookieConsent>
    );
};

export default CookieBanner;