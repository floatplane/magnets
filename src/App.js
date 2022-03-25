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
  "tick, tick ...BOOM!",
  "being the ricardos",
  "the tragedy of macbeth",
  "the eyes of tammy faye",
  "spencer",
  "the lost daughter",
];

const others = [
  "starring",
  "featuring",
  "as",
  "in",
  "for",
  "to",
  "the",
  "academy",
  "award",
  "for",
  "best",
  "supporting",
  "actor",
  "actress",
  "picture",
  "goes",
  "to",
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

const wordsAndColors = titles
  .flatMap((title) => {
    const words = title.split(" ");
    const color = please.make_color({
      value: 0.75 + 0.1 * (rng() - 0.5),
    });
    return words.map((word) => ({ word, color }));
  })
  .concat(
    others.map((word) => {
      const color = please.make_color({
        value: 0.75 + 0.1 * (rng() - 0.5),
      });
      return { word, color };
    })
  );

const wordList = wordsAndColors.map(({ word, color }) => ({
  word,
  color,
  angle: 6.0 * (rng() - 0.5),
}));

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

  const onReset = () => {
    setWords([]);
  };

  const onCopy = () => {
    console.log(words);
    const str = [...words]
      .sort((a, b) => (a.offset.x > b.offset.x ? 1 : -1))
      .map((w) => w.name)
      .join(" ");
    console.log("copy:", str);
    navigator.clipboard.writeText(`"${str}"`);
  };

  const deleteWord = (index) => {
    const nextWords = [...words];
    nextWords.splice(index, 1);
    setWords(nextWords);
  };

  const [, drop] = useDrop(
    () => ({
      accept: "word",
      drop: (item, monitor) => {
        const offset = monitor.getSourceClientOffset();
        if (item.boardIndex !== -1) {
          words.splice(item.boardIndex, 1);
        }
        const nextList = words.concat({
          name: item.name,
          style: item.style,
          offset,
        });
        setWords(nextList);
        return { name: "DropTarget" };
      },
    }),
    [words]
  );

  return (
    <div className="DropTarget" ref={drop} style={{ ...style }}>
      <div className="Buttons">
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
      {words.map((word, index) => {
        console.log(
          `drawing ${word.name} at (${word.offset.x}, ${word.offset.y})`
        );
        return (
          <Word
            name={word.name}
            onBoard={true}
            boardIndex={index}
            style={{
              ...word.style,
              position: "absolute",
              left: word.offset.x,
              top: word.offset.y,
            }}
            key={uuidv4()}
            onClose={() => deleteWord(index)}
          />
        );
      })}
    </div>
  );
};

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <DropTarget />
        <div className="Source" key="Source">
          {wordList.map(({ word, color, angle }) => (
            <Word
              name={word}
              onBoard={false}
              key={uuidv4()}
              style={{
                transform: `rotate(${angle}deg`,
                backgroundColor: color,
                display: "inline-block",
              }}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
