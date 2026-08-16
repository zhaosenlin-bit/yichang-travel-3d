import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export default function Door({ position = [0, 0, 0], label, color = '#8b3a1f', onEnter }) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const leftRef = useRef();
  const rightRef = useRef();
  const t = useRef(0);

  const handleClick = (e) => {
    e.stopPropagation();
    if (open) return;
    setOpen(true);
    setTimeout(() => onEnter && onEnter(), 900);
  };

  useFrame((_, d) => {
    if (!open) return;
    t.current += d;
    const p = Math.min(1, t.current / 0.8);
    const off = 1.5 * p;
    if (leftRef.current) leftRef.current.position.x = -off;
    if (rightRef.current) rightRef.current.position.x = off;
  });

  return (
    <group position={position} onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}>
      <mesh ref={leftRef} position={[-0.9, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 3.6, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.75} metalness={0.1} />
      </mesh>
      <mesh ref={rightRef} position={[0.9, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 3.6, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.75} metalness={0.1} />
      </mesh>
      {hover && (
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[2.2, 4]} />
          <meshBasicMaterial color="#ffd38a" transparent opacity={0.18} />
        </mesh>
      )}
      <mesh position={[0, 2.4, 0.2]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#e85050" emissive="#cc2828" emissiveIntensity={0.7} />
      </mesh>
      <Text position={[0, -2.4, 0.1]} fontSize={0.32} color="#f0d098" anchorX="center" anchorY="middle"
        outlineWidth={0.02} outlineColor="#3a1a0a">
        {label}
      </Text>
    </group>
  );
}
