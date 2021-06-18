import { isValidObjectId } from "mongoose";
import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
// import "../styles.scss";

function Game({ io }) {
  const [cards, setCards] = useState([]);
  const [data, setData] = useState(null);
  const [winColor, setWinColor] = useState({ background: "none" });
  const [colorDis, setColorDis] = useState(
    Array(25).fill({ background: "none" })
  );
  const [cardsColor, setCardsColor] = useState(
    Array(25).fill({ background: "white" })
  );
  const [loginUser, setLoginUser] = useState(
    JSON.parse(sessionStorage.getItem("token")).username
  );
  const [redTeam, setRedTeam] = useState([]);
  const [blueTeam, setBlueTeam] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [turn, setTurn] = useState();
  const [remainRed, setRemainRed] = useState();
  const [remainBlue, setRemainBlue] = useState();
  const [gameover, setGameover] = useState(false);

  window.onbeforeunload = function () {
    if (localStorage.getItem("onlinePlayer") !== null) {
      let temp = JSON.parse(localStorage.getItem("onlinePlayer"));
      delete temp[loginUser];
      localStorage.setItem("onlinePlayer", JSON.stringify(temp));
      if (Object.keys(temp).length === 0) {
        localStorage.clear();
      }
    } else {
      localStorage.clear();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch("cards");
        const body = await result.json();
        setData(body.cards[0].name);
      } catch (err) {
        // error handling code
        console.log(err);
      }
    };
    // call the async fetchData function
    fetchData();

    if (localStorage.getItem("onlinePlayer") === null) {
      let temp = {};
      temp[loginUser] = true;
      localStorage.setItem("onlinePlayer", JSON.stringify(temp));
    } else {
      let temp = JSON.parse(localStorage.getItem("onlinePlayer"));
      temp[loginUser] = true;
      localStorage.setItem("onlinePlayer", JSON.stringify(temp));
    }

    if (localStorage.redTeam !== undefined) {
      const parsedCardsColor = JSON.parse(localStorage["cardsColor"]);
      setCardsColor(parsedCardsColor);

      const parsedCards = JSON.parse(localStorage["cards"]);
      setCards(parsedCards);

      const parsedColorDis = JSON.parse(localStorage["colorDis"]);
      setColorDis(parsedColorDis);

      const parsedWinColor = JSON.parse(localStorage.getItem("winColor"));
      setWinColor(parsedWinColor);

      const parsedRedTeam = JSON.parse(localStorage["redTeam"]);
      setRedTeam(parsedRedTeam);

      const parsedBlueTeam = JSON.parse(localStorage["blueTeam"]);
      setBlueTeam(parsedBlueTeam);

      const parsedPlaying = JSON.parse(localStorage["playing"]);
      setPlaying(parsedPlaying);

      // const parsedRemainBlue = JSON.parse(localStorage["remainBlue"]);
      // setRemainBlue(parsedRemainBlue);

      // const parsedRemainBed = JSON.parse(localStorage["remainRed"]);
      // setRemainRed(parsedRemainBed);
    }

    console.log(
      localStorage["turn"] !== "undefined",
      localStorage["turn"] !== undefined
    );
    if (localStorage["turn"] !== "undefined") {
      const parsedTurn = JSON.parse(localStorage["turn"]);
      setTurn(parsedTurn);
    }

    if (localStorage["remainRed"] !== "undefined") {
      const parsedRemainBed = JSON.parse(localStorage["remainRed"]);
      setRemainRed(parsedRemainBed);
    }

    if (localStorage["remainBlue"] !== "undefined") {
      const parsedRemainBlue = JSON.parse(localStorage["remainBlue"]);
      setRemainBlue(parsedRemainBlue);
    }

    if (localStorage["gameover"] !== "undefined") {
      const parsedGameover = JSON.parse(localStorage["gameover"]);
      setGameover(parsedGameover);
    }

    const parsedSelectRedTeamObj = JSON.parse(
      sessionStorage.getItem("selectRedTeamObj")
    );

    const parsedSelectBlueTeamObj = JSON.parse(
      sessionStorage.getItem("selectBlueTeamObj")
    );

    io.on("assign", (newCards) => {
      setCards(newCards);
    });

    io.on("win condition", (obj) => {
      setColorDis(obj.colorArr);
      setWinColor(obj.winColor);
    });

    io.on("cardOnClick", (colorArr) => {
      setCardsColor(colorArr);
    });

    io.on("select red team", (redTeamPlayers) => {
      setRedTeam(redTeamPlayers);
    });

    io.on("select blue team", (blueTeamPlayers) => {
      setBlueTeam(blueTeamPlayers);
    });

    io.on("playing", (status) => {
      setPlaying(status);
    });

    io.on("turn", (turn) => {
      setTurn(turn);
    });

    io.on("remainRed", (remainRed) => {
      setRemainRed(remainRed);
    });

    io.on("remainBlue", (remainBlue) => {
      setRemainBlue(remainBlue);
    });

    io.on("gameover", (gameover) => {
      setGameover(gameover);
    });
  }, []);

  useEffect(() => {
    localStorage["cardsColor"] = JSON.stringify(cardsColor);
  }, [cardsColor]);

  useEffect(() => {
    localStorage["cards"] = JSON.stringify(cards);
  }, [cards]);

  useEffect(() => {
    localStorage["colorDis"] = JSON.stringify(colorDis);
  }, [colorDis]);

  useEffect(() => {
    localStorage.setItem("winColor", JSON.stringify(winColor));
  }, [winColor]);

  useEffect(() => {
    localStorage["redTeam"] = JSON.stringify(redTeam);
  }, [redTeam]);

  useEffect(() => {
    localStorage["blueTeam"] = JSON.stringify(blueTeam);
  }, [blueTeam]);

  useEffect(() => {
    localStorage["playing"] = JSON.stringify(playing);
  }, [playing]);

  useEffect(() => {
    if (turn !== "none") {
      localStorage["turn"] = JSON.stringify(turn);
    }
  }, [turn]);

  useEffect(() => {
    localStorage["remainRed"] = JSON.stringify(remainRed);
  }, [remainRed]);

  useEffect(() => {
    localStorage["remainBlue"] = JSON.stringify(remainBlue);
  }, [remainBlue]);

  useEffect(() => {
    localStorage["gameover"] = JSON.stringify(gameover);
  }, [gameover]);

  function changeTeam() {
    let clear = Array(25).fill({ background: "white" });
    io.emit("cardOnClick", clear);
    let clearCards = [];
    io.emit("assign", clearCards);
    io.emit("playing", false);
    io.emit("gameover", false);
  }

  function refresh() {
    let indexs = [],
      temp = [],
      i = 0,
      randomNum = 0;
    while (i < 25) {
      randomNum = Math.floor(Math.random() * data.length);
      if (indexs.indexOf(randomNum) === -1) {
        indexs.push(randomNum);
        temp.push(data[randomNum]);
        i++;
      }
    }
    io.emit("playing", true);
    io.emit("assign", temp);

    //win codition
    //win color
    let randomColor = Math.floor(Math.random() * 10);
    randomColor = randomColor % 2 === 0 ? "red" : "blue";

    //declare 2 arrays to create 2 set random numbers
    let blueLength,
      redLength,
      blackLength = 1;
    if (randomColor === "blue") {
      blueLength = 9;
      redLength = 8;
    } else {
      blueLength = 8;
      redLength = 9;
    }

    io.emit("remainRed", redLength);
    io.emit("remainBlue", blueLength);
    //create new arr of color with different background color
    let checkInd = [],
      tempStor = Array(25).fill({ background: "none" }),
      randomColorInd = 0;

    while (blackLength > 0) {
      randomColorInd = Math.floor(Math.random() * 25);
      if (checkInd.indexOf(randomColorInd) === -1) {
        checkInd.push(randomColorInd);
        if (blueLength > 0) {
          tempStor[randomColorInd] = { background: "blue" };
          blueLength -= 1;
        } else if (redLength > 0) {
          tempStor[randomColorInd] = { background: "red" };
          redLength -= 1;
        } else if (blackLength > 0) {
          tempStor[randomColorInd] = { background: "black" };
          blackLength -= 1;
        }
      }
    }

    //declare obj to pass to information to other user
    let obj = {
      colorArr: tempStor,
      winColor: { background: randomColor },
    };
    io.emit("turn", randomColor);
    io.emit("win condition", obj);

    // clear the clicked cards
    let clear = Array(25).fill({ background: "white" });
    io.emit("cardOnClick", clear);
    io.emit("gameover", false);
  }

  function click(e) {
    if (gameover === false) {
      if (
        (loginUser === redTeam[0] && turn === "red") ||
        (loginUser === blueTeam[0] && turn === "blue")
      ) {
        let ind = /\d+/g.exec(e.target.id);
        if (ind) {
          ind = parseInt(ind[0]);
        } else {
          return ind;
        }
        let allCardsColor = cardsColor;
        let currentRemainRed = remainRed;
        let currentRemainBlue = remainBlue;
        // console.log(colorDis[ind], turn);
        allCardsColor[ind] = { background: colorDis[ind].background };
        if (colorDis[ind].background === "red") {
          currentRemainRed -= 1;
          io.emit("remainRed", currentRemainRed);
        }

        if (colorDis[ind].background === "blue") {
          currentRemainBlue -= 1;
          io.emit("remainBlue", currentRemainBlue);
        }

        if (
          colorDis[ind].background === "black" ||
          currentRemainBlue === 0 ||
          currentRemainRed === 0
        ) {
          io.emit("gameover", true);
        }
        io.emit("cardOnClick", allCardsColor);

        if (turn === "red") {
          colorDis[ind].background === "blue";
          nextTurn();
        } else if (turn === "blue") {
          colorDis[ind].background === "red";
          nextTurn();
        }
      }
    }
  }

  function selectRedTeam() {
    if (playing === false) {
      if (
        sessionStorage.getItem("selectBlueTeamObj") === null ||
        JSON.parse(sessionStorage.getItem("selectBlueTeamObj")).selected ===
          false
      ) {
        let currentRedTeam = JSON.parse(localStorage["redTeam"]);
        let currentRedObj = { selected: false };
        if (sessionStorage.getItem("selectRedTeamObj") !== null) {
          currentRedObj = JSON.parse(
            sessionStorage.getItem("selectRedTeamObj")
          );
        }
        if (currentRedObj.selected === false) {
          currentRedTeam.push(loginUser);
          currentRedObj.selected = true;
        } else {
          let index = currentRedTeam.indexOf(loginUser);
          currentRedTeam = currentRedTeam
            .slice(0, index)
            .concat(currentRedTeam.slice(index + 1));
          currentRedObj.selected = false;
        }
        sessionStorage.setItem(
          "selectRedTeamObj",
          JSON.stringify(currentRedObj)
        );
        io.emit("select red team", currentRedTeam);
      }
    }
  }

  function selectBlueTeam() {
    if (playing === false) {
      if (
        sessionStorage.getItem("selectRedTeamObj") === null ||
        JSON.parse(sessionStorage.getItem("selectRedTeamObj")).selected ===
          false
      ) {
        let currentBlueTeam = JSON.parse(localStorage["blueTeam"]);
        let currentBlueObj = { selected: false };
        if (sessionStorage.getItem("selectBlueTeamObj") !== null) {
          currentBlueObj = JSON.parse(
            sessionStorage.getItem("selectBlueTeamObj")
          );
        }
        if (currentBlueObj.selected === false) {
          currentBlueTeam.push(loginUser);
          currentBlueObj.selected = true;
        } else {
          let index = currentBlueTeam.indexOf(loginUser);
          currentBlueTeam = currentBlueTeam
            .slice(0, index)
            .concat(currentBlueTeam.slice(index + 1));
          currentBlueObj.selected = false;
        }
        sessionStorage.setItem(
          "selectBlueTeamObj",
          JSON.stringify(currentBlueObj)
        );
        io.emit("select blue team", currentBlueTeam);
      }
    }
  }

  function nextTurn() {
    if (turn === "red") {
      io.emit("turn", "blue");
    } else {
      io.emit("turn", "red");
    }
  }
  return (
    <div className="board">
      <h2>Welcome {loginUser}</h2>
      <h2>Host {redTeam[0]}</h2>
      <h2>Red team leader {redTeam[0]}</h2>
      <h2>Blue team leader {blueTeam[0]}</h2>
      <h3>Turn {turn}</h3>
      {gameover === true && <h3>gameover</h3>}
      <div className="teamsBoard">
        <button id="red" onClick={selectRedTeam}>
          {redTeam.join("\r\n")}
        </button>
        <button id="blue" onClick={selectBlueTeam}>
          {blueTeam.join("\r\n")}
        </button>
      </div>
      <div className="button-container">
        <button
          id="a0"
          className="gameButton"
          style={cardsColor[0]}
          onClick={click}
        >
          {cards[0]}
        </button>
        <button
          id="a1"
          className="gameButton"
          style={cardsColor[1]}
          onClick={click}
        >
          {cards[1]}
        </button>
        <button
          id="a2"
          className="gameButton"
          style={cardsColor[2]}
          onClick={click}
        >
          {cards[2]}
        </button>
        <button
          id="a3"
          className="gameButton"
          style={cardsColor[3]}
          onClick={click}
        >
          {cards[3]}
        </button>
        <button
          id="a4"
          className="gameButton"
          style={cardsColor[4]}
          onClick={click}
        >
          {cards[4]}
        </button>
        <button
          id="a5"
          className="gameButton"
          style={cardsColor[5]}
          onClick={click}
        >
          {cards[5]}
        </button>
        <button
          id="a6"
          className="gameButton"
          style={cardsColor[6]}
          onClick={click}
        >
          {cards[6]}
        </button>
        <button
          id="a7"
          className="gameButton"
          style={cardsColor[7]}
          onClick={click}
        >
          {cards[7]}
        </button>
        <button
          id="a8"
          className="gameButton"
          style={cardsColor[8]}
          onClick={click}
        >
          {cards[8]}
        </button>
        <button
          id="a9"
          className="gameButton"
          style={cardsColor[9]}
          onClick={click}
        >
          {cards[9]}
        </button>
        <button
          id="a10"
          className="gameButton"
          style={cardsColor[10]}
          onClick={click}
        >
          {cards[10]}
        </button>
        <button
          id="a11"
          className="gameButton"
          style={cardsColor[11]}
          onClick={click}
        >
          {cards[11]}
        </button>
        <button
          id="a12"
          className="gameButton"
          style={cardsColor[12]}
          onClick={click}
        >
          {cards[12]}
        </button>
        <button
          id="a13"
          className="gameButton"
          style={cardsColor[13]}
          onClick={click}
        >
          {cards[13]}
        </button>
        <button
          id="a14"
          className="gameButton"
          style={cardsColor[14]}
          onClick={click}
        >
          {cards[14]}
        </button>
        <button
          id="a15"
          className="gameButton"
          style={cardsColor[15]}
          onClick={click}
        >
          {cards[15]}
        </button>
        <button
          id="a16"
          className="gameButton"
          style={cardsColor[16]}
          onClick={click}
        >
          {cards[16]}
        </button>
        <button
          id="a17"
          className="gameButton"
          style={cardsColor[17]}
          onClick={click}
        >
          {cards[17]}
        </button>
        <button
          id="a18"
          className="gameButton"
          style={cardsColor[18]}
          onClick={click}
        >
          {cards[18]}
        </button>
        <button
          id="a19"
          className="gameButton"
          style={cardsColor[19]}
          onClick={click}
        >
          {cards[19]}
        </button>
        <button
          id="a20"
          className="gameButton"
          style={cardsColor[20]}
          onClick={click}
        >
          {cards[20]}
        </button>
        <button
          id="a21"
          className="gameButton"
          style={cardsColor[21]}
          onClick={click}
        >
          {cards[21]}
        </button>
        <button
          id="a22"
          className="gameButton"
          style={cardsColor[22]}
          onClick={click}
        >
          {cards[22]}
        </button>
        <button
          id="a23"
          className="gameButton"
          style={cardsColor[23]}
          onClick={click}
        >
          {cards[23]}
        </button>
        <button
          id="a24"
          className="gameButton"
          style={cardsColor[24]}
          onClick={click}
        >
          {cards[24]}
        </button>
      </div>
      {loginUser === redTeam[0] && (
        <div>
          <button id="refresh" className="refresh" onClick={refresh}>
            New Game
          </button>
          <button id="changeTeam" className="changeTeam" onClick={changeTeam}>
            Change the team
          </button>
        </div>
      )}
      {(loginUser === redTeam[0] || loginUser === blueTeam[0]) && (
        <button id="nextTurn" className="nextTurn" onClick={nextTurn}>
          Next
        </button>
      )}
      {(loginUser === redTeam[0] || loginUser === blueTeam[0]) && (
        <div className="condition">
          <div id="c0" className="conditionBox" style={colorDis[0]}></div>
          <div id="c1" className="conditionBox" style={colorDis[1]}></div>
          <div id="c2" className="conditionBox" style={colorDis[2]}></div>
          <div id="c3" className="conditionBox" style={colorDis[3]}></div>
          <div id="c4" className="conditionBox" style={colorDis[4]}></div>
          <div id="c5" className="conditionBox" style={colorDis[5]}></div>
          <div id="c6" className="conditionBox" style={colorDis[6]}></div>
          <div id="c7" className="conditionBox" style={colorDis[7]}></div>
          <div id="c8" className="conditionBox" style={colorDis[8]}></div>
          <div id="c9" className="conditionBox" style={colorDis[9]}></div>
          <div id="c10" className="conditionBox" style={colorDis[10]}></div>
          <div id="c11" className="conditionBox" style={colorDis[11]}></div>
          <div id="c12" className="conditionBox" style={colorDis[12]}></div>
          <div id="c13" className="conditionBox" style={colorDis[13]}></div>
          <div id="c14" className="conditionBox" style={colorDis[14]}></div>
          <div id="c15" className="conditionBox" style={colorDis[15]}></div>
          <div id="c16" className="conditionBox" style={colorDis[16]}></div>
          <div id="c17" className="conditionBox" style={colorDis[17]}></div>
          <div id="c18" className="conditionBox" style={colorDis[18]}></div>
          <div id="c19" className="conditionBox" style={colorDis[19]}></div>
          <div id="c20" className="conditionBox" style={colorDis[20]}></div>
          <div id="c21" className="conditionBox" style={colorDis[21]}></div>
          <div id="c22" className="conditionBox" style={colorDis[22]}></div>
          <div id="c23" className="conditionBox" style={colorDis[23]}></div>
          <div id="c24" className="conditionBox" style={colorDis[24]}></div>
          <div id="left" className="winBox" style={winColor}></div>
          <div id="right" className="winBox" style={winColor}></div>
        </div>
      )}
    </div>
  );
}

export default Game;
