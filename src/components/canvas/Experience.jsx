import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import EntranceDoors from './EntranceDoors';
import Corridor from './corridor/Corridor';
import Door from './corridor/Door';
import ThreeGorgesDam from './rooms/ThreeGorgesDam';
import QuyuanHometown from './rooms/QuyuanHometown';
import ThreeGorgesTribe from './rooms/ThreeGorgesTribe';
import YichangCity from './rooms/YichangCity';
import useInfiniteCamera from '../../hooks/useInfiniteCamera';
import { useScene } from '../../context/SceneContext';
import { attractions } from '../../data/attractions';

const CORRIDOR_LENGTH = 80;
const ROOM_Z = 22;
const ROOM_X_SPEED = 5;

const ROOM_MAP = {
  dam: ThreeGorgesDam,
  quyuan: QuyuanHometown,
  tribe: ThreeGorgesTribe,
  city: YichangCity,
};

function ActiveRoom() {
  const { currentRoom } = useScene();
  if (!currentRoom) return null;
  const a = attractions.find(x => x.id === currentRoom);
  if (!a) return null;
  const Comp = ROOM_MAP[a.scene];
  if (!Comp) return null;
  return <Comp />;
}

function ExitButton() {
  const { currentRoom, exitRoom, isInRoom } = useScene();
  const { camera } = useThree();
  if (!isInRoom) return null;
  return (
    <group position={[0, 0, 0]}
      onClick={(e) => { e.stopPropagation(); exitRoom(); camera.position.set(0, 0.2, 28); }}>
      <mesh position={[0, -3.5, 0]}>
        <boxGeometry args={[1.8, 0.5, 0.1]} />
        <meshStandardMaterial color="#8b3a1f" emissive="#d4a050" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

export default function Experience({ onReady }) {
  const { hasEntered, markEntered, enterRoom, currentRoom, teleportTo, initialRoom, deeplinkHandled, pendingDoorClick } = useScene();
  const { camera } = useThree();

  const { setCameraOverride } = useInfiniteCamera({
    segmentLength: CORRIDOR_LENGTH,
    scrollEnabled: hasEntered && !currentRoom,
    parallaxEnabled: hasEntered && !currentRoom,
  });

  // Notify parent when scene is ready
  useEffect(() => {
    const t = setTimeout(() => onReady && onReady(), 200);
    return () => clearTimeout(t);
  }, [onReady]);

  // Auto teleport via deep link
  useEffect(() => {
    if (initialRoom && hasEntered && !deeplinkHandled.current) {
      deeplinkHandled.current = true;
      setTimeout(() => teleportTo(initialRoom), 600);
    }
  }, [initialRoom, hasEntered, teleportTo, deeplinkHandled]);

  // Handle teleport finish
  useEffect(() => {
    if (pendingDoorClick) {
      const t = setTimeout(() => {
        enterRoom(pendingDoorClick);
      }, 100);
      return () => clearTimeout(t);
    }
  }, [pendingDoorClick, enterRoom]);

  const doorPositions = [
    { id: 'dam', x: -ROOM_X_SPEED, color: '#4a90e2' },
    { id: 'quyuan', x: -ROOM_X_SPEED / 3, color: '#c09060' },
    { id: 'tribe', x: ROOM_X_SPEED / 3, color: '#5fa56f' },
    { id: 'city', x: ROOM_X_SPEED, color: '#d8a050' },
  ];

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 10, 5]} intensity={0.7} castShadow
        shadow-mapSize={[1024, 1024]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} />
      <directionalLight position={[-5, 8, -5]} intensity={0.3} color="#b8d8ff" />
      <fog attach="fog" args={['#000000', 18, 60]} />

      {/* Entrance */}
      {!hasEntered && <EntranceDoors position={[0, 0, 22]} onComplete={markEntered} />}

      {/* Corridor (only when not in room) */}
      {hasEntered && !currentRoom && (
        <>
          <Corridor length={CORRIDOR_LENGTH} />
          {doorPositions.map((d) => (
            <Door key={d.id} position={[d.x, 0, ROOM_Z + 10]} label={attractions.find(a => a.id === d.id).name}
              color={d.color} onEnter={() => enterRoom(d.id)} />
          ))}
        </>
      )}

      {/* Active room */}
      {currentRoom && <ActiveRoom />}
      {currentRoom && <ExitButton />}
    </>
  );
}
