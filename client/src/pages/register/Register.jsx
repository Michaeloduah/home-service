import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import upload from "../../utils/upload.utils";
import request from "../../utils/request.utils";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = React.useState({
    username: "",
    email: "",
    img: "",
    password: "",
    country: "",
    phone: "",
    desc: "",
    isSeller: false,
  });
  const [file, setFile] = React.useState(null);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSeller = () => {
    setUser({ ...user, isSeller: !user.isSeller });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = await upload(file);
    const newUser = { ...user, img: url };
    await request.post("/auth/register", newUser);
    setLoading(false);
    navigate("/login");
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label htmlFor="">Username</label>
          <input
            name="username"
            type="text"
            placeholder="johndoe"
            onChange={handleChange}
          />
          <label htmlFor="">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />
          <label htmlFor="">Password</label>
          <input name="password" type="password" onChange={handleChange} />
          <label htmlFor="">Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="">Country</label>
          <input
            name="country"
            type="text"
            placeholder="Usa"
            onChange={handleChange}
          />
          <button disabled={loading ? true : false} type="submit">
            {loading ? "Registering..." : "Register"}
          </button>
          <div>
            <span>Already have an account?</span>
            <Link
              style={{
                marginLeft: "5px",
                textDecoration: "underline",
                color: "blue",
              }}
              className="link"
              to="/login"
            >
              Login
            </Link>
          </div>
        </div>
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label htmlFor="">Activate the seller account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="+1 234 567 89"
            onChange={handleChange}
          />
          <label htmlFor="">Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default Register;
