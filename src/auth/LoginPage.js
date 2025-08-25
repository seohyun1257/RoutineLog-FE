import React from "react";
import "../styles/LoginPageStyle.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const Login = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_SERVER_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // content type은 json이다.
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("통신 실패");
        return res.json();
      })
      .then((data) => {
        const accessToken = data.accessToken;
        if (accessToken) {
          localStorage.setItem("token", accessToken);
        }

        console.log("로그인 성공:", data);
        navigate("/main");
      })
      .catch((err) => {
        console.error(err);
        alert("로그인에 실패했습니다.");
      });
  };
  return (
    <div className="container">
      <div className="login">
        <h2>[ RoutineLog ]</h2>
        <form onSubmit={Login}>
          <label htmlFor="login-id">아이디</label>
          <div className="input-group">
            <input
              type="text"
              id="username"
              name="username"
              className="text_input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <label htmlFor="login-password">비밀번호</label>
          <div className="input-group">
            <input
              type="password"
              id="password"
              name="password"
              className="text_input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <input type="submit" value="LOGIN" className="btn" placeholder="" />
        </form>
        <div className="toggle-link">
          <a className="link" href="/signup">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
