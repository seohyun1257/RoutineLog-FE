import ListItem from "./ListItem";
import DayofWeek from "./DayofWeek";

const List = ({ data, selectedDate }) => {
  if (!data || data.length === 0) {
    return null;
  }
  return (
    <div className="routine-container">
      {data.map(
        (item) =>
          item && (
            <ListItem
              key={String(item.id)}
              RoutineData={item}
              selectedDate={selectedDate}
            />
          )
      )}
    </div>
  );
};

export default List;
