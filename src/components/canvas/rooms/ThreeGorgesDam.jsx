import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function Water({ y = -1.2 }) {
  const ref = useRef();
  const mat = useRef();
  useFrame((s) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = s.clock.elapsedTime;
    }
  });
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  return (
    <mesh ref={ref} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[120, 80, 32, 32]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={`uniform float uTime; varying vec2 vUv;
          vec3 c1 = vec3(0.18, 0.45, 0.62); vec3 c2 = vec3(0.32, 0.65, 0.78);
          void main() {
            float w = sin(vUv.x*28.0 + uTime*1.2) * 0.5 + 0.5;
            w *= sin(vUv.y*16.0 - uTime*0.7) * 0.5 + 0.5;
            vec3 col = mix(c1, c2, w);
            gl_FragColor = vec4(col, 0.92);
          }`}
      />
    </mesh>
  );
}

function Mountain({ x, z, scale = 1, color = '#4a5a4a' }) {
  return (
    <mesh position={[x, -1, z]} scale={[scale, scale * (0.6 + Math.random() * 0.4), scale]}>
      <coneGeometry args={[5, 7, 6, 1]} />
      <meshStandardMaterial color={color} roughness={0.95} flatShading />
    </mesh>
  );
}

export default function ThreeGorgesDam() {
  return (
    <group>
      {/* Sky dome */}
      <mesh>
        <sphereGeometry args={[60, 32, 16]} />
        <meshBasicMaterial color="#bcd8e8" side={THREE.BackSide} />
      </mesh>
      {/* Distant mountains */}
      {[-40, -25, -10, 8, 22, 36].map((x, i) => (
        <Mountain key={i} x={x} z={-25 - (i % 2) * 3} scale={2.2 + i * 0.12} color={i % 2 ? '#5a6a5a' : '#4a5a4a'} />
      ))}
      {/* Dam wall */}
      <mesh position={[0, 3.5, -8]} castShadow receiveShadow>
        <boxGeometry args={[28, 9, 3]} />
        <meshStandardMaterial color="#9ba0a8" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Dam crest */}
      <mesh position={[0, 8.2, -8]}>
        <boxGeometry args={[28.4, 0.4, 3.3]} />
        <meshStandardMaterial color="#7a7e88" roughness={0.7} />
      </mesh>
      {/* Dam vertical seams */}
      {Array.from({ length: 27 }).map((_, i) => (
        <mesh key={i} position={[-13 + i, 3.5, -6.45]}>
          <boxGeometry args={[0.05, 8.6, 0.02]} />
          <meshBasicMaterial color="#5a5e68" />
        </mesh>
      ))}
      {/* Spillway gates */}
      {[-9, -3, 3, 9].map((x, i) => (
        <group key={i} position={[x, 0.5, -6.5]}>
          <mesh>
            <boxGeometry args={[3, 2.5, 0.3]} />
            <meshStandardMaterial color="#3a4a5a" roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.2]}>
            <boxGeometry args={[2.6, 2.1, 0.05]} />
            <meshStandardMaterial color="#1a2a3a" />
          </mesh>
        </group>
      ))}
      {/* Powerhouse */}
      <mesh position={[0, -0.5, -4]} castShadow>
        <boxGeometry args={[32, 1.8, 1.5]} />
        <meshStandardMaterial color="#7a7e88" roughness={0.7} />
      </mesh>
      {/* Water surface */}
      <Water y={-1.2} />
      {/* Trees in foreground */}
      {Array.from({ length: 16 }).map((_, i) => {
        const x = -28 + i * 3.6 + (i % 2) * 0.8;
        const z = 12 + Math.random() * 4;
        return (
          <group key={'t' + i} position={[x, -1.2, z]}>
            <mesh position={[0, 0.5, 0]}>
              <coneGeometry args={[0.5, 1.4, 6]} />
              <meshStandardMaterial color="#3a5a3a" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.12, 0.16, 0.4, 6]} />
              <meshStandardMaterial color="#5a3a1a" roughness={0.95} />
            </mesh>
          </group>
        );
      })}
      {/* Title */}
      <Text position={[0, 8.5, -6.3]} fontSize={0.7} color="#ffffff" anchorX="center" anchorY="middle"
        outlineWidth={0.04} outlineColor="#1a2a3a">
        三峡大坝
      </Text>
      <Text position={[0, 7.7, -6.3]} fontSize={0.22} color="#c8d8e8" anchorX="center" anchorY="middle">
        高峡出平湖 · 世界第一水电工程
      </Text>
    </group>
  );
}
