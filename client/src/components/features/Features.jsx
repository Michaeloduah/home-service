import React from "react";
import "./Footer.scss";

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="top">
          <div className="item">
            <h2>Categories</h2>
            <span>Plumbing</span>
            <span>Electrical</span>
            <span>Cleaning</span>
            <span>Landscaping</span>
            <span>Handyman</span>
            <span>HVAC</span>
            <span>Painting</span>
            <span>Moving</span>
          </div>
          <div className="item">
            <h2>About</h2>
            <span>Press & News</span>
            <span>Partnerships</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Intellectual Property Claims</span>
            <span>Investor Relations</span>
          </div>
          <div className="item">
            <h2>Support</h2>
            <span>Help & Support</span>
            <span>Trust & Safety</span>
            <span>Provider Success</span>
            <span>Service Guarantee</span>
            <span>Community Standards</span>
          </div>
          <div className="item">
            <h2>Community</h2>
            <span>Customer Stories</span>
            <span>Provider Spotlight</span>
            <span>Invite a Friend</span>
            <span>Become a Provider</span>
            <span>Community Forum</span>
            <span>Events</span>
            <span>Blog</span>
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <h2>HomeServe</h2>
            <span>© HomeServe International Ltd. 2023</span>
          </div>
          <div className="right">
            <div className="social">
              <img src="/img/twitter.png" alt="" />
              <img src="/img/facebook.png" alt="" />
              <img src="/img/linkedin.png" alt="" />
              <img src="/img/pinterest.png" alt="" />
              <img src="/img/instagram.png" alt="" />
            </div>
            <div className="link">
              <img src="/img/language.png" alt="" />
              <span>English</span>
            </div>
            <div className="link">
              <img src="/img/coin.png" alt="" />
              <span>USD</span>
            </div>
            <img src="/img/accessibility.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;