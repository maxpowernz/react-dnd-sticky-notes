import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Board from "./components/Board";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { AppStateProvider } from "./AppStateContext";

const url = new URL(window.location.href);
const touch = url.searchParams.get("touch");

const backend = touch !== null ? TouchBackend : HTML5Backend;

ReactDOM.render(
  <DndProvider backend={backend}>
    <AppStateProvider>
      <Board />
    </AppStateProvider>
  </DndProvider>,
  document.getElementById("root")
);
