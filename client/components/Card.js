import React, { useEffect } from "react";

const Card = (props) => {
  function clickingCard() {
    props.setOnClickCard(props.index);
  }

  return (
    <button
      className="gameButton"
      onClick={clickingCard}
      id={`card${props.index}`}
      style={props.cardsColor[props.index]}
    >
      {props.cards[props.index]}
    </button>
  );
};

export default Card;
