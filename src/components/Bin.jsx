import React from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import { useAppState } from "../AppStateContext";

const RubbishBin = styled.div`
  width: 50px;
  height: 50px;
  font-size: 60px;
  bottom: 60px;
  right: 60px;
  position: absolute;
  transition: all 0.2s ease-in-out;
  ${(props) => !props.isOver} {
    transform: scale(1.2);
  }
`;

const findChildren = (nodes, parentId, children = []) => {
  nodes.forEach((node) => {
    if (node.parentId === parentId) {
      children.push(node.id);
      findChildren(nodes, node.id, children);
    }
  });

  return children;
};

function Bin() {
  const [noteState, setNoteState] = useAppState();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "Note",
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
      drop: (item, monitor) => {
        deleteNote(item.id);
        return {
          noDrop: true,
        };
      },
    }),
    [noteState.notes]
  );

  const deleteNote = (id) => {
    const removeItemIds = findChildren(noteState.notes, id);
    removeItemIds.push(id);

    setNoteState((draft) => {
      draft.notes = draft.notes.filter((note) => removeItemIds.indexOf(note.id) < 0);
    });
  };

  return (
    <>
      <RubbishBin ref={drop} isOver={isOver}>
        🗑️
      </RubbishBin>
    </>
  );
}

export default Bin;
