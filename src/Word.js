import { useDrag } from "react-dnd";

const Word = function Word({ name, style = {} }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "word",
    item: { name, style },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        console.log(`You dropped ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const opacity = isDragging ? 0.4 : 1;
  return (
    <div ref={drag} style={{ opacity, ...style }} className="Word">
      {name}
    </div>
  );
};

export default Word;
