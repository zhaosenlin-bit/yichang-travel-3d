import { createContext, useContext, useState, useRef, useCallback, useMemo, useEffect } from 'react';

const SceneContext = createContext(null);

export function SceneProvider({ children }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [overlayContent, setOverlayContent] = useState(null);
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [teleportPhase, setTeleportPhase] = useState(null);
  const [pendingDoorClick, setPendingDoorClick] = useState(null);
  const teleportTarget = useRef(null);
  const deeplinkHandled = useRef(false);
  const initialRoom = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search).get('room');
    if (p) initialRoom.current = p;
  }, []);

  const enterRoom = useCallback((roomId) => {
    setCurrentRoom(roomId);
    setIsTeleporting(false);
    setTeleportPhase(null);
    setPendingDoorClick(null);
  }, []);

  const exitRoom = useCallback(() => {
    setCurrentRoom(null);
    setPendingDoorClick(null);
  }, []);

  const markEntered = useCallback(() => setHasEntered(true), []);

  const teleportTo = useCallback((roomId) => {
    if (isTeleporting || roomId === currentRoom) return;
    teleportTarget.current = roomId;
    setIsTeleporting(true);
    setTeleportPhase('closing');
  }, [isTeleporting, currentRoom]);

  const startTeleportTransition = useCallback(() => setTeleportPhase('teleporting'), []);
  const openTeleportTransition = useCallback(() => setTeleportPhase('opening'), []);
  const finishPaperOpen = useCallback(() => setTeleportPhase(null), []);
  const completeTeleport = useCallback(() => {
    setPendingDoorClick(teleportTarget.current);
    teleportTarget.current = null;
  }, []);

  const openOverlay = useCallback((content) => setOverlayContent(content), []);
  const closeOverlay = useCallback(() => setOverlayContent(null), []);

  const value = useMemo(() => ({
    hasEntered, currentRoom, overlayContent, isTeleporting, teleportPhase, pendingDoorClick,
    initialRoom: initialRoom.current, deeplinkHandled,
    isInRoom: currentRoom !== null,
    enterRoom, exitRoom, markEntered, teleportTo,
    startTeleportTransition, openTeleportTransition, completeTeleport, finishPaperOpen,
    openOverlay, closeOverlay,
  }), [hasEntered, currentRoom, overlayContent, isTeleporting, teleportPhase, pendingDoorClick,
      enterRoom, exitRoom, markEntered, teleportTo,
      startTeleportTransition, openTeleportTransition, completeTeleport, finishPaperOpen,
      openOverlay, closeOverlay]);

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

export const useScene = () => {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error('useScene must be used within SceneProvider');
  return ctx;
};
