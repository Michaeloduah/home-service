import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.scss";
import request from "../../utils/request.utils";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await request.post("/auth/login", { username, password });

      localStorage.setItem("currentUser", JSON.stringify(res.data.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div className="login">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h1>Sign in</h1>
          <label htmlFor="">Username</label>
          <input
            name="username"
            type="text"
            placeholder="johndoe"
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="">Password</label>
          <input
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          {error && error}
        </form>
        <div className="signup">
          <span>New to Fiverr?</span>
          <Link
            style={{
              marginLeft: "5px",
              textDecoration: "underline",
              color: "blue",
            }}
            className="link"
            to="/register"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
