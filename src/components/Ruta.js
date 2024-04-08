import React from 'react'
import {
    BrowserRouter,
    Switch,
    Route
} from "react-router-dom";
import { Error } from './Error';
import { InitialWindow } from './InitialWindow';
import { News } from './News';
import { Wishlist } from './Wishlist';
import { Register } from './Register';
import { Login } from './Login';
import { About } from './About';
import { AddGame } from './AddGame';
import { AddNews } from './AddNews';
import ResetPass from './ResetPass';
import { Profile } from './Profile';
import { MailPass } from './MailPass';
import { EditGame } from './EditGame';
import { EditNews } from './EditNews';
import { Completed } from './Completed';
import Buscador from './Buscador';

export const Ruta = () => {
    return (
      <BrowserRouter>
          <div className="routes">
              <Switch>
                  <Route exact path="/" component={InitialWindow}></Route>
                  <Route exact path="/register" component={Register}></Route>
                  <Route exact path="/login" component={Login}></Route>
                  <Route exact path="/news" component={News}></Route>
                  <Route exact path="/wishlist" component={Wishlist}></Route>
                  <Route exact path="/completed" component={Completed}></Route>
                  <Route exact path="/search" component={Buscador}></Route>
                  <Route exact path="/about" component={About}></Route>
                  <Route exact path="/addgame" component={AddGame}></Route>
                  <Route exact path="/addnews" component={AddNews}></Route>
                  <Route exact path="/profile" component={Profile}></Route>
                  <Route exact path="/editgame/:nombre" component={EditGame}></Route>
                  <Route exact path="/editnews/:titulo" component={EditNews}></Route>
                  <Route exact path="/mail-pass" component={MailPass}></Route>
                  <Route exact path="/reset-pass" component={ResetPass}></Route>
                  <Route exact path="/error" component={Error}></Route>
                  <Route component={Error}/>  
              </Switch>
          </div> 
  
        
      </BrowserRouter>
    )
  }