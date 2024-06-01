import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Error } from './Error';
import { InitialWindow } from './InitialWindow';
import { SavedList } from './SavedList';
import { Register } from './Register';
import { Login } from './Login';
import { About } from './About';
import ResetPass from './ResetPass';
import { Profile } from './Profile';
import { MailPass } from './MailPass';
import { AddIllustration } from './AddIllustration';
import { Buscador } from './Buscador';
import { PrivacyPolicy } from './PrivacyPolicy';

export const Ruta = () => {
    return (
        <BrowserRouter>
            <div className="routes">
                <Routes>
                    <Route exact path='/' element={<InitialWindow />}></Route>
                    <Route exact path='/register' element={<Register />}></Route>
                    <Route exact path='/login' element={<Login />}></Route>
                    <Route exact path='/saved' element={<SavedList />}></Route>
                    <Route exact path='/search' element={<Buscador />}></Route>
                    <Route exact path='/about' element={<About />}></Route>
                    <Route exact path='/upload' element={<AddIllustration />}></Route>
                    <Route exact path='/profile' element={<Profile />}></Route>
                    <Route exact path='/mail-pass' element={<MailPass />}></Route>
                    <Route exact path='/reset-pass' element={<ResetPass />}></Route>
                    <Route exact path='/privacy-policy' element={<PrivacyPolicy />}></Route>
                    <Route exact path='/error' element={<Error />}></Route>
                    <Route path='*' element={<Error />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}