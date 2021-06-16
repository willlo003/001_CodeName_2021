import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
// import "../styles.scss";

function Lobby({ io }) {
  const history = useHistory();
  const [redTeam, setRedTeam] = useState(Array(4).fill(false));
  const [redCount, setRedCount] = useState(0);
  const [blueTeam, setBlueTeam] = useState(Array(4).fill(false));
  const [blueCount, setBlueCount] = useState(0);
  const [username, setUsername] = useState(
    JSON.parse(sessionStorage.getItem("token")).username
  );

  const style = {
    // background: "white",
  };

  // window.onbeforeunload = function () {
  //   let temp = JSON.parse(localStorage["onlinePlayer"]);
  //   delete temp[username];
  //   localStorage["onlinePlayer"] = JSON.stringify(temp);
  //   io.emit("player logged on", temp);
  // };

  // const Prompt = closeWarning();

  useEffect(() => {
    io.on("player", (obj) => {
      if (obj.id[0] === "r") {
        setRedTeam(obj.array);
        setRedCount(obj.redCount);
        document.getElementById(obj.id).style.background = obj.color;
        if (obj.color === "red") {
          document.getElementById(obj.id).textContent = obj.username;
        } else {
          if (obj.id === "r0") {
            document.getElementById(obj.id).textContent = "C";
          } else {
            document.getElementById(obj.id).textContent = "";
          }
        }
      } else {
        setBlueTeam(obj.array);
        setBlueCount(obj.blueCount);
        document.getElementById(obj.id).style.background = obj.color;
        if (obj.color === "blue") {
          document.getElementById(obj.id).textContent = obj.username;
        } else {
          if (obj.id === "b0") {
            document.getElementById(obj.id).textContent = "C";
          } else {
            document.getElementById(obj.id).textContent = "";
          }
        }
      }

      let startButton = document.getElementById("S1");
      if (obj.start === true && !startButton) {
        let parent = document.getElementById("start");
        let child = document.createElement("button");
        child.textContent = "Start";
        child.className = "Start-button";
        child.id = "S1";
        child.onclick = function () {
          io.emit("game start", "/game");
        };
        parent.appendChild(child);
      }
      if (obj.start === false && startButton) {
        startButton.remove();
      }
    });

    io.on("game start", (link) => {
      history.push(link);
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
      username: username,
    };

    if (tempBlueCount >= 2 && tempRedCount >= 2) {
      obj.start = true;
    } else {
      obj.start = false;
    }
    io.emit("player", obj);
  }

  return (
    <div className="App">
      <div id="header">
        <h1>Lobby</h1>
        <h2>Welcome {username}</h2>
      </div>
      <div className="table">
        <div className="redTeam">
          <button
            id="r0"
            className="lobbyButton"
            onClick={click}
            // style={style}
          >
            C
          </button>
          <button
            id="r1"
            className="lobbyButton"
            onClick={click}
            // style={style}
          ></button>
          <button
            id="r2"
            className="lobbyButton"
            onClick={click}
            // style={style}
          ></button>
          <button
            id="r3"
            className="lobbyButton"
            onClick={click}
            // style={style}
          ></button>
        </div>
        <div className="blueTeam">
          <button id="b0" className="lobbyButton" onClick={click} style={style}>
            C
          </button>
          <button
            id="b1"
            className="lobbyButton"
            onClick={click}
            // style={style}
          ></button>
          <button
            id="b2"
            className="lobbyButton"
            onClick={click}
            // style={style}
          ></button>
          <button
            id="b3"
            className="lobbyButton"
            onClick={click}
            // style={style}
          ></button>
        </div>
        <div id="start"></div>
      </div>
      <div id="online-player-list"></div>
    </div>
  );
}
export default Lobby;
