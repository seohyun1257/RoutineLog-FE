import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import { useState, useEffect } from "react";
import SignupPage from "./auth/SignupPage";
import Main from "./user/Main";

function App() {
  const [message, setMessage] = useState(null);
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  function isTokenExpired(token) {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // JWT payload 디코딩
      const exp = payload.exp; // 초 단위 Unix timestamp
      const now = Math.floor(Date.now() / 1000); // 현재 시간 초 단위
      return now >= exp;
    } catch (err) {
      return true; // 디코딩 실패 → 만료 처리
    }
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_API}/api/message`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setMessage(result.message);
      })
      .catch((error) => console.error("에러발생", error));
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);

      if (now >= exp) {
        sessionStorage.removeItem("token"); // 만료된 토큰 삭제
        alert("세션 만료로 로그아웃 됩니다.");
        navigate("/", { replace: true }); // 로그인 페이지로 이동
      }
    }
  }, [navigate]);

  return (
    <div>
      <p>{message ? message : "loading..."}</p>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/main"
          element={
            localStorage.getItem("token") ? (
              <Main replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
