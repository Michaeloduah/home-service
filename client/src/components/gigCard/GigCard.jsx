import React from "react";
import { Link } from "react-router-dom";
import "./GigCard.scss";

const GigCard = ({ item }) => {
  return (
    <Link to={`/gig/${item._id}`} className="link" key={item.id}>
      <div className="gig-card">
        <img src={item.cover} alt="" />
        <div className="info">
          <div className="user">
            <img src={item.userId.img || "./img/noavatar.png"} alt="" />
            <span>{item.userId.username}</span>
          </div>
          <p>{item.shortDesc}</p>
          <div className="star">
            <img src="./img/star.png" alt="" />
            <span>{Math.round(item.toalStars / item.starNumber) || 0}</span>
          </div>
        </div>
        <hr />
        <div className="details">
          <img src="./img/heart.png" alt="" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>
              $ {item.price}
              <sup>99</sup>
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
