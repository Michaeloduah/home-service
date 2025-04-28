import React from "react";
import { Link } from "react-router-dom";
import "./CatCard.scss";

const CatCard = ({ item }) => {
  return (
    <Link to="gigs">
      <div className="cat-card">
        <img src={item.img} alt={item.title} />
        <span className="title">{item.title}</span>
        <span className="desc">{item.desc}</span>
      </div>
    </Link>
  );
};

export default CatCard;
