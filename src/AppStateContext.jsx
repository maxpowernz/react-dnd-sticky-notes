import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useImmer } from "use-immer";
import initialState from "./data/nestedTreeData.json";

const AppStateContext = createContext();

if (localStorage.getItem("notes")) {
  initialState.notes = JSON.parse(localStorage.getItem("notes"));
} else {
  localStorage.setItem("notes", JSON.stringify(initialState.notes));
}

export const AppStateProvider = ({ children }) => {
  const [state, setState] = useImmer(initialState);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(state.notes));
  }, [state.notes]);

  const store = useMemo(() => [state, setState], [state, setState]);

  return <AppStateContext.Provider value={store}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => useContext(AppStateContext);
