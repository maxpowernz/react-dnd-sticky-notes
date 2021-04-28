import React, { useCallback, useRef } from "react";
import { useDrop } from "react-dnd";
import Notes from "./Note";
import { v4 as uuidv4 } from "uuid";
import Bin from "./Bin";
import { useAppState } from "../AppStateContext";
import styled, { createGlobalStyle } from "styled-components";
import board from "../assets/img/board-opt.jpg";

const BodyStyle = createGlobalStyle`
    body {
      background-image: url(${board});
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
`;

const BoardWrapper = styled.div`
  width: 100vw;
  top: 0;
  left: 0;
  height: 100vh;
  margin: 0;
  position: relative;
  border: solid;
  border-image-slice: 1;
  border-width: 1.2rem;
  border-image-source: linear-gradient(to left, #c99016, #815a07);
`;

const AddButton = styled.button`
  width: 60px;
  height: 60px;
  position: absolute;
  left: 30px;
  font-size: 50px;
  bottom: 30px;
  border-radius: 50pc;
  border: 0;
  line-height: 50px;
  color: rgba(109, 171, 233, 0.66);
  background-color: rgb(49, 103, 157);
  box-shadow: 0px 0px 10px 0 rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.12);
  }
`;

function Board() {
  const [noteState, setNoteState] = useAppState();

  const boardRef = useRef(null);

  const moveNote = useCallback(
    (id, left, top, parentId, zIndex) => {
      const { notes } = noteState;

      const index = notes.findIndex((n) => n.id === id);

      setNoteState((draft) => {
        draft.notes[index].left = left;
        draft.notes[index].top = top;
        draft.notes[index].parentId = parentId;
        if (zIndex !== "auto") {
          draft.notes[index].zIndex = draft.currentZIndex + 1;
          draft.currentZIndex += 1;
        }
      });
    },
    [noteState, setNoteState]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "Note",
      drop: (item, monitor) => {
        const result = monitor.getDropResult();

        if (result) {
          if (result.noDrop) return;

          const { item } = result;
          const { note } = result;

          //if ids are the same just move the note to the current offset
          if (item.id === note.id) {
            moveNote(item.id, result.offset.x, result.offset.y, 0, noteState.currentZIndex);
            return undefined;
          } else if (item.groupId === note.groupId) {
            // dont let stuck notes group on themself
            return undefined;
          } else {
            moveNote(item.id, 10, 40, note.id, "auto");
          }
        }

        if (!monitor.getDifferenceFromInitialOffset()) return undefined;

        const sourceClientOffset = monitor.getSourceClientOffset();

        const left = Math.round(sourceClientOffset.x);
        const top = Math.round(sourceClientOffset.y);

        moveNote(item.id, left, top, 0, noteState.currentZIndex);
        return undefined;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [moveNote]
  );

  const addNewNote = (title) => {
    let id = uuidv4();

    const left = boardRef.current.offsetWidth / 2 - 125;
    const top = boardRef.current.offsetHeight / 2 - 200;

    setNoteState((draft) => {
      draft.notes.push({
        id,
        parentId: 0,
        top,
        left,
        title: title ? title : "untitled",
        color: "blue",
        zIndex: draft.currentZIndex,
      });
    });
  };

  const handleBoardClick = () => {
    setNoteState((draft) => {
      draft.showText = false;
      draft.showTitle = false;
    });
  };

  return (
    <>
      <BodyStyle />
      <div ref={drop}>
        <BoardWrapper ref={boardRef} onClick={handleBoardClick}>
          <Notes data={noteState.notes} />
          <Bin />
          <AddButton onClick={() => addNewNote("new note...")}>+</AddButton>
        </BoardWrapper>
      </div>
    </>
  );
}

export default Board;
