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
  const [selectTeamObj, setSelectTeamObj] = useState({
    tempTeam: null,
    teamColor: null,
    selected: false,
  });
  const [change, setChange] = useState(false);

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

    // console.log(localStorage.redTeam);
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

      const parsedSelectTeamObj = JSON.parse(
        localStorage.getItem("selectTeamObj")
      );
      setSelectTeamObj(parsedSelectTeamObj);
    }

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

    io.on("select team", (selectTeamObj) => {
      if (selectTeamObj.teamColor === "red") {
        setRedTeam(selectTeamObj.tempTeam);
      } else {
        setBlueTeam(selectTeamObj.tempTeam);
      }
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
    console.log("storage");
    localStorage.setItem("selectTeamObj", JSON.stringify(selectTeamObj));
  }, [change]);

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

    io.emit("win condition", obj);
    // setColorDis(arr);

    // clear the clicked cards
    let clear = Array(25).fill({ background: "white" });
    io.emit("cardOnClick", clear);
  }

  function click(e) {
    let ind = /\d+/g.exec(e.target.id);
    if (ind) {
      ind = parseInt(ind[0]);
    } else {
      return ind;
    }
    let allCardsColor = cardsColor;
    allCardsColor[ind] = { background: "grey" };
    io.emit("cardOnClick", allCardsColor);
  }

  function selectTeam(e) {
    console.log(selectTeamObj);
    let tempSelectTeamObj = selectTeamObj;
    if (selectTeamObj.selected === false) {
      if (e.target.id === "red") {
        tempSelectTeamObj.tempTeam = redTeam.slice();
        tempSelectTeamObj.teamColor = "red";
      } else {
        tempSelectTeamObj.tempTeam = blueTeam.slice();
        tempSelectTeamObj.teamColor = "blue";
      }
      tempSelectTeamObj.selected = true;

      tempSelectTeamObj.tempTeam.push(loginUser);
      tempSelectTeamObj.tempTeam.join("\r\n");
      console.log(tempSelectTeamObj.tempTeam);
      setSelectTeamObj(tempSelectTeamObj);
      let ans = change;
      if (ans === false) {
        ans = true;
      } else {
        ans = false;
      }
      setChange(ans);
      io.emit("select team", selectTeamObj);
    } else {
      if (tempSelectTeamObj.teamColor === e.target.id) {
        let index = tempSelectTeamObj.tempTeam.indexOf(loginUser);
        tempSelectTeamObj.tempTeam = tempSelectTeamObj.tempTeam
          .slice(0, index)
          .concat(tempSelectTeamObj.tempTeam.slice(index + 1));
        tempSelectTeamObj.selected = false;
        setSelectTeamObj(tempSelectTeamObj);
        let ans = change;
        if (ans === false) {
          ans = true;
        } else {
          ans = false;
        }
        setChange(ans);
        io.emit("select team", selectTeamObj);
      }
    }
  }

  return (
    <div className="board">
      <h2>Welcome {loginUser}</h2>
      <div className="teamsBoard">
        <button id="red" onClick={selectTeam}>
          {redTeam.join("\n")}
        </button>
        <button id="blue" onClick={selectTeam}>
          {blueTeam}
        </button>
      </div>
      {/* <button
        onClick={() => {
          let clear = Array(25).fill({ background: "white" });
          io.emit("cardOnClick", clear);
        }}
      >
        clear
      </button> */}
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
      <div>
        <button id="refresh" className="refresh" onClick={refresh}>
          refresh
        </button>
      </div>
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
    </div>
  );
}

export default Game;
