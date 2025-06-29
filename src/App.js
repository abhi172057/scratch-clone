import React, { useState, useRef } from 'react';
import MotionBlocks from './components/MotionBlocks';
import LooksBlocks from './components/LooksBlocks';
import Stage from './components/Stage';
import Sprite from './components/Sprite';
import './App.css';

function App() {
  const [sprites, setSprites] = useState([
    { id: 1, name: 'Turtle', type: 'turtle', commands: [] },
    { id: 2, name: 'Rabbit', type: 'rabbit', commands: [] },
  ]);

  const [selectedSpriteId, setSelectedSpriteId] = useState(1);
  const [playKey, setPlayKey] = useState(0);

  // Refs to sprites to access methods like getPosition, reset, etc.
  const spriteRefs = useRef({});

  // Add command to only the selected sprite
  const handleDropCommand = (cmd) => {
    setSprites((prevSprites) =>
      prevSprites.map((sprite) =>
        sprite.id === selectedSpriteId
          ? { ...sprite, commands: [...sprite.commands, cmd] }
          : sprite
      )
    );
  };

  // Play all sprites' commands simultaneously
  // Also implements "Hero Feature" — swap commands if sprites collide (distance < 80px)
  const handlePlay = () => {
    // Get current positions of sprites from refs
    const positions = Object.entries(spriteRefs.current).map(([id, ref]) => ({
      id: Number(id),
      pos: ref?.getPosition?.() || { x: 0, y: 0 },
    }));

    // Detect collisions (distance < 80)
    const collidedPairs = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const a = positions[i];
        const b = positions[j];
        const dx = a.pos.x - b.pos.x;
        const dy = a.pos.y - b.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          collidedPairs.push([a.id, b.id]);
        }
      }
    }

    // Swap commands between collided sprites
    setSprites((prevSprites) => {
      const updated = [...prevSprites];
      collidedPairs.forEach(([id1, id2]) => {
        const idx1 = updated.findIndex((s) => s.id === id1);
        const idx2 = updated.findIndex((s) => s.id === id2);
        if (idx1 !== -1 && idx2 !== -1) {
          const tempCommands = updated[idx1].commands;
          updated[idx1].commands = updated[idx2].commands;
          updated[idx2].commands = tempCommands;
        }
      });
      return updated;
    });

    // Trigger sprites to run their commands
    setPlayKey((prevKey) => prevKey + 1);
  };

  // Reset all sprites and clear commands
  const handleResetAll = () => {
    setSprites((prevSprites) =>
      prevSprites.map((sprite) => ({ ...sprite, commands: [] }))
    );

    Object.values(spriteRefs.current).forEach((ref) => {
      if (ref?.reset) ref.reset();
    });

    setPlayKey(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Scratch Clone – Video Style (Hero Feature Enabled)
      </h1>

      <div className="grid grid-cols-12 gap-6" style={{ height: '80vh' }}>
        {/* Left panel: Motion & Looks Blocks */}
        <div className="col-span-3 bg-white p-4 rounded border overflow-auto flex flex-col gap-6">
          <MotionBlocks
            onCommand={handleDropCommand}
            selectedSpriteId={selectedSpriteId} // optional: pass if you want to show selected sprite in blocks UI
          />
          <LooksBlocks
            onCommand={handleDropCommand}
            selectedSpriteId={selectedSpriteId} // optional
          />
        </div>

        {/* Center panel: Stage + Drop area + Play & Reset buttons */}
        <div className="col-span-5 bg-white p-4 rounded border flex flex-col">
          <Stage
            onDropCommand={handleDropCommand}
            selectedSpriteId={selectedSpriteId}
            sprites={sprites}
          />
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={handlePlay}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              aria-label="Play all sprites"
              type="button"
            >
              ▶️ Play All Sprites
            </button>
            <button
              onClick={handleResetAll}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              aria-label="Reset all sprites"
              type="button"
            >
              🔄 Reset All
            </button>
          </div>
        </div>

        {/* Right panel: Sprite selection and previews */}
        <div className="col-span-4 bg-white p-4 rounded border flex flex-col">
          <div className="flex gap-3 mb-4 justify-center">
            {sprites.map((sprite) => (
              <button
                key={sprite.id}
                onClick={() => setSelectedSpriteId(sprite.id)}
                className={`px-4 py-1 rounded ${
                  sprite.id === selectedSpriteId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300'
                }`}
                aria-pressed={sprite.id === selectedSpriteId}
                aria-label={`Select ${sprite.name} sprite`}
                type="button"
              >
                {sprite.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-6 overflow-auto flex-grow">
            {sprites.map((sprite) => (
              <Sprite
                key={sprite.id}
                sprite={sprite}
                playKey={playKey}
                ref={(el) => (spriteRefs.current[sprite.id] = el)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
