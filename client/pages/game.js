import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
// import "../styles.scss";

function Game({ io }) {
  const [cards, setCards] = useState([]);
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [onClickCard, setOnClickCard] = useState(Array(25).fill(false));
  const [colorDis, setColorDis] = useState(
    Array(25).fill({ background: "none" })
  );
  const rowsObj = {
    a: 0,
    b: 5,
    c: 10,
    d: 15,
    e: 20,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch("cards");
        const body = await result.json();
        setData(body.cards[0].name);
        // assign all cards
        let indexs = [],
          temp = [],
          i = 0,
          randomNum = 0;
        while (i < 25) {
          randomNum = Math.floor(Math.random() * body.cards[0].name.length);
          if (indexs.indexOf(randomNum) === -1) {
            indexs.push(randomNum);
            temp.push(body.cards[0].name[randomNum]);
            i++;
          }
        }
        //random the win condition
        setCards(temp);
      } catch (err) {
        // error handling code
        console.log(err);
      }
    };
    // call the async fetchData function
    fetchData();
    io.on("assign", (newCards) => {
      console.log(newCards);
      setCards(newCards);
    });
    io.on("cardOnClick", (id) => {
      let ind = /[0-9]/.exec(id);
      if (ind) {
        ind = parseInt(ind[0]) - 1 + rowsObj[ind.input[0]];
      } else {
        return ind;
      }
      let cardsArr = onClickCard;
      cardsArr[ind] = true;
      setOnClickCard(cardsArr);
      let currentButton = document.getElementById(id);
      if (cardsArr[ind] === true) {
        currentButton.style.background = "grey";
      }
    });
    //win codition
    let randomColor = Math.floor(Math.random() * 10);
    let winBoxs = document.getElementsByClassName("winBox");
    if (randomColor % 2 === 0) {
      randomColor = "red";
    } else {
      randomColor = "blue";
    }
    winBoxs.left.style.background = randomColor;
    winBoxs.right.style.background = randomColor;
    let blueLength, redLength;
    if (randomColor === "blue") {
      blueLength = 9;
      redLength = 8;
    } else {
      blueLength = 8;
      redLength = 9;
    }

    let colorArr = [],
      stor = colorDis,
      j = 0,
      randomColorInd = 0;
    while (j < 25) {
      randomColorInd = Math.floor(Math.random() * 25);
      if (colorArr.indexOf(randomColorInd) === -1) {
        colorArr.push(randomColorInd);
        if (blueLength > 0) {
          stor[randomColorInd] = { background: "blue" };
          blueLength -= 1;
        } else if (redLength > 0) {
          stor[randomColorInd] = { background: "red" };
          redLength -= 1;
        }
        j++;
      }
    }
    console.log(stor);
    // setColorDis(arr);
  }, []);

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
  }

  const style = {
    background: "white",
  };

  function click(e) {
    io.emit("cardOnClick", e.target.id);
  }

  return (
    <div className="board">
      <div className="button-container">
        <button id="a1" className="gameButton" style={style} onClick={click}>
          {cards[0]}
        </button>
        <button id="a2" className="gameButton" style={style} onClick={click}>
          {cards[1]}
        </button>
        <button id="a3" className="gameButton" style={style} onClick={click}>
          {cards[2]}
        </button>
        <button id="a4" className="gameButton" style={style} onClick={click}>
          {cards[3]}
        </button>
        <button id="a5" className="gameButton" style={style} onClick={click}>
          {cards[4]}
        </button>
        <button id="b1" className="gameButton" style={style} onClick={click}>
          {cards[5]}
        </button>
        <button id="b2" className="gameButton" style={style} onClick={click}>
          {cards[6]}
        </button>
        <button id="b3" className="gameButton" style={style} onClick={click}>
          {cards[7]}
        </button>
        <button id="b4" className="gameButton" style={style} onClick={click}>
          {cards[8]}
        </button>
        <button id="b5" className="gameButton" style={style} onClick={click}>
          {cards[9]}
        </button>
        <button id="c1" className="gameButton" style={style} onClick={click}>
          {cards[10]}
        </button>
        <button id="c2" className="gameButton" style={style} onClick={click}>
          {cards[11]}
        </button>
        <button id="c3" className="gameButton" style={style} onClick={click}>
          {cards[12]}
        </button>
        <button id="c4" className="gameButton" style={style} onClick={click}>
          {cards[13]}
        </button>
        <button id="c5" className="gameButton" style={style} onClick={click}>
          {cards[14]}
        </button>
        <button id="d1" className="gameButton" style={style} onClick={click}>
          {cards[15]}
        </button>
        <button id="d2" className="gameButton" style={style} onClick={click}>
          {cards[16]}
        </button>
        <button id="d3" className="gameButton" style={style} onClick={click}>
          {cards[17]}
        </button>
        <button id="d4" className="gameButton" style={style} onClick={click}>
          {cards[18]}
        </button>
        <button id="d5" className="gameButton" style={style} onClick={click}>
          {cards[19]}
        </button>
        <button id="e1" className="gameButton" style={style} onClick={click}>
          {cards[20]}
        </button>
        <button id="e2" className="gameButton" style={style} onClick={click}>
          {cards[21]}
        </button>
        <button id="e3" className="gameButton" style={style} onClick={click}>
          {cards[22]}
        </button>
        <button id="e4" className="gameButton" style={style} onClick={click}>
          {cards[23]}
        </button>
        <button id="e5" className="gameButton" style={style} onClick={click}>
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
        <div id="left" className="winBox"></div>
        <div id="right" className="winBox"></div>
      </div>
    </div>
  );
}

export default Game;
