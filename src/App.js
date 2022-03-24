import React from "react";
import { v4 as uuidv4 } from "uuid";
import seedrandom from "seedrandom";
import please from "pleasejs";

import Word from "./Word";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";

var rng = seedrandom("hello oscars.");
seedrandom("hello oscars.", { global: true });

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
  "tick, tick...BOOM!",
  "being the ricardos",
  "the tragedy of macbeth",
  "the eyes of tammy faye",
  "spencer",
  "the lost daughter",
  "starring featuring performance of the year",
  "best supporting actor actress picture",
  "andrew garfield",
  "javier bardem",
  "will smith",
  "benedict cumberbatch",
  "denzel washington",
  "jessica chastain",
  "kristen stewart",
  "penélope cruz",
  "olivia colman",
  "nicole kidman",
  "troy kotsur",
  "j.k. simmons",
  "jesse plemons",
  "kodi smit-mcphee",
  "ciarán hinds",
  "kirsten dunst",
  "jessie buckley",
  "judi dench",
  "ariana debose",
  "aunjanue ellis",
];

const wordList = titles.flatMap((t, row) => {
  const words = t.split(" ");
  const rowColor = please.make_color({
    value: 0.75 + 0.1 * (rng() - 0.5),
  });
  return words.map((word, col) => ({
    word,
    row,
    col,
    rowColor,
    angle: 6.0 * (rng() - 0.5),
  }));
});

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
        const nextList = words.concat({
          name: item.name,
          style: item.style,
          offset,
        });
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
        <button
          className="Button"
          onClick={onUndo}
          disabled={words.length === 0}
        >
          Undo
        </button>
        <button
          className="Button"
          onClick={onRedo}
          disabled={undoStack.length === 0}
        >
          Redo
        </button>
        <button
          className="Button"
          onClick={onCopy}
          disabled={words.length === 0}
        >
          Copy
        </button>
        <button className="Button" onClick={onReset}>
          Reset
        </button>
      </div>
      {words.length === 0 && (
        <div className="Instructions" key="line1">
          Drag words here
        </div>
      )}
      {words.map((word) => (
        <Word name={word.name} style={word.style} key={uuidv4()} />
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
          {wordList.map(({ word, row, rowColor, col, angle }) => (
            <Word
              name={word}
              key={uuidv4()}
              style={{
                transform: `rotate(${angle}deg`,
                backgroundColor: rowColor,
              }}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
