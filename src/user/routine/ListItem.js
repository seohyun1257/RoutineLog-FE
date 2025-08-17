import { useState } from "react";
import "../../styles/RoutineListItem.css";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import cn from "classnames";
import { apibase } from "../../config";
import { CurrentLocation } from "react-icons/bi";

const ListItem = ({ RoutineData, onDelete }) => {
  const { title, location } = RoutineData;
  const [checked, setChecked] = useState(RoutineData?.checked || false);
  const token = localStorage.getItem("token");

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    // 서버에 DELETE 요청
    fetch(`${apibase}/api/v1/routines`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        routineId: Number(id),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("통신 실패");
        if (res.status === 204) return null;
        return res.json(); // 서버가 JSON 반환 시
      })
      .then(() => {
        // 화면에서 해당 id 제거
        onDelete(id);
      })
      .catch((err) => {
        console.error(err);
        alert("삭제 실패");
      });
  };

  return (
    <div>
      <div className={cn("routineBox", { checked, unChecked: !checked })}>
        <div
          className="checkBox"
          onClick={() => {
            if (checked) {
              setChecked(false);
            } else {
              setChecked(true);
            }
          }}
        >
          {checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
        </div>
        <h4>{title}</h4>
        <div className="Location">루틴 체크 위치 : {location}</div>
        <button className="remove" onClick={() => handleDelete(RoutineData.id)}>
          X
        </button>
      </div>
    </div>
  );
};

export default ListItem;
