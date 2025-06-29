import React from 'react';
import { useDrop } from 'react-dnd';

const Stage = ({ onDropCommand }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'block',
    drop: (item) => onDropCommand(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <section
      ref={drop}
      className={`min-h-[180px] mt-6 p-6 rounded-xl border-4 border-dashed transition-colors duration-300 shadow-lg
        flex items-center justify-center text-lg font-semibold
        ${
          isOver
            ? 'bg-yellow-100 border-yellow-400 text-yellow-700'
            : 'bg-gray-50 border-gray-300 text-gray-600'
        }`}
      aria-label="Drop area for motion and looks blocks"
      tabIndex={0}
    >
      {isOver ? '🎯 Drop the Block Here!' : '🧩 Drop Motion/Looks Blocks Here'}
    </section>
  );
};

export default Stage;
