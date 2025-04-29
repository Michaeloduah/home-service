import React, { useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";

const Featured = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/gigis?search=${input}`);  
  };
  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the perfect <span>home service</span> professionals near you
          </h1>
          <div className="search">
            <div className="search-input">
              <img src="./img/search.png" alt="" />
              <input
                type="text"
                placeholder="Try plumbing repair"  // Updated placeholder
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button onClick={handleClick}>Search</button>
          </div>
          <div className="popular">
            <span>Popular:</span>
            <button>Plumbing</button>
            <button>Electrical</button>
            <button>Cleaning</button>
            <button>Lawn Care</button>
          </div>
        </div>
        <div className="right">
          <img src="./img/man.png" alt="" />  {/* Consider changing this image to a home service professional */}
        </div>
      </div>
    </div>
  );
};

export default Featured;