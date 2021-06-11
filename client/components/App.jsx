import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Login from "../pages/login";
import Lobby from "../pages/lobby";
import Game from "../pages/game";




function App() {
  // const [token, setToken] = useState()
  // if(!token) {
  //   return <Login setToken={setToken}/>
  // }

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/lobby" component={Lobby} />
        <Route path="/game" component={Game} />
      </Switch>
    </Router>
  );
}


export default App;
