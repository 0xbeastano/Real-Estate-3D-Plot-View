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
  const [selectedCategory, setSelectedCategory] = useState<PlotData['category'] | 'All'>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('3D');
  const [showStatus, setShowStatus] = useState(true);

  const filteredPlots = useMemo(() => {
    if (selectedCategory === 'All') return allPlots;
    return allPlots.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  /* ── search ── */
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return allPlots.filter(p => 
      p.number.toLowerCase().includes(q) || 
      p.block.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 10);
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

      {/* 1. TOP BAR */}
      <div className="top-bar">
        <div className="logo-badge">
          <div className="title">PREETHI ESTATES</div>
          <div className="subtitle">Premium Plotting Collection</div>
        </div>
        <button className="btn-share" onClick={() => {}}>
          <ShareIcon /> SHARE
        </button>
      </div>

      {/* 2. VIEW TOGGLE (Vertical) */}
      <div className="view-toggle">
        <button className={`view-btn ${viewMode === '2D' ? 'active' : ''}`} onClick={() => setViewMode('2D')}>2D</button>
        <button className={`view-btn ${viewMode === '3D' ? 'active' : ''}`} onClick={() => setViewMode('3D')}>3D</button>
        <button className={`view-btn ${viewMode === 'SIDE' ? 'active' : ''}`} onClick={() => setViewMode('SIDE')}>SD</button>
      </div>

      {/* RESET CAMERA */}
      <button className="btn-reset-cam" onClick={() => { setSelectedPlot(null); setViewMode('3D'); }}>
        <ResetIcon />
      </button>

      {/* 3. PLOT INFO PANEL */}
      <div className={`info-panel ${selectedPlot ? 'open' : ''}`}>
        {selectedPlot && (
          <>
            <div className="info-header">
              <h3>Plot #{selectedPlot.number}</h3>
              <button className="info-close" onClick={() => setSelectedPlot(null)}><XIcon /></button>
            </div>
            
            <div className={`status-badge ${selectedPlot.status}`}>
              <span className="status-dot" />
              {selectedPlot.status.toUpperCase()}
            </div>

            <div className="info-grid">
              <div className="info-cell">
                <div className="label">AREA</div>
                <div className="value">{selectedPlot.area} <small>sq ft</small></div>
              </div>
              <div className="info-cell">
                <div className="label">PRICE</div>
                <div className="value">{fmt(selectedPlot.price)}</div>
              </div>
            </div>

            <button className="btn-book" disabled={selectedPlot.status === 'sold'}>BOOK NOW</button>
            
            <div className="panel-meta" style={{ marginTop: '1.5rem' }}>
              <div className="meta-item"><span>Facing</span><span>East</span></div>
              <div className="meta-item"><span>Dimensions</span><span>30×40 ft</span></div>
              <div className="meta-item"><span>Road Width</span><span>12M Road</span></div>
            </div>
          </>
        )}
      </div>

      {/* 4. BOTTOM CONTROLS CLUSTER */}
      <div className="ui-controls-root">
        {/* RIGHT CLUSTER: SEARCH & FILTER */}
        <div className="controls-group-right">
          <div className="filter-pill-stack">
            <div className="filter-pill">
              <span>Categories</span>
              <button 
                className={`switch-btn ${selectedCategory !== 'All' ? 'on' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === 'All' ? 'Residential' : 'All')}
              />
            </div>
            <div className="filter-pill">
              <span>Status</span>
              <button 
                className={`switch-btn ${showStatus ? 'on' : ''}`}
                onClick={() => setShowStatus(!showStatus)}
              />
            </div>
          </div>

          <div className="floating-search">
            <SearchIcon />
            <input
              placeholder="Search Plot..."
              value={search}
              onFocus={() => setShowSearch(true)}
              onChange={e => { setSearch(e.target.value); setShowSearch(true); }}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            />
            {showSearch && searchResults.length > 0 && (
              <div className="floating-results">
                {searchResults.map(p => (
                  <div key={p.id} className="search-item" onMouseDown={() => handleFocusPlot(p)}>
                    <div className="search-item-main">
                      <span className="num">#{p.number}</span>
                      <span className="blk">Block {p.block}</span>
                    </div>
                    <span className={`stat ${p.status}`}>{p.status.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER BOTTOM: ACTION TABS */}
        <div className="floating-tabs">
          <button className="tab-pill" onClick={() => setGalleryOpen(true)}>
            <GalleryIcon /> <span>Gallery</span>
          </button>
          <button className="tab-pill" onClick={() => setSelectedPlot(allPlots[0])}>
            <InfoIcon /> <span>Info</span>
          </button>
          <button className="tab-pill primary" onClick={() => setSelectedPlot(allPlots[80])}>
            <LocateIcon /> <span>LOCATE</span>
          </button>
        </div>
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
