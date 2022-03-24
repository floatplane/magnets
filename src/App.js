import React from "react";
import { v4 as uuidv4 } from "uuid";

import Word from "./Word";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";

const titles = [
  "the worst person in the world",
  "don't look up",
  "encanto",
  "parallel mothers",
  "the power of the dog",
  "no time to die",
  "belfast",
  "coda",
  "drive my car",
  "dune",
  "king richard",
  "licorice pizza",
  "nightmare alley",
  "west side story",
];

const DropTarget = () => {
  const style: CSSProperties = {
    color: "white",
    padding: "1rem",
    textAlign: "center",
    fontSize: "1rem",
    lineHeight: "normal",
    float: "left",
  };

  const [words, setWords] = React.useState([]);
  const [undoStack, setUndoStack] = React.useState([]);

  const onUndo = () => {
    if (words.length > 0) {
      setUndoStack(undoStack.concat(words[words.length - 1]));
      setWords(words.slice(0, -1));
    }
  };

  const onRedo = () => {
    if (undoStack.length > 0) {
      setUndoStack(undoStack.slice(0, -1));
      setWords(words.concat(undoStack[undoStack.length - 1]));
    }
  };

  const onReset = () => {
    setWords([]);
    setUndoStack([]);
  };

  const onCopy = () => {
    const str = words.map((w) => w.name).join(" ");
    console.log("copy:", str);
    navigator.clipboard.writeText(str);
  };

  const [props, drop] = useDrop(
    () => ({
      accept: "word",
      drop: (item, monitor) => {
        const offset = monitor.getClientOffset();
        console.log("inside drop", item);
        const nextList = words.concat({ name: item.name, offset });
        console.log("next dropped words", nextList);
        setWords(nextList);
        return { name: "DropTarget" };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [words]
  );

  return (
    <div className="DropTarget" ref={drop} style={{ ...style }}>
      <div className="Buttons">
        <button onClick={onUndo} disabled={words.length == 0}>
          Undo
        </button>
        <button onClick={onRedo} disabled={undoStack.length == 0}>
          Redo
        </button>
        <button onClick={onCopy} disabled={words.length == 0}>
          Copy
        </button>
        <button onClick={onReset}>Reset</button>
      </div>
      {words.length == 0 && (
        <div className="Empty">Drag some words up here</div>
      )}
      {words.map((word) => (
        <Word name={word.name} key={uuidv4()} />
      ))}
    </div>
  );
};

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <DropTarget key="Drop" />
        <div className="Source" key="Source">
          {titles.map((t, row) => {
            const words = t.split(" ");
            return (
              <div className="SourceRow">
                {words.map((w, col) => (
                  <Word name={w} key={`${row}-${col}`} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
