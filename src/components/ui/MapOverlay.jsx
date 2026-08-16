import { attractions } from '../../data/attractions';

export default function MapOverlay({ open, onClose, currentRoom, onPick }) {
  if (!open) return null;
  const positions = [
    { left: '20%', top: '60%' },
    { left: '38%', top: '38%' },
    { left: '52%', top: '72%' },
    { left: '72%', top: '55%' },
  ];
  return (
    <div className="map-overlay" onClick={onClose}>
      <div className="map-panel" onClick={e => e.stopPropagation()}>
        <div className="map-header">
          <h3>宜昌景点地图</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="map-body">
          <svg className="map-svg" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a1525" />
                <stop offset="100%" stopColor="#1a2030" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="400" height="280" fill="url(#sky)" />
            {/* Yangtze */}
            <path d="M 0 150 Q 80 130 150 150 T 280 150 T 400 160" stroke="#4a90e2" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.6" />
            <path d="M 0 150 Q 80 130 150 150 T 280 150 T 400 160" stroke="#7ec8f5" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Mountains */}
            <path d="M 30 130 L 60 60 L 90 130 Z" fill="#5a5a4a" />
            <path d="M 80 130 L 130 35 L 180 130 Z" fill="#4a4a3a" />
            <path d="M 200 130 L 250 50 L 300 130 Z" fill="#5a5a4a" />
            <path d="M 300 130 L 350 70 L 400 130 Z" fill="#4a4a3a" />
            {/* City */}
            <rect x="170" y="160" width="60" height="40" fill="#2a2a3a" stroke="#d4a050" strokeWidth="0.8" />
            <text x="200" y="184" fontSize="9" fill="#f0d090" textAnchor="middle">宜昌</text>
          </svg>
          <div className="map-pins">
            {attractions.map((a, i) => {
              const pos = positions[i] || positions[0];
              const active = currentRoom === a.id;
              return (
                <button key={a.id}
                  className={'map-pin' + (active ? ' active' : '')}
                  style={{ left: pos.left, top: pos.top, backgroundColor: a.color, borderColor: a.accent }}
                  onClick={() => onPick(a.id)}>
                  <span className="pin-name">{a.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        <p className="map-hint">点击景点标记传送</p>
      </div>
    </div>
  );
}
