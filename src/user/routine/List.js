import ListItem from "./ListItem";
import { useState } from "react";

const List = ({ RoutineData, onDelete }) => {
  if (
    RoutineData.length === 0 ||
    Object.keys(RoutineData[0]).length === 0 ||
    !RoutineData
  )
    return null;
  return (
    <>
      <div>
        {RoutineData.map((RoutineData) => (
          <ListItem
            key={String(RoutineData.id)}
            RoutineData={RoutineData}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

export default List;
