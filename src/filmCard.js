import React from "react";

import "./style.css";

const filmCard = props => {
  return (
    <div className="card">
      <img src={props.film.avatar} className="imageContainer" />
      <h2 className={`cardText cardText-h2`}>{props.film.title}</h2>
      <p className={`cardText cardText-p`}>{props.film.description}</p>
    </div>
  );
};

export default filmCard;
