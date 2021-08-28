import React, { useEffect, useState } from "react";
import Conditions from "../components/Condition";
import Card from "../components/Card";

function Game({ io }) {
  const [cards, setCards] = useState([]);
  const [data, setData] = useState(null);
  const [winColor, setWinColor] = useState({ background: "none" });
  const [colorDis, setColorDis] = useState(
    Array(25).fill({ background: "none" })
  );
  const [cardsColor, setCardsColor] = useState(
    Array(25).fill({ background: "none" })
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
  const [onClickCard, setOnClickCard] = useState();

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
    }

    if (
      localStorage["turn"] !== undefined &&
      localStorage["turn"] !== "undefined"
    ) {
      const parsedTurn = JSON.parse(localStorage["turn"]);
      setTurn(parsedTurn);
    }

    if (
      localStorage["remainRed"] !== "undefined" &&
      localStorage["remainRed"] !== undefined
    ) {
      const parsedRemainBed = JSON.parse(localStorage["remainRed"]);
      setRemainRed(parsedRemainBed);
    }

    if (
      localStorage["remainBlue"] !== "undefined" &&
      localStorage["remainBlue"] !== undefined
    ) {
      const parsedRemainBlue = JSON.parse(localStorage["remainBlue"]);
      setRemainBlue(parsedRemainBlue);
    }

    if (
      localStorage["gameover"] !== "undefined" &&
      localStorage["gameover"] !== undefined
    ) {
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
    let clear = Array(25).fill({});
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
      tempStor = Array(25).fill({}),
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
    let clear = Array(25).fill({});
    io.emit("cardOnClick", clear);
    io.emit("gameover", false);
  }

  useEffect(() => {
    click(onClickCard);
  }, [onClickCard]);

  function click(id) {
    if (gameover === false) {
      if (
        (loginUser === redTeam[0] && turn === "red") ||
        (loginUser === blueTeam[0] && turn === "blue")
      ) {
        let ind = /\d+/g.exec(id);
        if (ind) {
          ind = parseInt(ind[0]);
        } else {
          return ind;
        }
        let allCardsColor = cardsColor;
        let currentRemainRed = remainRed;
        let currentRemainBlue = remainBlue;
        if (colorDis[ind].background === undefined) {
          allCardsColor[ind] = { background: "grey" };
        } else {
          allCardsColor[ind] = { background: colorDis[ind].background };
        }
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

        if (
          (turn === "red" && colorDis[ind].background === "blue") ||
          colorDis[ind].background === undefined
        ) {
          nextTurn();
        } else if (
          (turn === "blue" && colorDis[ind].background === "red") ||
          colorDis[ind].background === undefined
        ) {
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

  let textStyle = { color: turn };
  let blueText = { color: "blue" };
  let redText = { color: "red" };

  function nextTurn() {
    if (
      (loginUser === redTeam[0] && turn === "red") ||
      (loginUser === blueTeam[0] && turn === "blue")
    )
      if (turn === "red") {
        io.emit("turn", "blue");
      } else {
        io.emit("turn", "red");
      }
  }
  return (
    <div>
      <h1 className="game-heading">CodeName</h1>
      <div className="board">
        <div className="information">
          <h2>Welcome: {loginUser}</h2>
          <h2>Host: {redTeam[0]}</h2>
          <h2 style={redText}>Red team leader: {redTeam[0]}</h2>
          <h2 style={blueText}>Blue team leader: {blueTeam[0]}</h2>
          <h2 style={textStyle}>Turn: {turn}</h2>
        </div>
        <div className="teamsBoard">
          <button id="red" onClick={selectRedTeam}>
            {redTeam.join("\r\n")}
          </button>
          <button id="blue" onClick={selectBlueTeam}>
            {blueTeam.join("\r\n")}
          </button>
        </div>
        <div className="button-container">
          {gameover === true && <h3 className="gameover">gameover</h3>}
          {cardsColor.map((card, index) => (
            <Card
              key={index}
              cardsColor={cardsColor}
              setOnClickCard={setOnClickCard}
              index={index}
              cards={cards}
            />
          ))}
        </div>
        <div className="control">
          {loginUser === redTeam[0] && (
            <button id="refresh" className="refresh" onClick={refresh}>
              New Game
            </button>
          )}
          {loginUser === redTeam[0] && (
            <button id="changeTeam" className="changeTeam" onClick={changeTeam}>
              Change the team
            </button>
          )}
          {(loginUser === redTeam[0] || loginUser === blueTeam[0]) && (
            <button id="nextTurn" className="nextTurn" onClick={nextTurn}>
              Next
            </button>
          )}
        </div>
        {(loginUser === redTeam[0] || loginUser === blueTeam[0]) && (
          <div className="condition">
            {colorDis.map((color, index) => (
              <Conditions
                key={index}
                className="conditionBox"
                color={color}
                index={index}
              />
            ))}
            <div id="left" className="winBox" style={winColor}></div>
            <div id="right" className="winBox" style={winColor}></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
