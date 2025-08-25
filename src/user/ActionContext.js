import { createContext } from "react";

export const ActionsContext = createContext(null);

export const ActionsProvider = ({ children, onDelete, sendBufferToServer }) => {
  return (
    <ActionsContext.Provider value={{ onDelete, sendBufferToServer }}>
      {children}
    </ActionsContext.Provider>
  );
};
