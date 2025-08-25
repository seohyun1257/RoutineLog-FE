import List from "./List";
import Insert from "./Insert";
import { ActionsProvider } from "../ActionContext";
import { useState, useEffect, useCallback } from "react";

const RoutineData = ({ selectedDate, lastPoint }) => {
  const [data, setData] = useState([]);

  const addRoutine = (newRoutine) => {
    setData((prevList) => [...prevList, newRoutine]);
  };

  const updateId = (tempId, serverId) => {
    setData((prev) =>
      prev.map((data) =>
        data.id === tempId ? { ...data, id: serverId } : data
      )
    );
  };

  const onDelete = useCallback((id) => {
    setData((prevData) => prevData.filter((routine) => routine.id !== id));
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 0~11 → 1~12
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const startDate = formatDate(new Date(selectedDate));

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_API}/api/v1/routines?date=${startDate}`,
          {
            // GET 요청
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Network response was not ok");
        const jsonData = await res.json(); // JSON 문자열 → JS 객체

        setData(jsonData); // 상태에 객체 저장
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [selectedDate]);

  return (
    <>
      <ActionsProvider onDelete={onDelete}>
        <Insert onAdd={addRoutine} updateId={updateId} />
        <List data={data} selectedDate={selectedDate} />
      </ActionsProvider>
    </>
  );
};

export default RoutineData;
