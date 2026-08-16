import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

export default function Preloader({ ready, onComplete }) {
  const { progress } = useProgress();
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (ready && progress >= 100) {
      const t = setTimeout(() => setHidden(true), 400);
      const t2 = setTimeout(() => { setMounted(false); onComplete && onComplete(); }, 1100);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
  }, [ready, progress, onComplete]);

  if (!mounted) return null;
  return (
    <div className={'preloader' + (hidden ? ' hidden' : '')}>
      <div className="preloader-inner">
        <svg className="preloader-logo" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" className="ring" />
          <path d="M 30 65 Q 50 30 70 65 T 70 65" className="wave" />
        </svg>
        <div className="preloader-text">宜昌旅游 3D</div>
        <div className="preloader-progress">{Math.round(progress)}%</div>
        <div className="preloader-tip">{ready ? '场景就绪' : '加载场景中…'}</div>
      </div>
    </div>
  );
}
