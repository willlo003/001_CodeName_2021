import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
// import "../styles.scss";

function Lobby({ io }) {
  const history = useHistory();
  const [players, setPlayers] = useState([false, false, false, false]);

  const style = {
    background: "white",
  };

  function click(e) {
    let ind = /[0-9]/.exec(e.target.id);
    if (ind) {
      ind = parseInt(ind[0]);
    } else {
      return ind;
    }
    io.emit("player", ind);
  }

  io.on("player", (ind) => {
    let array = players;
    if (array[ind] === true) {
      array[ind] = false;
    } else {
      array[ind] = true;
    }
    setPlayers(array);
    io.emit("player join", ind);
    if (players.indexOf(false) === -1) {
      io.emit("game start", "game");
    }
  });
  io.on("player join", (index) => {
    let currentButton = document.getElementById(`p${index}`);
    if (players[index] === true) {
      currentButton.style.background = "grey";
    } else {
      currentButton.style.background = "white";
    }
  });

  io.on("game start", (directory) => {
    history.push(directory);
  });

  return (
    <div className="App" id="omg">
      <h1>Lobby</h1>
      <button id="p0" className="button" onClick={click}></button>
      <button id="p1" className="button" onClick={click}></button>
      <button id="p2" className="button" onClick={click}></button>
      <button id="p3" className="button" onClick={click}></button>
    </div>
  );
}
export default Lobby;
