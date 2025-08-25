import { createContext } from "react";

export const Current = createContext({
  latitude: 0,
  longitude: 0,
  currentTime: "",
  currentDate: "",
});
