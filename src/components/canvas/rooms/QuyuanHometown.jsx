import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function Pavilion({ position, color = '#8b3a1f', roof = '#2a3a4a' }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[2.6, 0.8, 2.6]} />
        <meshStandardMaterial color="#c8a878" roughness={0.9} />
      </mesh>
      {/* Pillars */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => (
        <mesh key={i} position={[x * 1.05, 1.5, z * 1.05]}>
          <cylinderGeometry args={[0.14, 0.14, 1.8, 10]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      ))}
      {/* Roof */}
      <mesh position={[0, 2.7, 0]}>
        <coneGeometry args={[2.4, 1.3, 4]} />
        <meshStandardMaterial color={roof} roughness={0.7} />
      </mesh>
    </group>
  );
}

function Bamboo({ position, scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 2.2, 6]} />
        <meshStandardMaterial color="#4a6a3a" roughness={0.85} />
      </mesh>
      {[0.4, 0.9, 1.4, 1.9].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.07, 0.02, 6, 12]} />
          <meshStandardMaterial color="#7a5a3a" />
        </mesh>
      ))}
      {[0.6, 1.2, 1.8].map((y, i) => (
        <mesh key={i} position={[0.15, y, 0]} rotation={[0, 0, -0.5]}>
          <planeGeometry args={[0.18, 0.05]} />
          <meshStandardMaterial color="#5a8a3a" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function Mountain({ x, z, scale = 1, color = '#5a4a3a' }) {
  return (
    <mesh position={[x, -1, z]} scale={[scale, scale * 0.8, scale]}>
      <coneGeometry args={[6, 9, 5, 1]} />
      <meshStandardMaterial color={color} roughness={0.95} flatShading />
    </mesh>
  );
}

export default function QuyuanHometown() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[60, 32, 16]} />
        <meshBasicMaterial color="#e8d8b8" side={THREE.BackSide} />
      </mesh>
      {/* Distant mountains */}
      {[-32, -18, -6, 8, 22, 36].map((x, i) => (
        <Mountain key={i} x={x} z={-26 - (i % 2) * 4} scale={2.4 + i * 0.1} color={i % 2 ? '#6a5a4a' : '#5a4a3a'} />
      ))}
      {/* Ground */}
      <mesh position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 50]} />
        <meshStandardMaterial color="#9a8868" roughness={0.95} />
      </mesh>
      {/* Central main hall */}
      <Pavilion position={[0, 0, 0]} />
      {/* Side pavilions */}
      <Pavilion position={[-5, 0, -2]} color="#7a3a1f" roof="#1a2a3a" />
      <Pavilion position={[5, 0, -2]} color="#7a3a1f" roof="#1a2a3a" />
      <Pavilion position={[-3, 0, 4]} color="#8b3a1f" roof="#2a2a3a" />
      <Pavilion position={[3, 0, 4]} color="#8b3a1f" roof="#2a2a3a" />
      {/* Bamboo clusters */}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = -22 + i * 2.5 + (i % 2) * 0.4;
        const z = 10 + (i % 3) * 1.5;
        return <Bamboo key={i} position={[x, -1, z]} scale={1.2 + Math.random() * 0.6} />;
      })}
      {/* Path stones */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[-4 + i * 0.9, -0.95, 7 + i * 0.3]}>
          <boxGeometry args={[0.5, 0.1, 0.5]} />
          <meshStandardMaterial color="#8a7a6a" roughness={0.95} />
        </mesh>
      ))}
      {/* Title */}
      <Text position={[0, 5, 0]} fontSize={0.7} color="#5a2a1a" anchorX="center" anchorY="middle"
        outlineWidth={0.04} outlineColor="#f0d098">
        屈原故里
      </Text>
      <Text position={[0, 4.2, 0]} fontSize={0.22} color="#8b3a1f" anchorX="center" anchorY="middle">
        端午源头 · 世界文化名人
      </Text>
    </group>
  );
}
