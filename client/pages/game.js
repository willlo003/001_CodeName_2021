import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import io from "socket.io-client";
import "../styles.scss";
const socket = io();

function Game() {
  const [cards, setCards] = useState([]);
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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
        setCards(temp);
      } catch (err) {
        // error handling code
        console.log(err);
      }
    };
    // call the async fetchData function
    fetchData();
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
    setCards(temp);
    socket.emit("assign", "omg");
  }

  function click() {
    // indexs = allCards.name;
  }

  socket.on("assign", (mes) => {
    console.log(mes);
  });

  return (
    <div className="board">
      <div className="button-container">
        <button id="a1" className="gameButton" value={cards} onClick={click}>
          {cards[0]}
        </button>
        <button id="a2" className="gameButton" onClick={click}>
          {cards[1]}
        </button>
        <button id="a3" className="gameButton" onClick={click}>
          {cards[2]}
        </button>
        <button id="a4" className="gameButton" onClick={click}>
          {cards[3]}
        </button>
        <button id="a5" className="gameButton" onClick={click}>
          {cards[4]}
        </button>
        <button id="b1" className="gameButton" onClick={click}>
          {cards[5]}
        </button>
        <button id="b2" className="gameButton" onClick={click}>
          {cards[6]}
        </button>
        <button id="b3" className="gameButton" onClick={click}>
          {cards[7]}
        </button>
        <button id="b4" className="gameButton" onClick={click}>
          {cards[8]}
        </button>
        <button id="b5" className="gameButton" onClick={click}>
          {cards[9]}
        </button>
        <button id="c1" className="gameButton" onClick={click}>
          {cards[10]}
        </button>
        <button id="c2" className="gameButton" onClick={click}>
          {cards[11]}
        </button>
        <button id="c3" className="gameButton" onClick={click}>
          {cards[12]}
        </button>
        <button id="c4" className="gameButton" onClick={click}>
          {cards[13]}
        </button>
        <button id="c5" className="gameButton" onClick={click}>
          {cards[14]}
        </button>
        <button id="d1" className="gameButton" onClick={click}>
          {cards[15]}
        </button>
        <button id="d2" className="gameButton" onClick={click}>
          {cards[16]}
        </button>
        <button id="d3" className="gameButton" onClick={click}>
          {cards[17]}
        </button>
        <button id="d4" className="gameButton" onClick={click}>
          {cards[18]}
        </button>
        <button id="d5" className="gameButton" onClick={click}>
          {cards[19]}
        </button>
        <button id="e1" className="gameButton" onClick={click}>
          {cards[20]}
        </button>
        <button id="e2" className="gameButton" onClick={click}>
          {cards[21]}
        </button>
        <button id="e3" className="gameButton" onClick={click}>
          {cards[22]}
        </button>
        <button id="e4" className="gameButton" onClick={click}>
          {cards[23]}
        </button>
        <button id="e5" className="gameButton" onClick={click}>
          {cards[24]}
        </button>
      </div>
      <div>
        <button id="refresh" className="refresh" onClick={refresh}>
          refresh
        </button>
      </div>
    </div>
  );
}

export default Game;
