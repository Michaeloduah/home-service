import React from "react";
import "./TrustedBy.scss";

const TrustedBy = () => {
  return (
    <div className="trusted-by">
      <div className="container">
        <span>Trusted By</span>
        <img
          src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/facebook2x.188a797.png"
          alt="Facebook"
        />
        <img
          src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/google2x.06d74c8.png"
          alt="Google"
        />
        {/* Consider replacing Netflix with a home insurance company logo */}
        <img
          src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/netflix2x.887e47e.png"
          alt="Netflix"
        />
        <img
          src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/pandg2x.6dc32e4.png"
          alt="P&G"
        />
        <img
          src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/paypal2x.22728be.png"
          alt="PayPal"
        />
      </div>
    </div>
  );
};

export default TrustedBy;