import React from "react";

import { useDrag } from "react-dnd";

const Word = function Word({
  name,
  onBoard,
  boardIndex = -1,
  style = {},
  onClose = null,
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "word",
    item: { name, style, onBoard, boardIndex },
  }));

  const [hovered, setHovered] = React.useState(false);

  const opacity = isDragging ? 0.4 : 1;
  return (
    <div
      ref={drag}
      style={{ opacity, ...style }}
      className="Word"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {name}
      {onClose && (
        <div
          className="Button Close"
          style={{ opacity: hovered ? "0.6" : "0.0" }}
          onClick={onClose}
        >
          X
        </div>
      )}
    </div>
  );
};

export default Word;
