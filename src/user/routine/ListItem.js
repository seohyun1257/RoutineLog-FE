import { useState, useContext } from "react";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import cn from "classnames";
import { ActionsContext } from "../ActionContext";
import { Current } from "../PointContext";
import "../../styles/ListItemStyle.css";

const ListItem = ({ RoutineData, selectedDate }) => {
  const { title, location, startTime, endTime } = RoutineData;
  const [checked, setChecked] = useState(RoutineData?.checked || false);
  const { onDelete, sendBufferToServer } = useContext(ActionsContext);
  const { latitude, longitude, currentTime, currentDate } = useContext(Current);

  const withoutSstartTime = startTime.slice(0, 5);
  const withoutSendTime = endTime.slice(0, 5);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 0~11 → 1~12
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const now = new Date();
    const date = formatDate(now);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_API}/api/v1/routines?routineId=${id}&effectiveDate=${date}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("통신 실패");
      if (res.status !== 204) {
        await res.json(); // 서버가 JSON 반환 시
      }

      // 화면에서 해당 id 제거
      onDelete(id);
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  const handlCheck = async (routineId) => {
    const token = localStorage.getItem("token");
    const withoutSeconds = currentTime.slice(0, 5);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_API}/api/v1/currentFilter/${routineId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            currentTime: withoutSeconds,
            currentDate: currentDate,
          }),
        }
      );

      if (!res.ok) throw new Error("통신 실패");

      setChecked(true); //성공이라면 checked를 true로 변경
    } catch (err) {
      console.error(err);
      alert("루틴을 체크할 수 없습니다.");
      console.log(latitude, longitude, currentTime, currentDate);
    }
  };

  if (!RoutineData || RoutineData.length === 0) {
    return null;
  }
  return (
    <div>
      <div className={cn("routineBox", { checked, unChecked: !checked })}>
        <div
          className="checkBox"
          onClick={() => {
            const selecDate = formatDate(new Date(selectedDate));
            console.log(selecDate);
            if (!checked) {
              if (selecDate === currentDate) handlCheck(RoutineData.id);
              else alert("오늘의 루틴만 체크할 수 있습니다");
            } else {
              alert("이미 체크한 루틴은 취소할 수 없습니다");
            }
          }}
        >
          {checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
        </div>
        <div className="title-location-wrapper">
          <h4>{title}</h4>
          <div className="Location">루틴 체크 위치 : {location}</div>
        </div>
        <div>
          루틴 체크 시간 {withoutSstartTime} ~ {withoutSendTime}
        </div>
        <button
          className="remove"
          onClick={() => {
            handleDelete(RoutineData.id);
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ListItem;
