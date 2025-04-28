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
            <span className="text">fiverr</span>
            <span className="dot">.</span>
          </Link>
        </div>
        <div className="links">
          <span>Fiverr Buisness</span>
          <span>Explore</span>
          <span>English</span>
          {!currentUser && (
            <Link className="link" to="login">
              Sign in
            </Link>
          )}
            
          {!currentUser?.isSeller && <Link className="link" to="/register"><span>Become a Seller</span></Link>}
          {currentUser && (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser?.img || "./img/noavatar.png"} alt="" />
              <span>{currentUser?.username}</span>
              {open && (
                <div className="options">
                  {currentUser?.isSeller && (
                    <>
                      <Link className="link" to="mygigs">
                        Gigs
                      </Link>
                      <Link className="link" to="add">
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <Link className="link" to="orders">
                    Orders
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
              <span>Test 01</span>
              <span>Test 02</span>
            </div>
          </>
        ))}
    </div>
  );
};

export default Navbar;
