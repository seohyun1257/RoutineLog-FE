import "../../styles/RoutineInsert.css";
import { useState } from "react";
import { apibase } from "../../config";

const Insert = ({ onAdd, updateId }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newroutineName, setRoutineName] = useState("");
  const [tempId, setTempId] = useState(1);
  const [newLocation, setLocation] = useState("");

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault(); // form 기본 이벤트 막기
    if (!newroutineName) return;

    onAdd({
      id: tempId,
      title: newroutineName,
      location: newLocation,
    });

    setRoutineName("");
    setLocation("");
    setTempId(tempId + 1);
    closePopup();

    const token = localStorage.getItem("token");

    // fetch 요청
    fetch(`${apibase}/api/v1/routines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        title: newroutineName,
        location: newLocation,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("통신 실패");
        return res.json();
      })
      .then((data) => {
        const accessToken = data.accessToken;
        if (accessToken) localStorage.setItem("token", accessToken);
        const serverId = data.routineId.toString();
        console.log(serverId);
        updateId(tempId, serverId);
      })
      .catch((err) => {
        console.error(err);
        alert("루틴 추가 실패");
      });
  };

  return (
    <div>
      <button onClick={openPopup}>루틴 추가하기</button>

      {isPopupOpen && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>새 루틴 추가</h2>
            <form onSubmit={handleSubmit}>
              <p>루틴 이름</p>
              <input
                type="text"
                name="title"
                placeholder="루틴 이름 입력"
                value={newroutineName}
                onChange={(e) => setRoutineName(e.target.value)}
              />
              <p>루틴 위치</p>
              <input
                type="text"
                name="location"
                placeholder="루틴 위치 입력"
                value={newLocation}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button type="submit">추가</button>
            </form>
            <button onClick={closePopup}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insert;
