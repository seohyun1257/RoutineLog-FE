import List from "./List";
import Insert from "./Insert";
import { useState, useEffect, useCallback } from "react";
import { apibase } from "../../config";

const RoutineData = () => {
  const [data, setData] = useState([
    {
      id: 1,
      title: "운동",
      location: "헬스장",
    },
    {
      id: 2,
      title: "독서",
      location: "정석학술정보관",
    },
  ]);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${apibase}/api/v1/routines`, {
      // GET 요청
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json(); // JSON 문자열 → JS 객체
      })
      .then((jsonData) => {
        console.log(jsonData);
        setData(jsonData); // 상태에 객체 저장
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Insert onAdd={addRoutine} updateId={updateId} />
      <List RoutineData={data} onDelete={onDelete} />
    </>
  );
};

export default RoutineData;
