import React, { createContext, useContext, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import initialState from "./data/nestedTreeData.json";

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [state, setState] = useImmer(initialState);

  const store = useMemo(() => [state, setState], [state, setState]);

  return <AppStateContext.Provider value={store}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => useContext(AppStateContext);
