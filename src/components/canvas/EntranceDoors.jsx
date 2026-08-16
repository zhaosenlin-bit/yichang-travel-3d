import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const doorColor = '#8b3a1f';
const doorAccent = '#d4a050';

export default function EntranceDoors({ position = [0, 0, 0], onComplete }) {
  const leftRef = useRef();
  const rightRef = useRef();
  const [opening, setOpening] = useState(false);
  const [done, setDone] = useState(false);
  const t = useRef(0);

  const handleClick = (e) => { e.stopPropagation(); if (!opening && !done) setOpening(true); };

  useFrame((_, d) => {
    if (opening && !done) {
      t.current += d;
      const p = Math.min(1, t.current / 1.2);
      const e = 1 - Math.pow(1 - p, 3);
      const off = 3.2 * e;
      if (leftRef.current) leftRef.current.position.x = -off;
      if (rightRef.current) rightRef.current.position.x = off;
      if (p >= 1 && !done) { setDone(true); onComplete && onComplete(); }
    }
  });

  if (done) return null;
  return (
    <group position={position}>
      <mesh ref={leftRef} position={[-1.6, 0, 0]} onClick={handleClick} castShadow receiveShadow>
        <boxGeometry args={[3.2, 5.5, 0.18]} />
        <meshStandardMaterial color={doorColor} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh ref={rightRef} position={[1.6, 0, 0]} onClick={handleClick} castShadow receiveShadow>
        <boxGeometry args={[3.2, 5.5, 0.18]} />
        <meshStandardMaterial color={doorColor} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[3.4, 0.12, 0.04]} />
        <meshStandardMaterial color={doorAccent} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -2.6, 0.1]}>
        <boxGeometry args={[3.4, 0.12, 0.04]} />
        <meshStandardMaterial color={doorAccent} metalness={0.8} roughness={0.3} />
      </mesh>
      <Text position={[0, 3.5, 0.15]} fontSize={0.42} color="#f0d098" anchorX="center" anchorY="middle">
        宜昌旅游 3D
      </Text>
      <Text position={[0, 2.8, 0.15]} fontSize={0.22} color="#d4a050" anchorX="center" anchorY="middle">
        峡江山水长卷 · 点击进入
      </Text>
      <mesh position={[-2.5, 1.2, 0.3]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#e85050" emissive="#cc2828" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[2.5, 1.2, 0.3]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#e85050" emissive="#cc2828" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}
