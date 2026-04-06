import { useState, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import './index.css';
import type { PlotData } from './types';
import { allPlots } from './data/layoutData';
import { Scene, type ViewMode } from './components/Scene';

/* ── icons (inline SVG) ── */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const GalleryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);
const LocateIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg>
);
const ResetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
);

const GALLERY_IMAGES = [
  'estate-site-gallery-img1.png', 'estate-site-gallery-img2.png',
  'estate-site-gallery-img3.png', 'estate-site-gallery-img4.png',
  'estate-site-gallery-img5.png', 'estate-site-gallery-img6.png',
];

export default function App() {
  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('3D');
  const [showStatus, setShowStatus] = useState(true);

  const filteredPlots = allPlots;

  /* ── search ── */
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return allPlots.filter(p => p.number.toLowerCase().includes(q)).slice(0, 12);
  }, [search]);

  /* ── search ── */

  /* ── format ── */
  const fmt = (n: number) => '₹' + (n / 1000).toFixed(0) + 'K';

  const handleFocusPlot = useCallback((plot: PlotData | null) => {
    setSelectedPlot(plot);
    setSearch('');
    setShowSearch(false);
  }, []);

  return (
    <div className="viewer-shell">
      {/* ── STEP 5: CANVAS RESPONSIVENESS ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Canvas
          camera={{ position: [0, 40, 35], fov: 45 }}
          style={{ width: '100%', height: '100%', display: 'block' }}
          gl={{ antialias: true, logarithmicDepthBuffer: true }}
          shadows
        >
          <Scene
            viewMode={viewMode}
            selectedPlot={selectedPlot}
            onSelectPlot={handleFocusPlot}
            filteredPlots={filteredPlots}
            showStatus={showStatus}
          />
        </Canvas>
      </div>

      {/* ── TOP BAR ── */}
      <div className="top-bar">
        <div className="logo-badge">
          <div className="title">PREETHI ESTATES</div>
          <div className="subtitle">Premium Plotting Collection</div>
        </div>
        <button className="pill-btn" style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.1)' }}>
          <ShareIcon /> SHARE
        </button>
      </div>

      {/* ── SIDE TOGGLES (Bottom Left) ── */}
      <div className="side-toggles">
        <div className="toggle-item" onClick={() => setShowStatus(!showStatus)}>
          <span>STATUS</span>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: showStatus ? 'var(--green)' : 'var(--text-muted)' }} />
        </div>
      </div>

      {/* ── CAMERA CONTROLS (Bottom Right) ── */}
      <div className="camera-controls">
        <button className={`camera-btn ${viewMode === '2D' ? 'active' : ''}`} onClick={() => setViewMode('2D')}>2D</button>
        <button className={`camera-btn ${viewMode === '3D' ? 'active' : ''}`} onClick={() => setViewMode('3D')}>3D</button>
        <button className={`camera-btn ${viewMode === 'SIDE' ? 'active' : ''}`} onClick={() => setViewMode('SIDE')}>SD</button>
        <button className="camera-btn" onClick={() => { setSelectedPlot(null); setViewMode('3D'); }}>
          <ResetIcon />
        </button>
      </div>

      {/* ── FLOATING SEARCH BAR (Bottom Center) ── */}
      <div className="search-container">
        <div className="search-wrap">
          <SearchIcon />
          <input
            className="search-input"
            placeholder="Search Plot Number..."
            value={search}
            onFocus={() => setShowSearch(true)}
            onChange={e => { setSearch(e.target.value); setShowSearch(true); }}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
          />
          {showSearch && searchResults.length > 0 && (
            <div className="search-results glass-panel" style={{ bottom: '100%', top: 'auto', marginBottom: 16 }}>
              {searchResults.map(p => (
                <div key={p.id} className="search-item" onMouseDown={() => handleFocusPlot(p)}>
                  <span>
                    <span className="plot-num">#{p.number}</span>
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{fmt(p.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── INFO PANEL ── */}
      <div className={`info-panel glass-panel ${selectedPlot ? 'open' : ''}`} 
           style={{ pointerEvents: selectedPlot ? 'auto' : 'none', right: 24, top: 100 }}>
        {selectedPlot && (
          <>
            <div className="info-header">
              <h3>Plot #{selectedPlot.number}</h3>
              <button className="info-close" onClick={() => setSelectedPlot(null)}><XIcon /></button>
            </div>
            <div className="info-body">
              <div className={`info-status-badge ${selectedPlot.status}`}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: selectedPlot.status === 'available' ? 'var(--green)' :
                    selectedPlot.status === 'sold' ? 'var(--red)' : 'var(--yellow)'
                }} />
                {selectedPlot.status}
              </div>

              <div className="info-grid">
                <div className="info-cell">
                  <div className="label">Area</div>
                  <div className="value">{selectedPlot.area} <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>sq ft</span></div>
                </div>
                <div className="info-cell">
                  <div className="label">Price</div>
                  <div className="value">{fmt(selectedPlot.price)}</div>
                </div>
              </div>

              <div className="info-actions">
                <button className="info-btn primary">BOOK NOW</button>
                <button className="info-btn">CONTACT</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── MAIN NAVIGATION ── */}
      <div className="bottom-nav">
        <button className="pill-btn" onClick={() => setGalleryOpen(true)}>
          <GalleryIcon /> GALLERY
        </button>
        <button className="pill-btn" onClick={() => {}}>
          <InfoIcon /> INFO
        </button>
        <button className="pill-btn" onClick={() => setSelectedPlot(allPlots[0])}>
          <LocateIcon /> LOCATE
        </button>
      </div>

      {/* ── GALLERY MODAL ── */}
      {galleryOpen && (
        <div className="gallery-overlay" onClick={e => { if (e.target === e.currentTarget) setGalleryOpen(false); }}>
          <div className="gallery-container glass-panel">
            <div className="gallery-header">
              <h2>Site Gallery</h2>
              <button className="info-close" onClick={() => setGalleryOpen(false)}><XIcon /></button>
            </div>
            <div className="gallery-grid">
              {GALLERY_IMAGES.map((img, i) => (
                <img key={i} className="gallery-img" src={`/${img}`} alt={`Gallery view ${i + 1}`}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
