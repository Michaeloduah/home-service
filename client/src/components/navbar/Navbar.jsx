import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "./Navbar.scss";
import request from "../../utils/request.utils";

const Navbar = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  const handleLogout = async () => {
    await request.post("/auth/logout");
    localStorage.removeItem("currentUser");
    navigate("/");
  };
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">HomeServe</span>
            <span className="dot">.</span>
          </Link>
        </div>
        <div className="links">
          <span>HomeServe Premium</span>
          <span>Explore</span>
          <span>English</span>
          {!currentUser && (
            <Link className="link" to="login">
              Sign in
            </Link>
          )}
            
          {!currentUser?.isSeller && <Link className="link" to="/register"><span>Become a Provider</span></Link>}
          {currentUser && (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser?.img || "./img/noavatar.png"} alt="" />
              <span>{currentUser?.username}</span>
              {open && (
                <div className="options">
                  {currentUser?.isSeller && (
                    <>
                      <Link className="link" to="mygigs">
                        My Services
                      </Link>
                      <Link className="link" to="add">
                        Add New Service
                      </Link>
                    </>
                  )}
                  <Link className="link" to="orders">
                    Bookings
                  </Link>
                  <Link className="link" to="messages">
                    Messages
                  </Link>
                  <Link className="link" onClick={handleLogout}>
                    Logout
                  </Link>
                </div>
              )}
            </div>
          )}
          {!currentUser && (
            <Link className="link" to="/register">
              <button>Join</button>
            </Link>
          )}
        </div>
      </div>
      {active ||
        (pathname !== "/" && (
          <>
            <hr />
            <div className="menu">
              <Link className="link" to="/gigs?cat=plumbing">Plumbing</Link>
              <Link className="link" to="/gigs?cat=electrical">Electrical</Link>
              <Link className="link" to="/gigs?cat=cleaning">Cleaning</Link>
              <Link className="link" to="/gigs?cat=landscaping">Landscaping</Link>
              <Link className="link" to="/gigs?cat=handyman">Handyman</Link>
              <Link className="link" to="/gigs?cat=hvac">HVAC</Link>
            </div>
          </>
        ))}
    </div>
  );
};

export default Navbar;