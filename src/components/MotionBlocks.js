import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

const MotionBlock = ({ label, children, data }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'block',
    item: data,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`cursor-move p-3 mb-3 rounded border border-blue-500 bg-blue-50 shadow-md ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      role="button"
      tabIndex={0}
      aria-label={`Drag ${label}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Could trigger drag or do nothing
        }
      }}
    >
      <div className="font-semibold text-blue-800 mb-1">{label}</div>
      <div className="flex items-center flex-wrap gap-2">{children}</div>
    </div>
  );
};

const MotionBlocks = ({ onCommand }) => {
  const [steps, setSteps] = useState(10);
  const [degrees, setDegrees] = useState(15);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [repeatCount, setRepeatCount] = useState(5);

  // Helper to sanitize number inputs
  const toNumber = (val) => (isNaN(Number(val)) ? 0 : Number(val));

  return (
    <div className="w-full p-4 bg-blue-100 rounded shadow">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Motion Blocks</h2>

      <MotionBlock label="Move steps:" data={{ type: 'moveSteps', steps }}>
        <input
          type="number"
          value={steps}
          min={0}
          onChange={(e) => setSteps(toNumber(e.target.value))}
          className="w-20 border rounded px-2 py-1"
          aria-label="Steps to move"
        />
        <button
          onClick={() => onCommand({ type: 'moveSteps', steps })}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          type="button"
          aria-label={`Add move steps command with ${steps} steps`}
        >
          ➤
        </button>
      </MotionBlock>

      <MotionBlock label="Turn right:" data={{ type: 'turnDegrees', degrees }}>
        <input
          type="number"
          value={degrees}
          onChange={(e) => setDegrees(toNumber(e.target.value))}
          className="w-20 border rounded px-2 py-1"
          aria-label="Degrees to turn right"
        />
        <button
          onClick={() => onCommand({ type: 'turnDegrees', degrees })}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          type="button"
          aria-label={`Add turn right command with ${degrees} degrees`}
        >
          ⟳
        </button>
      </MotionBlock>

      <MotionBlock label="Go to X Y:" data={{ type: 'goToXY', x, y }}>
        <label>
          X:
          <input
            type="number"
            value={x}
            onChange={(e) => setX(toNumber(e.target.value))}
            className="w-16 border rounded px-2 py-1 ml-1 mr-3"
            aria-label="X coordinate"
          />
        </label>
        <label>
          Y:
          <input
            type="number"
            value={y}
            onChange={(e) => setY(toNumber(e.target.value))}
            className="w-16 border rounded px-2 py-1 ml-1"
            aria-label="Y coordinate"
          />
        </label>
        <button
          onClick={() => onCommand({ type: 'goToXY', x, y })}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 ml-2"
          type="button"
          aria-label={`Add go to X ${x} Y ${y} command`}
        >
          🎯
        </button>
      </MotionBlock>

      <MotionBlock label="Repeat block:" data={{ type: 'repeat', count: repeatCount }}>
        <input
          type="number"
          min={1}
          value={repeatCount}
          onChange={(e) => setRepeatCount(toNumber(e.target.value))}
          className="w-20 border rounded px-2 py-1"
          aria-label="Repeat count"
        />
        <span className="ml-2">times</span>
        <button
          onClick={() => onCommand({ type: 'repeat', count: repeatCount })}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 ml-2"
          type="button"
          aria-label={`Add repeat block command to repeat ${repeatCount} times`}
        >
          🔁
        </button>
      </MotionBlock>
    </div>
  );
};

export default MotionBlocks;
