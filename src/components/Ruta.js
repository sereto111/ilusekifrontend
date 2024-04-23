import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Error } from './Error';
//import { InitialWindow } from './InitialWindow';
import { InitialWindowTest } from './InitialWindowTest';
//import { News } from './News';
//import { Wishlist } from './Wishlist';
import { Register } from './Register';
import { Login } from './Login';
//import { About } from './About';
//import { AddIllustration } from './AddIllustration';
//import { AddNews } from './AddNews';
//import ResetPass from './ResetPass';
import { Profile } from './Profile';
import { MailPass } from './MailPass';
import { AddIllustration } from './AddIllustration';
//import { EditGame } from './EditGame';
//import { EditNews } from './EditNews';
//import { Completed } from './Completed';
import { Buscador } from './Buscador';

export const Ruta = () => {
    return (
        <BrowserRouter>
            <div className="routes">
                <Routes>
                    <Route exact path='/' element={<InitialWindowTest/>}></Route>
                    <Route exact path='/register' element={<Register/>}></Route>
                    <Route exact path='/login' element={<Login/>}></Route>
                  {/*<Route exact path="/news" component={News}></Route>
                  <Route exact path="/wishlist" component={Wishlist}></Route>
                  <Route exact path="/completed" component={Completed}></Route>*/}
                    <Route exact path='/search' element={<Buscador/>}></Route>
                  {/*<Route exact path="/about" component={About}></Route>*/}
                  <Route exact path='/upload' element={<AddIllustration/>}></Route>
                  {/*<Route exact path="/addnews" component={AddNews}></Route>*/}
                  <Route exact path='/profile' element={<Profile/>}></Route>
                  {/*<Route exact path="/editgame/:nombre" component={EditGame}></Route>
                  <Route exact path="/editnews/:titulo" component={EditNews}></Route>*/}
                  <Route exact path='/mail-pass' element={<MailPass/>}></Route>
                  {/*<Route exact path='/reset-pass' element={<ResetPass/>}></Route>*/}
                  <Route exact path='/error' element={<Error/>}></Route> 
                  <Route path='*' element={<Error/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    )
}