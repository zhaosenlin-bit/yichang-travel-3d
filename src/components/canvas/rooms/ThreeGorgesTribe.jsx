import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function StiltedHouse({ position, tilt = 0 }) {
  return (
    <group position={position} rotation={[0, tilt, 0]}>
      {/* stilts */}
      {[[-1.2, -0.6], [1.2, -0.6], [-1.2, 0.6], [1.2, 0.6]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.5, z]}>
          <cylinderGeometry args={[0.08, 0.08, 1.6, 6]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
        </mesh>
      ))}
      {/* main body */}
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[2.8, 1.4, 1.6]} />
        <meshStandardMaterial color="#8b6a3a" roughness={0.85} />
      </mesh>
      {/* roof */}
      <mesh position={[0, 2.95, 0]}>
        <coneGeometry args={[2.3, 1.0, 4]} />
        <meshStandardMaterial color="#3a4a2a" roughness={0.8} />
      </mesh>
      {/* window */}
      <mesh position={[0, 1.7, 0.81]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshBasicMaterial color="#1a1a0a" />
      </mesh>
    </group>
  );
}

function Mountain({ x, z, scale = 1, color = '#4a5a3a' }) {
  return (
    <mesh position={[x, -1, z]} scale={[scale, scale * 0.85, scale]}>
      <coneGeometry args={[5, 8, 6, 1]} />
      <meshStandardMaterial color={color} roughness={0.95} flatShading />
    </mesh>
  );
}

function Boat({ position }) {
  const ref = useRef();
  useFrame((s) => { if (ref.current) ref.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 1.2) * 0.08; });
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.0, 0.35, 0.6]} />
        <meshStandardMaterial color="#6a3a1a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2.0, 0.05, 0.55]} />
        <meshStandardMaterial color="#8b5a3a" />
      </mesh>
      {/* mast */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.5, 6]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
      {/* sail */}
      <mesh position={[0.05, 0.9, 0]}>
        <planeGeometry args={[1.0, 1.2]} />
        <meshStandardMaterial color="#f0e8d8" side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
    </group>
  );
}

export default function ThreeGorgesTribe() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[60, 32, 16]} />
        <meshBasicMaterial color="#c8d8b8" side={THREE.BackSide} />
      </mesh>
      {/* Mountains */}
      {[-32, -18, -4, 10, 22, 36].map((x, i) => (
        <Mountain key={i} x={x} z={-24 - (i % 2) * 5} scale={2.2 + i * 0.13} color={i % 2 ? '#5a6a4a' : '#4a5a3a'} />
      ))}
      {/* River (water plane) */}
      <mesh position={[0, -1.0, 4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 16]} />
        <meshStandardMaterial color="#4a7a8a" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Riverbank */}
      <mesh position={[0, -1.0, -6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 30]} />
        <meshStandardMaterial color="#6a5a3a" roughness={0.95} />
      </mesh>
      {/* Stilted houses */}
      <StiltedHouse position={[-8, 0.8, -4]} />
      <StiltedHouse position={[3, 0.8, -5]} tilt={0.2} />
      <StiltedHouse position={[10, 0.8, -3]} />
      <StiltedHouse position={[-4, 0.8, -8]} />
      <StiltedHouse position={[7, 0.8, -8]} />
      {/* Boats */}
      <Boat position={[12, -0.6, 4]} />
      <Boat position={[-15, -0.6, 5]} />
      <Boat position={[0, -0.6, 6]} />
      {/* Trees */}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = -26 + i * 4 + (i % 2) * 0.6;
        const z = -8 - (i % 4) * 2;
        return (
          <group key={'t' + i} position={[x, -1, z]}>
            <mesh position={[0, 0.6, 0]}>
              <coneGeometry args={[0.45, 1.4, 6]} />
              <meshStandardMaterial color="#3a5a3a" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.10, 0.14, 0.4, 6]} />
              <meshStandardMaterial color="#5a3a1a" roughness={0.95} />
            </mesh>
          </group>
        );
      })}
      <Text position={[0, 5.5, -3]} fontSize={0.7} color="#3a5a3a" anchorX="center" anchorY="middle"
        outlineWidth={0.04} outlineColor="#f0e8d8">
        三峡人家
      </Text>
      <Text position={[0, 4.7, -3]} fontSize={0.22} color="#5a6a4a" anchorX="center" anchorY="middle">
        峡江风情 · 土家文化活化石
      </Text>
    </group>
  );
}
