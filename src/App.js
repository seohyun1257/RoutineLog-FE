import { Routes, Route } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import { useState, useEffect } from "react";
import SignupPage from "./auth/SignupPage";
import Main from "./user/Main";
import { apibase } from "./config";
// import "./App.css";

function App() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch(`${apibase}/api/message`, {
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

  return (
    <div>
      <p>{message ? message : "loading..."}</p>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;
