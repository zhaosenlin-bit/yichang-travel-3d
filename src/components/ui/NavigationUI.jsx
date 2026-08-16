import { useState } from 'react';
import { useScene } from '../../context/SceneContext';
import { attractions } from '../../data/attractions';
import MapOverlay from './MapOverlay';

export default function NavigationUI() {
  const { hasEntered, currentRoom, teleportTo, exitRoom, isInRoom } = useScene();
  const [mapOpen, setMapOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!hasEntered) return null;

  return (
    <>
      <div className="nav-top">
        <div className="nav-brand">
          <span className="logo-mark">🚢</span>
          <span className="logo-text">宜昌旅游 3D</span>
        </div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={() => setMapOpen(true)} aria-label="地图">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 2v6l-6 2v12l6-2 6 2 6-2V2l-6 2-6-2z" />
              <path d="M9 2v18M15 4v18" />
            </svg>
            <span>地图</span>
          </button>
          <button className="nav-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="菜单">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span>菜单</span>
          </button>
          {isInRoom && (
            <button className="nav-btn primary" onClick={exitRoom} aria-label="返回走廊">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>返走廊</span>
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="nav-menu" onClick={() => setMenuOpen(false)}>
          <div className="nav-menu-panel" onClick={e => e.stopPropagation()}>
            <h3>关于本站</h3>
            <p>沉浸式 3D 宜昌旅游 — 用 WebGL 渲染峡江山水与四大标志性景点。</p>
            <p>滚动鼠标可在走廊中前进；点击侧门进入房间；点击地图传送。</p>
            <h4>技术栈</h4>
            <ul>
              <li>React 18 + Vite 5</li>
              <li>Three.js / React Three Fiber / Drei</li>
              <li>GSAP 动画</li>
              <li>完全程序化生成 3D 场景</li>
            </ul>
            <button className="close-btn" onClick={() => setMenuOpen(false)}>关闭</button>
          </div>
        </div>
      )}

      <MapOverlay
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        currentRoom={currentRoom}
        onPick={(id) => { setMapOpen(false); teleportTo(id); }}
      />

      {isInRoom && <RoomInfoPanel id={currentRoom} />}
    </>
  );
}

function RoomInfoPanel({ id }) {
  const a = attractions.find(x => x.id === id);
  if (!a) return null;
  return (
    <div className="room-info">
      <h2>{a.name}</h2>
      <p className="tagline">{a.tagline}</p>
      <p className="intro">{a.intro}</p>
      <div className="facts">
        {a.facts.map((f, i) => (<div key={i} className="fact"><span>{f.k}</span><b>{f.v}</b></div>))}
      </div>
      <div className="tips">
        <h4>游玩贴士</h4>
        <ul>{a.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </div>
    </div>
  );
}
