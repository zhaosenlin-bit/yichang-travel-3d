import { useState, useCallback, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, Preload } from '@react-three/drei';
import { SceneProvider } from './context/SceneContext';
import NavigationUI from './components/ui/NavigationUI';
import Preloader from './components/dom/Preloader';
import PaperTransition from './components/dom/PaperTransition';

const Experience = lazy(() => import('./components/canvas/Experience'));

export default function App() {
  const [sceneReady, setSceneReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [dpr, setDpr] = useState(1.5);

  const handleReady = useCallback(() => setSceneReady(true), []);

  return (
    <SceneProvider>
      <div className="app">
        <div className="canvas-wrapper">
          <Canvas
            camera={{ position: [0, 0.2, 28], fov: 60, near: 0.1, far: 150 }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            dpr={dpr}
            shadows
          >
            <color attach="background" args={['#0b0b10']} />
            <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(2)} />
            <Suspense fallback={null}>
              <Experience onReady={handleReady} />
              <Preload all />
            </Suspense>
          </Canvas>
        </div>
        {loaded && <NavigationUI />}
        {loaded && <PaperTransition />}
        <Preloader ready={sceneReady} onComplete={() => setLoaded(true)} />
      </div>
    </SceneProvider>
  );
}
