import React, { memo, useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useAppState } from "../AppStateContext";
import styled from "styled-components";

const NoteWrapper = styled.div`
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  ${(props) => props.color && `background: ${props.color}`};
  z-index: ${(props) => props.zIndex};
  cursor: grab;
  height: 350px;
  width: 300px;
  position: absolute;

  box-shadow: 0px 5px 10px 0 rgba(0, 0, 0, 0.7);
`;

const NoteText = styled.div`
  overflow: hidden;
  height: 85%;
  filter: brightness(${(props) => (props.isOver ? "95%" : "100%")});
  z-index: 1000;
  background-color: ${(props) => props.color};
  font-family: "Caveat", cursive;
  font-size: 1.5rem;
  white-space: pre-line;
  border-bottom: 18px solid transparent;
  border-right: 0.5rem solid transparent;
  ${(props) => (props.showText ? `padding: 0; ` : `padding: 0.5rem`)}
`;

const NoteTextArea = styled.textarea`
  width: 100%;
  border: none;
  background: none;
  height: 100%;
  outline: none;
  font-family: sans-serif;
  font-size: 1rem;
  padding: 0.5rem;
`;

const ColorSelectorWrapper = styled.div`
  position: absolute;
  height: 18px;
  width: 72px;
  bottom: 0;
  right: 0;
  display: flex;
`;

const ColorSelector = styled.div`
  background: ${(props) => props.background};
  flex-grow: 1;
`;

const Title = styled.div`
  height: 15%;
  //width: 100%;
  overflow: hidden;
  font-family: "Caveat", cursive;
  white-space: nowrap;
  font-weight: 600;
  font-size: 1.5rem;
  padding: 0.5rem;
  margin-right: 5px;
  text-overflow: ellipsis;
`;

const TitleTextArea = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  outline: none;
  font-size: 1rem;
`;

const colors = {
  blue: `rgb(128, 216, 241)`,
  yellow: `rgb(255, 235, 120)`,
  purple: "rgb(253, 150, 177)",
  green: "rgb(164, 234, 135)",
};

function Note({ children, note, parent }) {
  const { top, left, id, title, groupId, parentId, zIndex, i } = note;

  //const [hoverGroupId, setHoverGroupId] = useState(-1);
  const [noteState, setNoteState] = useAppState();

  const noteTextRef = useRef(null);
  const noteTitleRef = useRef(null);

  useEffect(() => {
    if (noteTextRef.current) {
      noteTextRef.current.focus();
      noteTextRef.current.setSelectionRange(
        noteTextRef.current.innerHTML.length,
        noteTextRef.current.innerHTML.length
      );
    }

    if (noteTitleRef.current) {
      noteTitleRef.current.focus();
      noteTitleRef.current.setSelectionRange(
        noteTitleRef.current.value.length,
        noteTitleRef.current.value.length
      );
    }
  }, [noteState.showText, noteState.showTitle]);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "Note",
      collect: (monitor) => ({
        isDragging: monitor.isDragging(monitor),
        offset: monitor.getClientOffset(monitor),
      }),
      item: {
        id,
        title,
        left,
        top,
        groupId,
        parentId,
        zIndex,
      },
    }),
    [id, title, top, left, groupId, title, zIndex]
  );

  const [, titleDrop] = useDrop(
    () => ({
      accept: "Note",
      canDrop: false,
      drop: (item, monitor) => {
        console.log(item);
        console.log(i);
        if (item.parentId === 0) {
          return { note, item, offset: monitor.getSourceClientOffset() };
        }

        return {
          noDrop: true,
        };
      },
    }),
    []
  );

  const [{ isOver }, noteDrop] = useDrop(() => ({
    accept: "Note",
    drop: (item, monitor) => {
      return {
        offset: monitor.getSourceClientOffset(),
        note,
        item,
      };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    // hover: (item, monitor) => {
    //   setHoverGroupId(item.groupId);
    // },
  }));

  const handleTitleClick = (e) => {
    setNoteState((draft) => {
      draft.showTitle = true;
      draft.showText = false;
      draft.showTextId = id;
    });

    e.stopPropagation();
  };

  const handleTextClick = (e) => {
    setNoteState((draft) => {
      draft.showText = true;
      draft.showTitle = false;
      draft.showTextId = id;
    });

    e.stopPropagation();
  };

  const handleTextChange = ({ target }, type) => {
    const index = noteState.notes.findIndex((n) => n.id === id);

    setNoteState((draft) => {
      draft.notes[index][type] = target.value;
    });
  };

  const handleColorClick = (color) => {
    const index = noteState.notes.findIndex((n) => n.id === id);

    setNoteState((draft) => {
      draft.notes[index].color = color;
    });
  };

  return (
    <>
      <NoteWrapper
        top={top + "px"}
        left={left + "px"}
        parent={parent}
        isDragging={isDragging}
        zIndex={note.zIndex}
        color={colors[note.color]}
        ref={noteState.showText ? null : drag}
        className={parent ? "parent" : "child"}>
        <Title ref={titleDrop} onClick={(e) => handleTitleClick(e)}>
          {noteState.showTitle && id === noteState.showTextId ? (
            <TitleTextArea
              onChange={(e) => handleTextChange(e, "title")}
              value={note.title}
              ref={noteTitleRef}
            />
          ) : (
            note.title
          )}
        </Title>
        <NoteText
          ref={noteDrop}
          color={colors[note.color]}
          isOver={isOver}
          className="code"
          onClick={(e) => handleTextClick(e)}
          showText={noteState.showText && id === noteState.showTextId}>
          {noteState.showText && id === noteState.showTextId ? (
            <NoteTextArea
              onChange={(e) => handleTextChange(e, "text")}
              value={note.text}
              ref={noteTextRef}
            />
          ) : (
            note.text
          )}
        </NoteText>
        <ColorSelectorWrapper>
          <ColorSelector
            onClick={() => handleColorClick("green")}
            background={colors["green"]}></ColorSelector>
          <ColorSelector
            onClick={() => handleColorClick("blue")}
            background={colors["blue"]}></ColorSelector>
          <ColorSelector
            onClick={() => handleColorClick("purple")}
            background={colors["purple"]}></ColorSelector>
          <ColorSelector
            onClick={() => handleColorClick("yellow")}
            background={colors["yellow"]}></ColorSelector>
        </ColorSelectorWrapper>
        {children}
      </NoteWrapper>
    </>
  );
}

export const Notes = memo(({ data, parentId = 0, level = 0, groupId }) => {
  const items = data.filter((item) => item.parentId === parentId);

  if (!items.length) return null;

  let parent = false;

  return items.map((item, i) => {
    if (level === 0) {
      groupId = item.id;
      parent = true;
    }

    return (
      <Note key={item.id} note={{ ...item, groupId, i }} parent={parent}>
        <Notes data={data} parentId={item.id} level={level + 1} groupId={groupId}></Notes>
      </Note>
    );
  });
});

export default Notes;
