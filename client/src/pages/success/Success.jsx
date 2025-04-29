import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../register/Register.scss";
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
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    desc: "",
    isSeller: false,
    certifications: "",
    insurance: false,
    serviceArea: "",
  });
  const [file, setFile] = React.useState(null);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = file ? await upload(file) : "";
      const newUser = { ...user, img: url };
      await request.post("/auth/register", newUser);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      alert("Registration failed: " + (error.response?.data?.error || "Unknown error"));
    }
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
            required
          />
          <label htmlFor="">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email@example.com"
            onChange={handleChange}
            required
          />
          <label htmlFor="">Password</label>
          <input 
            name="password" 
            type="password" 
            onChange={handleChange}
            required 
          />
          <label htmlFor="">Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          
          <div className="address-fields">
            <label htmlFor="">Address</label>
            <input
              name="address"
              type="text"
              placeholder="123 Main St"
              onChange={handleChange}
            />
            
            <div className="address-row">
              <div className="field-group">
                <label htmlFor="">City</label>
                <input
                  name="city"
                  type="text"
                  placeholder="City"
                  onChange={handleChange}
                />
              </div>
              <div className="field-group">
                <label htmlFor="">State</label>
                <input
                  name="state"
                  type="text"
                  placeholder="State"
                  onChange={handleChange}
                />
              </div>
              <div className="field-group">
                <label htmlFor="">ZIP</label>
                <input
                  name="zip"
                  type="text"
                  placeholder="ZIP Code"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <label htmlFor="">Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="(123) 456-7890"
            onChange={handleChange}
            required
          />
          
          <button disabled={loading} type="submit">
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
          <h1>I want to become a Service Provider</h1>
          <div className="toggle">
            <label htmlFor="">Register as a Service Provider</label>
            <label className="switch">
              <input 
                type="checkbox" 
                name="isSeller"
                onChange={handleCheckboxChange} 
              />
              <span className="slider round"></span>
            </label>
          </div>
          
          {user.isSeller && (
            <>
              <label htmlFor="">Service Area</label>
              <input
                name="serviceArea"
                type="text"
                placeholder="e.g. 25 mile radius of Chicago"
                onChange={handleChange}
              />
              
              <label htmlFor="">Certifications/Qualifications</label>
              <input
                name="certifications"
                type="text"
                placeholder="e.g. Licensed Plumber, Certified Electrician"
                onChange={handleChange}
              />
              
              <div className="insurance-checkbox">
                <input 
                  type="checkbox" 
                  id="insurance" 
                  name="insurance"
                  onChange={handleCheckboxChange} 
                />
                <label htmlFor="insurance">I have business insurance/bonding</label>
              </div>
              
              <label htmlFor="">About Your Services</label>
              <textarea
                placeholder="Describe your services, experience, and why customers should choose you"
                name="desc"
                id=""
                cols="30"
                rows="8"
                onChange={handleChange}
              ></textarea>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Register;