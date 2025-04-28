import React from "react";
import "./Review.scss";

const Review = ({ review }) => {
  return (
    <div className="review">
      <div className="user">
        <img
          className="pp"
          src={review.user.img || "/img/noavatar.png"}
          alt=""
        />
        <div className="info">
          <span>{review.user.username}</span>
          <div className="country">
            <span>{review.user.country}</span>
          </div>
        </div>
      </div>
      <div className="stars">
        {Array(review.star)
          .fill()
          .map((s, id) => (
            <img src="/img/star.png" alt="" key={id} />
          ))}
        <span>{review.star}</span>
      </div>
      <p>{review.desc}</p>
      <div className="helpful">
        <span>Helpful?</span>
        <img src="/img/like.png" alt="" />
        <span>Yes</span>
        <img src="/img/dislike.png" alt="" />
        <span>No</span>
      </div>
      <hr />
    </div>
  );
};

export default Review;
