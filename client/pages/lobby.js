import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
// import "../styles.scss";

function Lobby({ io }) {
  const history = useHistory();
  const [players, setPlayers] = useState([false, false, false, false]);

  const style = {
    background: "white",
  };

  useEffect(() => {
    io.on("player", (obj) => {
      setPlayers(obj.array);
      document.getElementById(obj.id).style.background = obj.color;
      if (obj.start === true) {
        history.push("/game");
      }
    });

    io.on("player logged on", (username) => {
      console.log(username);
    });
  }, []);

  function click(e) {
    let ind = /[0-9]/.exec(e.target.id);
    if (ind) {
      ind = parseInt(ind[0]);
    } else {
      return ind;
    }
    let color = "grey";
    let array = players;
    if (array[ind] === true) {
      array[ind] = false;
      color = "white";
    } else {
      array[ind] = true;
    }
    let obj = {
      id: e.target.id,
      array: array,
      color: color,
      start: false,
    };
    if (array.indexOf(false) === -1) {
      obj.start = true;
    }
    io.emit("player", obj);
  }

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
