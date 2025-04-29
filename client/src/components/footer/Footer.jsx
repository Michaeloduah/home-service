import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="top">
          <div className="item">
            <h2>Categories</h2>
            <span>Plumbing</span>
            <span>Electrical</span>
            <span>HVAC</span>
            <span>Cleaning</span>
            <span>Landscaping</span>
            <span>Handyman</span>
            <span>Painting</span>
            <span>Roofing</span>
            <span>Moving</span>
            <span>Renovation</span>
            <span>Sitemap</span>
          </div>
          <div className="item">
            <h2>About</h2>
            <span>Press & News</span>
            <span>Partnerships</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Intellectual Property Claims</span>
            <span>Investor Relations</span>
            <span>Contact Sales</span>
          </div>
          <div className="item">
            <h2>Support</h2>
            <span>Help & Support</span>
            <span>Trust & Safety</span>
            <span>Becoming a Provider</span>
            <span>Hiring Service Providers</span>
          </div>
          <div className="item">
            <h2>Community</h2>
            <span>Customer Success Stories</span>
            <span>Community hub</span>
            <span>Forum</span>
            <span>Events</span>
            <span>Blog</span>
            <span>Partner Professionals</span>
            <span>Affiliates</span>
            <span>Podcast</span>
            <span>Invite a Friend</span>
            <span>Become a Provider</span>
            <span>Community Standards</span>
          </div>
          <div className="item">
            <h2>More From HomeServe</h2>
            <span>HomeServe Premium</span>
            <span>HomeServe Pro</span>
            <span>HomeServe Emergency</span>
            <span>HomeServe Guides</span>
            <span>Home Improvement Tips</span>
            <span>HomeServe Select</span>
            <span>HomeServe Insurance</span>
            <span>HomeServe Workspace</span>
            <span>DIY Learning</span>
            <span>Seasonal Maintenance</span>
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
};

export default Footer;