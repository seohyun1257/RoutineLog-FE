import React from "react";
import "../styles/loginsign.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apibase } from "../config";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const Signup = (e) => {
    e.preventDefault();

    fetch(`${apibase}/auth/signup`, {
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
        return res.text(); // 일단 text로 받기
      })
      .then((text) => {
        console.log("응답 본문:", text);
        return text ? JSON.parse(text) : null; // 내용 있으면 JSON 파싱
      })
      .then((data) => {
        console.log("회원가입 성공:", data);
        alert("회원가입 완료!");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        alert("회원가입에 실패했습니다.");
      });
  };

  return (
    <div className="container">
      <div className="login">
        <h2>회원가입</h2>
        <form onSubmit={Signup}>
          <label htmlFor="login-id">아이디</label>
          <div className="input-group">
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              className="text_input"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <label htmlFor="login-password">비밀번호</label>
          <div className="input-group">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              className="text_input"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <label htmlFor="login-password">비밀번호 확인</label>
          <div className="input-group">
            <input
              type="re-password"
              id="re-password"
              name="re-password"
              className="text_input"
            />
          </div>
          <input type="submit" value="Sign Up" className="btn" />
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
