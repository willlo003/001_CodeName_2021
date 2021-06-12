import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Login from "../pages/login";
import Lobby from "../pages/lobby";
import Game from "../pages/game";
import io from "socket.io-client";




function App() {
  // const [token, setToken] = useState()
  // if(!token) {
  //   return <Login setToken={setToken}/>
  // }
const socket = io()


  return (
    <Router>
      <Switch>
      <Route exact path="/" render={(routeProps)=> <Login {...routeProps} io={socket} /> }/>
        <Route exact path="/lobby" render={(routeProps)=> <Lobby {...routeProps} io={socket} /> }/>
        <Route exact path="/game" render={(routeProps)=> <Game {...routeProps} io={socket} /> }/>
      </Switch>
    </Router>
  );
}


export default App;
