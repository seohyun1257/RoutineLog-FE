import React from "react";
import { useState } from "react";
import RoutineData from "./RoutineData";

const days = ["일", "월", "화", "수", "목", "금", "토"];

const DayofWeek = ({ lastPoint }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  // -3 ~ +3일 범위 날짜 생성
  const dates = [];
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  // 선택된 날짜의 요일 찾기
  const selectedDay = days[selectedDate.getDay()];

  // 선택된 요일에 맞는 루틴만 필터링

  return (
    <>
      <div style={{ padding: "20px", textAlign: "center" }}>
        {/* 날짜 선택 UI */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          {dates.map((date, idx) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected =
              date.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedDate(date);
                }}
                style={{
                  padding: "10px",
                  border: isSelected ? "2px solid #2E8B57" : "1px solid #ccc",
                  borderRadius: "8px",
                  textAlign: "center",
                  width: "60px",
                  cursor: "pointer",
                  background: isToday ? "#e6f4ea" : "white",
                }}
              >
                <div style={{ fontSize: "14px", color: "#555" }}>
                  {days[date.getDay()]}
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* 루틴 표시 */}
        <p>
          {selectedDate.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h3>{selectedDay}요일 루틴</h3>
        {/* {filteredRoutines.length > 0 ? (
        <ul>
          {filteredRoutines.map((routine) => (
            <li key={routine.id}>{routine.title}</li>
          ))}
        </ul>
      ) : (
        <p>등록된 루틴이 없습니다.</p>
      )} */}
      </div>
      <RoutineData selectedDate={selectedDate} lastPoint={lastPoint} />
    </>
  );
};

export default DayofWeek;
