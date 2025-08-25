import { useState, useEffect } from "react";
import DayofWeek from "./DayofWeek";
import { Current } from "../PointContext";

const CurrentLocation = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [buffer, setBuffer] = useState([]);
  const [lastPoint, setLastPoint] = useState(null);

  function getLocation() {
    if (!navigator.geolocation) {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        //현재 위도 경도값 받아서 상태 업데이트
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        //현재 날짜 받기
        const now = new Date();
        //자릿수 맞춰주기
        const pad = (n) => String(n).padStart(2, "0");

        const newPoint = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          currentTime: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
            now.getSeconds()
          )}`,
          currentDate: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
            now.getDate()
          )}`,
        };
        // 현재 위치를 buffer에 추가
        setBuffer((prevBuffer) => [...prevBuffer, newPoint]);
        setLastPoint(newPoint);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          alert("사용자가 위치 권한을 거부했습니다");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          alert("위치 정보를 가져올 수 없습니다.");
          console.log("위치 정보를 사용할 수 없습니다 ");
        } else if (err.code === err.TIMEOUT) {
          alert("위치 정보를 가져올 수 없습니다.");
          console.log("위치 요청이 시간 초과되었습니다 ⏰");
        }
      }
    );
  }

  useEffect(() => {
    // 초기 위치 한 번 가져오기
    getLocation();
    // 컴포넌트 마운트 (페이지 접속) 후 15초마다 위치 가져오기 시작
    const getnewLocation = setInterval(getLocation, 5000);
    // cleanup function으로 언마운트 시 함수 종료
    return () => clearInterval(getnewLocation);
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      console.log("위도:", latitude, "경도:", longitude);
    }
  }, [latitude, longitude]);

  //버퍼 로직 구현 (1.버퍼 길이 3이면 가장 오래된 위치 제거,
  // 2. onClick시 버퍼데이터 서버 전송)

  useEffect(() => {
    if (buffer.length > 3) {
      setBuffer((prev) => prev.slice(1));
    }
  }, [buffer]);
  // 버퍼 데이터를 서버로 전송

  const sendBufferToServer = async () => {
    const token = localStorage.getItem("token");
    const bufferData = buffer.map((point) => ({
      latitude: point.latitude,
      longitude: point.longitude,
      currentTime: point.currentTime,
      currentDate: point.currentDate,
    }));
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_API}/api/v1/current`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(bufferData),
        }
      );
      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }
      console.log("버퍼 데이터를 서버로 전송했습니다");
    } catch (error) {
      console.error("서버 전송 오류:", error);
    }
  };

  return (
    <>
      <Current.Provider
        value={
          lastPoint || {
            latitude: 0,
            longitude: 0,
            currentTime: "",
            currentDate: "",
          }
        }
      >
        <DayofWeek CurrentLoc={lastPoint} />
      </Current.Provider>
    </>
  );
};

export default CurrentLocation;
