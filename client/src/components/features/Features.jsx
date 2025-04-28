import React from "react";
import "./Features.scss";

const Features = () => {
  return (
    <>
      <div className="features">
        <div className="container">
          <div className="item">
            <h1>A whole world of freelance talent at your fingertip</h1>
            <div className="title">
              <img src="./img/check.png" />
              The best for every budget
            </div>
            <p>
              Find high-quality services at every price point. No hourly rates,
              just projcet-baesd pricing.
            </p>
            <div className="title">
              <img src="./img/check.png" />
              The best for every budget
            </div>
            <p>
              Find high-quality services at every price point. No hourly rates,
              just projcet-baesd pricing.
            </p>
            <div className="title">
              <img src="./img/check.png" />
              The best for every budget
            </div>
            <p>
              Find high-quality services at every price point. No hourly rates,
              just projcet-baesd pricing.
            </p>
            <div className="title">
              <img src="./img/check.png" />
              The best for every budget
            </div>
            <p>
              Find high-quality services at every price point. No hourly rates,
              just projcet-baesd pricing.
            </p>
          </div>
          <div className="item">
            <video
              src="https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/vmvv3czyk2ifedefkau7"
              controls
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
      <div className="features bg-blue">
        <div className="container">
          <div className="item">
            <h2>fiverr business.</h2>
            <h1>
              A solution built for <span className="italic">business</span>
            </h1>
            <p>
              Upgrade to a curated experience to access vetted talent and
              exclusive tools
            </p>
            <div className="title">
              <img src="./img/check.png" />
              Talent matching
            </div>
            <div className="title">
              <img src="./img/check.png" />
              Dedicated account management
            </div>
            <div className="title">
              <img src="./img/check.png" />
              Team collaboration tools
            </div>
            <div className="title">
              <img src="./img/check.png" />
              Business payment solutions
            </div>
            <div className="button-container">
              <button>Explore Fiverr Business</button>
            </div>
          </div>
          <div className="item">
            <img src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_870,dpr_1.0/v1/attachments/generic_asset/asset/d9c17ceebda44764b591a8074a898e63-1599597624757/business-desktop-870-x1.png" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;
