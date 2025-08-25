import "../../styles/RoutineInsertStyle.css";
import { useState } from "react";
import Map from "./Map";

const Insert = ({ onAdd, updateId }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newroutineName, setRoutineName] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempId, setTempId] = useState(1);
  const [newLocation, setLocation] = useState(""); //text로 입력받는 위치이름
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dayofWeek, setDayofWeek] = useState([]);
  const [currentLoc, setCurrentLoc] = useState({
    latitude: null,
    longitude: null,
  });

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    // window.location.reload();
  };

  const dayMap = {
    월: "MONDAY",
    화: "TUESDAY",
    수: "WEDNESDAY",
    목: "THURSDAY",
    금: "FRIDAY",
    토: "SATURDAY",
    일: "SUNDAY",
  };

  const addDay = (dayKr) => {
    const dayEn = dayMap[dayKr];
    setDayofWeek(
      (prevDay) =>
        prevDay.includes(dayEn)
          ? prevDay.filter((d) => d !== dayEn) // 이미 있으면 제거
          : [...prevDay, dayEn] // 없으면 추가
    );
  };

  const handleChildReady = (data) => {
    console.log("자식이 전달한 값:", data);
    const { lat: latitude, lng: longitude } = data; // 구조 분해
    setCurrentLoc({ latitude, longitude });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newroutineName) {
      alert("루틴 이름을 입력해주세요.");
      return; // submit 중단
    }

    if (!newLocation) {
      alert("루틴 위치명을 입력해주세요.");
      return; // submit 중단
    }
    if (!startTime) {
      alert("루틴체크를 시작할 시간을 입력해주세요.");
      return; // submit 중단
    }
    if (!endTime) {
      alert("루틴 체크를 종료할 시간을 입력해주세요.");
      return; // submit 중단
    }

    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (endMinutes - startMinutes > 10) {
      alert("루틴 시간 차이가 10분 이상입니다.");
      return; // submit 중단
    }

    if (dayofWeek.length === 0) {
      alert("요일을 선택해주세요.");
      return; // submit 중단
    }

    onAdd({
      id: tempId,
      title: newroutineName,
      location: newLocation,

      latitude: currentLoc.latitude,
      longitude: currentLoc.longitude,

      startTime: startTime,
      endTime: endTime,

      dayofWeekSet: dayofWeek,
    });

    setRoutineName("");
    setLocation("");
    setTempId((prev) => prev + 1);
    closePopup();

    const token = localStorage.getItem("token");
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const startDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}`;
    // fetch 요청
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_API}/api/v1/routines?startDate=${startDate}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            title: newroutineName,
            location: newLocation,

            latitude: currentLoc.latitude,
            longitude: currentLoc.longitude,

            startTime: startTime,
            endTime: endTime,

            dayofWeekSet: dayofWeek,
          }),
        }
      );

      if (!res.ok) throw new Error("통신 실패");

      const data = await res.json();
      const accessToken = data.accessToken;
      if (accessToken) localStorage.setItem("token", accessToken);
      const serverId = data.routineId.toString();
      console.log(serverId);
      updateId(tempId, serverId);
    } catch (err) {
      console.error(err);
      alert("루틴 추가 실패");
    }
  };

  return (
    <div>
      <button onClick={openPopup} className="add-routine-btn">
        루틴 추가하기
      </button>

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
              <p style={{ color: "grey" }}>
                * 초기 루틴 위치는 서울시청으로 설정됩니다. <br />
                원을 드래그하여 범위를 설정하시면 해당 위치로 루틴위치가
                설정됩니다.
              </p>
              <Map onReady={handleChildReady} />
              <p style={{ color: "red" }}>
                😀 루틴 체크 가능 시간의 범위는 최대 10분 입니다.
              </p>
              <p>루틴 시작 시간</p>
              <input
                type="time"
                name="time"
                placeholder="루틴 시간 입력"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <p>루틴 종료 시간</p>
              <input
                type="time"
                name="time"
                placeholder="루틴 종료 입력"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <div className="flex gap-2">
                {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                  <button
                    key={day}
                    style={{
                      backgroundColor: dayofWeek.includes(dayMap[day]) ? '#2E8B57' : '#f0f0f0',
                      color: dayofWeek.includes(dayMap[day]) ? 'white' : 'black',
                      flexGrow: 1,
                      border: '1px solid #2E8B57'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      addDay(day);
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <button type="submit">추가</button>
            </form>
            <button onClick={closePopup} className="close-btn">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insert;
