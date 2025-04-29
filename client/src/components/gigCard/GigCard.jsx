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
            {item.userId.verified && <span className="verified-badge">✓</span>}
          </div>
          <p>{item.shortDesc}</p>
          <div className="star">
            <img src="./img/star.png" alt="" />
            <span>{Math.round(item.toalStars / item.starNumber) || 0}</span>
          </div>
        </div>
        <hr />
        <div className="details">
          <div className="price">
            <span>STARTING AT</span>
            <h2>
              $ {item.price}
              {item.hourlyRate && <span className="rate-type">/hr</span>}
            </h2>
          </div>
          <div className="availability">
            {item.hasUrgent && <span className="urgent">Available Today</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;