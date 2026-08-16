import { useMemo } from 'react';
import * as THREE from 'three';

const palette = { wall: '#f3e8d2', floor: '#c8a878', ceiling: '#f3e8d2', trim: '#8b3a1f' };

export default function Corridor({ length = 80, width = 5, height = 5 }) {
  const floorTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = palette.floor; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = 'rgba(90,55,30,0.3)';
    for (let i = 0; i < 256; i += 32) { g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(4, length / 4);
    return t;
  }, [length]);

  const wallTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = palette.wall; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = 'rgba(139, 70, 40, 0.18)';
    g.lineWidth = 2;
    for (let y = 0; y < 256; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); }
    for (let x = 0; x < 256; x += 128) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(length / 6, 1);
    return t;
  }, [length]);

  const z0 = -length / 2;
  return (
    <group>
      <mesh position={[0, -height / 2, z0 + length / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial map={floorTex} roughness={0.85} />
      </mesh>
      <mesh position={[0, height / 2, z0 + length / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={palette.ceiling} roughness={0.9} />
      </mesh>
      <mesh position={[-width / 2, 0, z0 + length / 2]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial map={wallTex} roughness={0.9} />
      </mesh>
      <mesh position={[width / 2, 0, z0 + length / 2]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial map={wallTex} roughness={0.9} />
      </mesh>
      {Array.from({ length: Math.floor(length / 3) + 1 }).map((_, i) => (
        <mesh key={'b' + i} position={[0, height / 2 - 0.08, z0 + i * 3]} castShadow>
          <boxGeometry args={[width + 0.05, 0.16, 0.22]} />
          <meshStandardMaterial color={palette.trim} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}
