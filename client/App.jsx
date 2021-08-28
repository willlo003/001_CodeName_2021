import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Login from "./pages/login";
import Game from "./pages/game";
import io from "socket.io-client";
import useToken from "./components/userToken";


function App() {
  const socket = io()

  const {token, setToken} = useToken()

  if(!token) {
    return (
      <Router>
        <Switch>
        <Route path="/" render={(routeProps)=> <Login {...routeProps} io={socket} setToken={setToken} /> }/>
        </Switch>
      </Router>
    );
  }

  return (
    <Router>
      <Switch>
      <Route exact path="/" render={(routeProps)=> <Login {...routeProps} io={socket} setToken={setToken} /> }/>
        <Route exact path="/game" render={(routeProps)=> <Game {...routeProps} io={socket} /> }/>
      </Switch>
    </Router>
  );
}


export default App;
