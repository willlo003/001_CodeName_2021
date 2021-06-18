import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
// import "../styles.scss";

function Lobby({ io }) {
  const history = useHistory();
  const [redTeam, setRedTeam] = useState(
    Array(4).fill({ background: "white" })
  );
  const [redTeamPlayers, setRedTeamPlayers] = useState(["C", "", "", ""]);
  const [redCount, setRedCount] = useState(0);
  const [blueTeam, setBlueTeam] = useState(
    Array(4).fill({ background: "white" })
  );
  const [blueCount, setBlueCount] = useState(0);
  const [blueTeamPlayers, setBlueTeamPlayers] = useState(["C", "", "", ""]);
  const [username, setUsername] = useState(
    JSON.parse(sessionStorage.getItem("token")).username
  );
  // declare an empty object to store the player onclick properties
  const [obj, setObj] = useState({
    clicked: false,
  });

  window.onbeforeunload = function () {
    // let tempObj = obj;
    // if (tempObj.id[0] === "r") {
    //   array[ind] = { background: "white" };
    //   tempRedCount -= 1;
    //   let index = tempRedTeamPlayers.indexOf(username);
    //   if (index === 0) {
    //     tempRedTeamPlayers[index] = "C";
    //   } else {
    //     tempRedTeamPlayers[index] = "";
    //   }
    // } else if (tempObj.id[0] === "b") {
    //   array[ind] = { background: "white" };
    //   tempBlueCount -= 1;
    //   let index = tempBlueTeamPlayers.indexOf(username);
    //   if (index === 0) {
    //     tempBlueTeamPlayers[index] = "C";
    //   } else {
    //     tempBlueTeamPlayers[index] = "";
    //   }
    // }
    // setObj(tempObj);
    // io.emit("player", tempObj);

    let temp = JSON.parse(localStorage.getItem("onlinePlayer"));
    delete temp[username];
    localStorage.setItem("onlinePlayer", JSON.stringify(temp));
    if (Object.keys(temp).length === 0) {
      localStorage.clear();
    }
  };

  // const Prompt = closeWarning();

  useEffect(() => {
    let temp = JSON.parse(localStorage.getItem("onlinePlayer"));
    if (temp === null) temp = {};
    temp[username] = true;
    localStorage.setItem("onlinePlayer", JSON.stringify(temp));

    // const parsedRedTeam = JSON.parse(localStorage["redTeam"]);
    // setRedTeam(parsedRedTeam);

    // const parsedBlueTeam = JSON.parse(localStorage["blueTeam"]);
    // setBlueTeam(parsedBlueTeam);

    // const parsedBlueTeamPlayers = JSON.parse(localStorage["blueTeamPlayers"]);
    // setBlueTeamPlayers(parsedBlueTeamPlayers);

    // const parsedRedTeamPlayers = JSON.parse(localStorage["redTeamPlayers"]);
    // setRedTeamPlayers(parsedRedTeamPlayers);

    // const parsedObj = JSON.parse(sessionStorage.getItem("obj"));
    // if (parsedObj !== null) {
    //   setObj(parsedObj);
    // }

    // listen when the player is clicking the empty seat
    io.on("player", (obj) => {
      if (obj.id[0] === "r") {
        setRedTeam(obj.array);
        setRedCount(obj.redCount);
        setRedTeamPlayers(obj.tempRedTeamPlayers);
      } else {
        setBlueTeam(obj.array);
        setBlueCount(obj.blueCount);
        setBlueTeamPlayers(obj.tempBlueTeamPlayers);
      }

      // create a button to start the game
      let startButton = document.getElementById("S1");

      if (obj.start === true && !startButton) {
        let parent = document.getElementById("start");
        let child = document.createElement("button");
        child.textContent = "Start";
        child.className = "Start-button";
        child.id = "S1";
        child.onclick = function () {
          // localStorage["redTeam"] = JSON.stringify(redTeam);
          // localStorage["blueTeam"] = JSON.stringify(blueTeam);
          localStorage["redTeamPlayers"] = JSON.stringify(redTeamPlayers);
          localStorage["blueTeamPlayers"] = JSON.stringify(blueTeamPlayers);
          io.emit("game start", "/game");
        };
        parent.appendChild(child);
      }
      if (obj.start === false && startButton) {
        startButton.remove();
      }
    });

    // redirect to the room
    io.on("game start", (link) => {
      history.push(link);
    });
  }, []);

  // function ff() {
  //   let tempObj = obj;
  //   console.log(tempObj);

  //   if (tempObj.id[0] === "r") {
  //     tempObj.array[tempObj.ind] = { background: "white" };
  //     tempObj.tempRedCount -= 1;
  //     let index = tempObj.tempRedTeamPlayers.indexOf(username);
  //     if (index === 0) {
  //       tempObj.tempRedTeamPlayers[index] = "C";
  //     } else {
  //       tempObj.tempRedTeamPlayers[index] = "";
  //     }
  //   } else if (tempObj.id[0] === "b") {
  //     tempObj.array[tempObj.ind] = { background: "white" };
  //     tempObj.tempBlueCount -= 1;
  //     let index = tempObj.tempBlueTeamPlayers.indexOf(username);
  //     if (index === 0) {
  //       tempObj.tempBlueTeamPlayers[index] = "C";
  //     } else {
  //       tempObj.tempBlueTeamPlayers[index] = "";
  //     }
  //   }
  //   // console.log(tempObj);
  //   setObj(tempObj);
  //   io.emit("player", tempObj);
  // }

  // useEffect(() => {
  //   localStorage["redTeam"] = JSON.stringify(redTeam);
  // }, [redTeam]);

  // useEffect(() => {
  //   localStorage["blueTeam"] = JSON.stringify(blueTeam);
  // }, [blueTeam]);

  // useEffect(() => {
  //   localStorage["redTeamPlayers"] = JSON.stringify(redTeamPlayers);
  // }, [redTeamPlayers]);

  // useEffect(() => {
  //   localStorage["blueTeamPlayers"] = JSON.stringify(blueTeamPlayers);
  // }, [blueTeamPlayers]);

  // useEffect(() => {
  //   sessionStorage.setItem("obj", JSON.stringify(obj));
  // }, [obj]);

  // when empty seat of the table on click
  function click(e) {
    // check this user whether clicked already
    let button = document.getElementById(e.target.id);
    if (
      (obj.clicked === false && button.style.background === "white") ||
      (obj.clicked === true && obj.id === e.target.id)
    ) {
      let ind = /[0-9]/.exec(e.target.id);
      if (ind) {
        ind = parseInt(ind[0]);
      } else {
        return ind;
      }
      let color,
        array,
        tempRedCount = redCount,
        tempBlueCount = blueCount,
        tempRedTeamPlayers = redTeamPlayers,
        tempBlueTeamPlayers = blueTeamPlayers;

      if (e.target.id[0] === "r") {
        color = "red";
        array = redTeam.slice();
        if (array[ind].background === "red") {
          array[ind] = { background: "white" };
          color = "white";
          tempRedCount -= 1;
          if (ind === 0) {
            tempRedTeamPlayers[ind] = "C";
          } else {
            tempRedTeamPlayers[ind] = "";
          }
        } else {
          array[ind] = { background: "red" };
          tempRedCount += 1;
          tempRedTeamPlayers[ind] = username;
        }
      } else {
        color = "blue";
        array = blueTeam.slice();
        if (array[ind].background === "blue") {
          array[ind] = { background: "white" };
          color = "white";
          tempBlueCount -= 1;
          if (ind === 0) {
            tempBlueTeamPlayers[ind] = "C";
          } else {
            tempBlueTeamPlayers[ind] = "";
          }
        } else {
          array[ind] = { background: "blue" };
          tempBlueCount += 1;
          tempBlueTeamPlayers[ind] = username;
        }
      }
      let tempObj = {
        ind: ind,
        clicked: true,
        id: e.target.id,
        array: array,
        color: color,
        start: false,
        redCount: tempRedCount,
        blueCount: tempBlueCount,
        tempRedTeamPlayers: tempRedTeamPlayers,
        tempBlueTeamPlayers: tempBlueTeamPlayers,
        username: username,
      };
      if (obj.clicked === true) {
        tempObj.clicked = false;
      }
      if (tempBlueCount >= 2 && tempRedCount >= 2) {
        tempObj.start = true;
      } else {
        tempObj.start = false;
      }
      setObj(tempObj);

      io.emit("player", tempObj);
    }
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
            style={redTeam[0]}
          >
            {redTeamPlayers[0]}
          </button>
          <button
            id="r1"
            className="lobbyButton"
            onClick={click}
            style={redTeam[1]}
          >
            {redTeamPlayers[1]}
          </button>

          <button
            id="r2"
            className="lobbyButton"
            onClick={click}
            style={redTeam[2]}
          >
            {redTeamPlayers[2]}
          </button>
          <button
            id="r3"
            className="lobbyButton"
            onClick={click}
            style={redTeam[3]}
          >
            {redTeamPlayers[3]}
          </button>
        </div>
        <div className="blueTeam">
          <button
            id="b0"
            className="lobbyButton"
            onClick={click}
            style={blueTeam[0]}
          >
            {blueTeamPlayers[0]}
          </button>
          <button
            id="b1"
            className="lobbyButton"
            onClick={click}
            style={blueTeam[1]}
          >
            {blueTeamPlayers[1]}
          </button>
          <button
            id="b2"
            className="lobbyButton"
            onClick={click}
            style={blueTeam[2]}
          >
            {blueTeamPlayers[2]}
          </button>
          <button
            id="b3"
            className="lobbyButton"
            onClick={click}
            style={blueTeam[3]}
          >
            {blueTeamPlayers[3]}
          </button>
        </div>
        <div id="start"></div>
      </div>
      <div id="online-player-list"></div>
      {/* <button onClick={ff}>DDD</button> */}
    </div>
  );
}
export default Lobby;
