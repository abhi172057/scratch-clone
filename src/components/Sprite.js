import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';

const STEP_SIZE = 10;

const Sprite = forwardRef(({ sprite, playKey, onMove }, ref) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [commands, setCommands] = useState(sprite.commands || []);

  const cancelledRef = useRef(false);
  const rotationRef = useRef(rotation);
  const commandsRef = useRef(commands);
  const positionRef = useRef(position);

  // Sync refs with states for latest async usage
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  // Update commands state whenever sprite.commands prop changes
  useEffect(() => {
    setCommands(sprite.commands || []);
  }, [sprite.commands]);

  useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);

  useEffect(() => {
    positionRef.current = position;
    if (onMove) {
      onMove(sprite.id, position);
    }
  }, [position, sprite.id, onMove]);

  // Helper to delay execution (async wait)
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    if (playKey === null || playKey === undefined) return;

    cancelledRef.current = false;

    const runCommands = async () => {
      for (const cmd of commandsRef.current) {
        if (cancelledRef.current) break;

        switch (cmd.type) {
          case 'moveSteps': {
            const rad = (rotationRef.current * Math.PI) / 180;
            const dx = Math.cos(rad) * cmd.steps * STEP_SIZE;
            const dy = Math.sin(rad) * cmd.steps * STEP_SIZE;
            setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
            await delay(500);
            break;
          }
          case 'turnDegrees': {
            setRotation((prev) => {
              const newRotation = (prev + cmd.degrees) % 360;
              rotationRef.current = newRotation;
              return newRotation;
            });
            await delay(300);
            break;
          }
          case 'goToXY': {
            setPosition({ x: cmd.x, y: cmd.y });
            await delay(500);
            break;
          }
          case 'sayForTime':
          case 'thinkForTime': {
            setMessage(cmd.message);
            setMessageType(cmd.type);
            setShowMessage(true);
            await delay(cmd.duration * 1000);
            setShowMessage(false);
            break;
          }
          default:
            // Unknown command type, do nothing
            break;
        }
      }
    };

    runCommands();

    return () => {
      cancelledRef.current = true;
      setShowMessage(false);
    };
  }, [playKey]);

  useImperativeHandle(ref, () => ({
    reset() {
      cancelledRef.current = true;
      setPosition({ x: 0, y: 0 });
      setRotation(0);
      setMessage('');
      setShowMessage(false);
      setCommands([]); // Clear commands on reset
    },
    updateCommands(newCommands) {
      setCommands(newCommands || []);
    },
    getPosition() {
      return positionRef.current;
    },
    getCommands() {
      return commandsRef.current;
    },
    setCommandsDirectly(newCommands) {
      setCommands(newCommands || []);
    },
  }));

  const spriteEmojis = {
    turtle: '🐢',
    rabbit: '🐇',
  };

  const emoji = spriteEmojis[sprite.type] || '❓';

  return (
    <div
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        transition: 'transform 0.5s ease',
        width: 120,
        height: 120,
        backgroundColor: 'lightyellow',
        border: '4px solid #4b5563',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontSize: 80,
        borderRadius: 12,
        margin: 10,
        userSelect: 'none',
      }}
      aria-label={`${sprite.type} sprite`}
      role="img"
    >
      {showMessage && (
        <div
          style={{
            position: 'absolute',
            top: -35,
            width: '100%',
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 500,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          aria-live="polite"
        >
          {messageType === 'sayForTime' ? '🗨️' : '💭'} {message}
        </div>
      )}

      {emoji}
    </div>
  );
});

export default Sprite;
