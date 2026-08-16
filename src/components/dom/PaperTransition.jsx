import { useEffect, useState } from 'react';
import { useScene } from '../../context/SceneContext';

export default function PaperTransition() {
  const { teleportPhase, completeTeleport, openTeleportTransition, finishPaperOpen } = useScene();
  const [phase, setPhase] = useState('closed');

  useEffect(() => {
    if (teleportPhase === 'closing') setPhase('closing');
    else if (teleportPhase === 'opening') { setPhase('opening'); }
    else if (!teleportPhase) setPhase('closed');
  }, [teleportPhase]);

  return (
    <div className={'paper-transition ' + phase}>
      <div className="paper-top" />
      <div className="paper-bottom" />
    </div>
  );
}
