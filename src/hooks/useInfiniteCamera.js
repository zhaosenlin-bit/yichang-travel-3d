import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export default function useInfiniteCamera({
  segmentLength = 80,
  scrollSpeed = 0.04,
  parallaxIntensity = 0.6,
  smoothing = 0.08,
  scrollEnabled = true,
  parallaxEnabled = true,
} = {}) {
  const { camera, gl } = useThree();
  const targetZ = useRef(28);
  const targetX = useRef(0);
  const targetY = useRef(0.2);
  const mouseRef = useRef({ x: 0, y: 0 });
  const overrideRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onWheel = (e) => {
      if (!scrollEnabled || overrideRef.current) return;
      targetZ.current = Math.max(0, Math.min(segmentLength, targetZ.current + e.deltaY * scrollSpeed * 0.01));
    };
    const onMouse = (e) => {
      if (!parallaxEnabled) return;
      const r = gl.domElement.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouseRef.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('mousemove', onMouse);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('mousemove', onMouse);
    };
  }, [segmentLength, scrollSpeed, scrollEnabled, parallaxEnabled, gl]);

  useFrame(() => {
    if (overrideRef.current) {
      const o = overrideRef.current;
      camera.position.x += (o.x - camera.position.x) * smoothing;
      camera.position.y += (o.y - camera.position.y) * smoothing;
      camera.position.z += (o.z - camera.position.z) * smoothing;
      if (o.lookAt) camera.lookAt(o.lookAt[0], o.lookAt[1], o.lookAt[2]);
      const dx = Math.abs(o.x - camera.position.x);
      const dy = Math.abs(o.y - camera.position.y);
      const dz = Math.abs(o.z - camera.position.z);
      if (dx < 0.01 && dy < 0.01 && dz < 0.01) {
        if (o.onArrive) o.onArrive();
        overrideRef.current = null;
      }
      return;
    }
    const pm = parallaxEnabled ? parallaxIntensity : 0;
    const desX = targetX.current + mouseRef.current.x * pm;
    const desY = targetY.current + mouseRef.current.y * pm * 0.4;
    const desZ = targetZ.current;
    camera.position.x += (desX - camera.position.x) * smoothing;
    camera.position.y += (desY - camera.position.y) * smoothing;
    camera.position.z += (desZ - camera.position.z) * smoothing;
    camera.lookAt(0, 0.2, camera.position.z - 5);
  });

  return {
    setCameraOverride: (override) => { overrideRef.current = override; },
    getCurrentZ: () => targetZ.current,
  };
}
