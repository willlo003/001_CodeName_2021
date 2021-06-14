import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
// import "../styles.scss";

function Lobby({ io }) {
  const history = useHistory();
  const [redTeam, setRedTeam] = useState(Array(4).fill(false));
  const [redCount, setRedCount] = useState(0);
  const [blueTeam, setBlueTeam] = useState(Array(4).fill(false));
  const [blueCount, setBlueCount] = useState(0);

  const style = {
    background: "white",
  };

  useEffect(() => {
    io.on("player", (obj) => {
      if (obj.id[0] === "r") {
        setRedTeam(obj.array);
        setRedCount(obj.redCount);
        document.getElementById(obj.id).style.background = obj.color;
      } else {
        setBlueTeam(obj.array);
        setBlueCount(obj.blueCount);
        document.getElementById(obj.id).style.background = obj.color;
      }
      if (obj.start === true) {
        history.push("/game");
      }
    });

    io.on("player logged on", (username) => {
      let parent = document.getElementById("online-player-list");
      let child = document.createElement("div");
      let subChild = document.createElement("p");
      subChild.textContent = username[0];
      child.className = "onlinePlayer";
      child.appendChild(subChild);
      parent.appendChild(child);
    });
  }, []);

  function click(e) {
    let ind = /[0-9]/.exec(e.target.id);
    if (ind) {
      ind = parseInt(ind[0]);
    } else {
      return ind;
    }
    let color,
      array,
      tempRedCount = redCount,
      tempBlueCount = blueCount;
    if (e.target.id[0] === "r") {
      color = "red";
      array = redTeam;
      if (array[ind] === true) {
        array[ind] = false;
        color = "white";
        tempRedCount -= 1;
      } else {
        array[ind] = true;
        tempRedCount += 1;
      }
    } else {
      color = "blue";
      array = blueTeam;
      if (array[ind] === true) {
        array[ind] = false;
        color = "white";
        tempBlueCount -= 1;
      } else {
        array[ind] = true;
        tempBlueCount += 1;
      }
    }

    let obj = {
      id: e.target.id,
      array: array,
      color: color,
      start: false,
      redCount: tempRedCount,
      blueCount: tempBlueCount,
    };

    if (tempBlueCount >= 2 && tempRedCount >= 2) {
      obj.start = true;
    }
    io.emit("player", obj);
  }

  return (
    <div className="App">
      <h1>Lobby</h1>
      <div className="table">
        <div className="redTeam">
          <button
            id="r0"
            className="lobbyButton"
            onClick={click}
            style={style}
          ></button>
          <button
            id="r1"
            className="lobbyButton"
            onClick={click}
            style={style}
          ></button>
          <button
            id="r2"
            className="lobbyButton"
            onClick={click}
            style={style}
          ></button>
          <button
            id="r3"
            className="lobbyButton"
            onClick={click}
            style={style}
          ></button>
        </div>
        <div className="blueTeam">
          <button
            id="b0"
            className="lobbyButton"
            onClick={click}
            style={style}
          ></button>
          <button
            id="b1"
            className="lobbyButton"
            onClick={click}
            style={style}
          ></button>
          <button
            id="b2"
            className="lobbyButton"
            onClick={click}
            style={style}
          ></button>
          <button
            id="b3"
            className="lobbyButton"
            onClick={click}
            style={style}
          ></button>
        </div>
      </div>
      <div id="online-player-list"></div>
    </div>
  );
}
export default Lobby;
