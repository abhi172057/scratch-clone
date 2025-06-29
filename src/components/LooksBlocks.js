import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

const LooksBlock = ({ label, data, children }) => {
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
      className={`cursor-move p-3 mb-3 rounded border border-green-600 bg-green-50 shadow ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      role="button"
      tabIndex={0}
      aria-label={`Drag ${label}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Optional: add behavior for keyboard drag initiation if desired
        }
      }}
    >
      <div className="font-semibold text-green-800 mb-1">{label}</div>
      <div className="flex items-center flex-wrap gap-2">{children}</div>
    </div>
  );
};

const LooksBlocks = ({ onCommand }) => {
  const [sayMessage, setSayMessage] = useState('Hello!');
  const [sayDuration, setSayDuration] = useState(2);
  const [thinkMessage, setThinkMessage] = useState('Hmm...');
  const [thinkDuration, setThinkDuration] = useState(2);

  // Helper to sanitize number inputs
  const toNumber = (val) => (isNaN(Number(val)) ? 1 : Number(val));

  return (
    <div className="w-full p-4 bg-green-100 rounded shadow">
      <h2 className="text-xl font-bold text-green-700 mb-4">Looks Blocks</h2>

      {/* Say Block */}
      <LooksBlock
        label="Say for seconds:"
        data={{ type: 'sayForTime', message: sayMessage, duration: sayDuration }}
      >
        <input
          type="text"
          value={sayMessage}
          onChange={(e) => setSayMessage(e.target.value)}
          className="w-28 border rounded px-2 py-1"
          placeholder="Say something"
          aria-label="Say message"
        />
        <span>for</span>
        <input
          type="number"
          value={sayDuration}
          onChange={(e) => setSayDuration(toNumber(e.target.value))}
          className="w-16 border rounded px-2 py-1"
          min={1}
          aria-label="Say duration in seconds"
        />
        <span>sec</span>
        <button
          onClick={() =>
            onCommand({ type: 'sayForTime', message: sayMessage, duration: sayDuration })
          }
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          type="button"
          aria-label={`Add say block with message: ${sayMessage} for ${sayDuration} seconds`}
        >
          🟢
        </button>
      </LooksBlock>

      {/* Think Block */}
      <LooksBlock
        label="Think for seconds:"
        data={{ type: 'thinkForTime', message: thinkMessage, duration: thinkDuration }}
      >
        <input
          type="text"
          value={thinkMessage}
          onChange={(e) => setThinkMessage(e.target.value)}
          className="w-28 border rounded px-2 py-1"
          placeholder="Think something"
          aria-label="Think message"
        />
        <span>for</span>
        <input
          type="number"
          value={thinkDuration}
          onChange={(e) => setThinkDuration(toNumber(e.target.value))}
          className="w-16 border rounded px-2 py-1"
          min={1}
          aria-label="Think duration in seconds"
        />
        <span>sec</span>
        <button
          onClick={() =>
            onCommand({ type: 'thinkForTime', message: thinkMessage, duration: thinkDuration })
          }
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          type="button"
          aria-label={`Add think block with message: ${thinkMessage} for ${thinkDuration} seconds`}
        >
          🟢
        </button>
      </LooksBlock>
    </div>
  );
};

export default LooksBlocks;
