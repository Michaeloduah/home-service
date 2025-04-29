import React from "react";
import { Slider } from "infinite-react-carousel";
import "./Slide.scss";

const Slide = ({ children, slidesToShow, arrowsScroll, title }) => {
  return (
    <div className="slide">
      <div className="container">
        {title && <h2 className="slide-title">{title}</h2>}
        <Slider slidesToShow={slidesToShow} arrowsScroll={arrowsScroll}>
          {children}
        </Slider>
      </div>
    </div>
  );
};

export default Slide;