import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function Building({ x, z, h, w = 1.4, color = '#3a4a5a' }) {
  return (
    <group position={[x, -1 + h / 2, z]}>
      <mesh castShadow>
        <boxGeometry args={[w, h, w]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Windows */}
      {Array.from({ length: Math.floor(h) }).map((_, i) => (
        <mesh key={i} position={[0, -h / 2 + 0.4 + i, w / 2 + 0.01]}>
          <planeGeometry args={[w * 0.6, 0.2]} />
          <meshStandardMaterial color="#f0d090" emissive="#f0d090" emissiveIntensity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Mountain({ x, z, scale = 1, color = '#3a423a' }) {
  return (
    <mesh position={[x, -1, z]} scale={[scale, scale * 0.7, scale]}>
      <coneGeometry args={[6, 6, 5, 1]} />
      <meshStandardMaterial color={color} roughness={0.95} flatShading />
    </mesh>
  );
}

export default function YichangCity() {
  // 🌃 night sky twinkling stars
  const starsRef = useRef();
  const stars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 200; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      arr.push([Math.sin(phi) * Math.cos(theta) * 50, Math.cos(phi) * 50 + 2, Math.sin(phi) * Math.sin(theta) * 50]);
    }
    return arr;
  }, []);
  useFrame((s) => {
    if (starsRef.current) starsRef.current.rotation.y = s.clock.elapsedTime * 0.005;
  });

  return (
    <group>
      {/* Night sky */}
      <mesh>
        <sphereGeometry args={[60, 32, 16]} />
        <meshBasicMaterial color="#0a0a18" side={THREE.BackSide} />
      </mesh>
      {/* Stars */}
      <group ref={starsRef}>
        {stars.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.12, 6, 6]} />
            <meshBasicMaterial color="#fff8d0" />
          </mesh>
        ))}
      </group>
      {/* Moon */}
      <mesh position={[20, 25, -30]}>
        <sphereGeometry args={[3.5, 24, 24]} />
        <meshBasicMaterial color="#fff0c0" />
      </mesh>
      {/* Distant mountains silhouette */}
      {[-40, -20, 0, 20, 40].map((x, i) => (
        <Mountain key={i} x={x} z={-28} scale={2.6 + i * 0.1} color="#1a2026" />
      ))}
      {/* River */}
      <mesh position={[0, -1.0, 4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 14]} />
        <meshStandardMaterial color="#1a2a3a" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Ground (city plaza) */}
      <mesh position={[0, -1.0, -6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 28]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.9} />
      </mesh>
      {/* City skyline */}
      <Building x={-16} z={-8} h={6} color="#3a4a5a" />
      <Building x={-13} z={-9} h={9} color="#4a5a6a" />
      <Building x={-10} z={-8} h={7} color="#5a6a7a" />
      <Building x={-7} z={-10} h={12} color="#6a8aaa" />
      <Building x={-4} z={-9} h={10} color="#4a5a6a" />
      <Building x={-1} z={-11} h={15} color="#8a8a9a" />
      <Building x={2} z={-10} h={11} color="#5a6a8a" />
      <Building x={5} z={-9} h={8} color="#4a5a6a" />
      <Building x={8} z={-10} h={13} color="#7a9aaa" />
      <Building x={11} z={-9} h={9} color="#5a5a6a" />
      <Building x={14} z={-8} h={7} color="#4a5a6a" />
      <Building x={17} z={-9} h={10} color="#5a6a7a" />
      {/* Front-row smaller buildings */}
      <Building x={-12} z={-3} h={3} w={1.2} color="#3a3a48" />
      <Building x={-6} z={-3} h={4} w={1.2} color="#3a3a48" />
      <Building x={0} z={-3} h={3.5} w={1.2} color="#3a3a48" />
      <Building x={6} z={-3} h={4} w={1.2} color="#3a3a48" />
      <Building x={12} z={-3} h={3} w={1.2} color="#3a3a48" />
      {/* Title */}
      <Text position={[0, 6, -3]} fontSize={0.7} color="#f0d090" anchorX="center" anchorY="middle"
        outlineWidth={0.04} outlineColor="#1a1a22">
        宜昌城景
      </Text>
      <Text position={[0, 5.2, -3]} fontSize={0.22} color="#c8a050" anchorX="center" anchorY="middle">
        滨江之城 · 水电之都
      </Text>
    </group>
  );
}
