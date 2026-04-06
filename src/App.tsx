import { useState, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import './index.css';
import type { PlotData } from './types';
import { allPlots } from './data/layoutData';
import { Scene, type ViewMode } from './components/Scene';

/* ── icons ── */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const ResetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
);

/* ── Modal & UI State ── */
type ModalType = 'none' | 'gallery' | 'info' | 'locate';

export default function App() {
  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [viewMode, setViewMode] = useState<ViewMode>('3D');
  const [showStatus, setShowStatus] = useState(true);
  const [legendOpen, setLegendOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: '', visible: false });

  const filteredPlots = allPlots;

  /* ── search ── */
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return allPlots.filter(p => p.number.toLowerCase().includes(q)).slice(0, 10);
  }, [search]);

  const handleSelectPlot = useCallback((plot: PlotData | null) => {
    setSelectedPlot(plot);
    setSearch('');
    setShowSearch(false);
  }, []);

  const showToast = (msg: string) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard');
  };

  return (
    <div className="viewer-shell">
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Canvas
          camera={{ position: [0, 45, 45], fov: 42 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true, logarithmicDepthBuffer: true, stencil: false }}
          shadows
        >
          <Scene
            viewMode={viewMode}
            selectedPlot={selectedPlot}
            onSelectPlot={handleSelectPlot}
            filteredPlots={filteredPlots}
            showStatus={showStatus}
          />
        </Canvas>
      </div>

      {/* ── TOP BAR (Branded) ── */}
      <div className="top-bar">
        <div className="brand" style={{ pointerEvents: 'auto' }}>
          <div className="brand-logo" style={{ background: 'var(--accent)', borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 3L4 9v12h16V9l-8-6z"/></svg>
          </div>
          <div className="brand-text">
            <div className="brand-name">PREETHI ESTATES</div>
            <div className="brand-sub">LUXURY PLOTS • KARAD</div>
          </div>
        </div>
        <button className="btn-share" onClick={handleShare}>
          <ShareIcon /> SHARE
        </button>
      </div>

      {/* ── PLOT PANEL (Desktop Right / Mobile Bottom Sheet) ── */}
      <div className={`info-panel glass-panel ${selectedPlot ? 'open' : ''}`}>
        {selectedPlot && (
          <>
            <div className="info-header">
              <h3>Plot #{selectedPlot.number}</h3>
              <button className="info-close" onClick={() => setSelectedPlot(null)}><XIcon /></button>
            </div>
            <div className="info-body" style={{ padding: 'var(--space-4)' }}>
              <div className={`info-status-badge ${selectedPlot.status}`}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
                {selectedPlot.status.toUpperCase()}
              </div>

              <div className="info-grid" style={{ marginTop: 'var(--space-4)' }}>
                <div className="info-cell">
                  <div className="label">Area</div>
                  <div className="value">{selectedPlot.area} <small>sq.ft</small></div>
                </div>
                <div className="info-cell">
                  <div className="label">Facing</div>
                  <div className="value">{selectedPlot.facing || 'East'}</div>
                </div>
                <div className="info-cell">
                  <div className="label">Dimensions</div>
                  <div className="value">{selectedPlot.dims || '30x40'}</div>
                </div>
                <div className="info-cell">
                  <div className="label">Starting Price</div>
                  <div className="value" style={{ color: '#fff' }}>₹{(selectedPlot.price / 1000).toFixed(0)}K</div>
                </div>
              </div>

              <div className="info-actions" style={{ marginTop: 'var(--space-5)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <button className="info-btn primary" onClick={() => showToast('Booking request sent!')}>BOOK NOW</button>
                <button className="info-btn" onClick={() => showToast('Contacting agent...')}>CONTACT</button>
              </div>

              <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Road Access: <strong>{selectedPlot.roadWidth || '9m'} Road</strong>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── CAMERA MODE TOGGLES ── */}
      <div className="view-toggle">
        {(['2D', '3D', 'SIDE'] as ViewMode[]).map(m => (
          <button 
            key={m} 
            className={`view-btn ${viewMode === m ? 'active' : ''}`}
            onClick={() => setViewMode(m)}
          >
            {m === 'SIDE' ? 'SD' : m}
          </button>
        ))}
      </div>

      <button className="btn-reset-cam" onClick={() => { setSelectedPlot(null); setViewMode('3D'); }}>
        <ResetIcon />
      </button>

      {/* ── BOTTOM CONTROLS (Status + Search) ── */}
      <div className="bottom-controls">
        <div className="bottom-row-1">
          <div className="status-legend">
            <button className="legend-toggle" onClick={() => setLegendOpen(!legendOpen)}>
              <div className="legend-indicator" />
              STATUS
            </button>
            {legendOpen && (
              <div className="legend-popup glass-panel">
                <div className="legend-item"><div className="legend-color" style={{ background: 'var(--green)' }} /> Available</div>
                <div className="legend-item"><div className="legend-color" style={{ background: 'var(--red)' }} /> Sold</div>
                <div className="legend-item"><div className="legend-color" style={{ background: 'var(--yellow)' }} /> Reserved</div>
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
                    <input type="checkbox" checked={showStatus} onChange={() => setShowStatus(!showStatus)} />
                    Show on Map
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="search-wrapper">
            <SearchIcon />
            <input 
              className="search-input"
              placeholder="Locate Plot Number..."
              value={search}
              onFocus={() => setShowSearch(true)}
              onChange={e => setSearch(e.target.value)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            />
            {showSearch && searchResults.length > 0 && (
              <div className="search-results glass-panel">
                {searchResults.map(p => (
                  <div key={p.id} className="search-result-item" onMouseDown={() => handleSelectPlot(p)}>
                    <span>Plot #{p.number}</span>
                    <span style={{ fontSize: 11, color: p.status === 'available' ? 'var(--green)' : 'var(--text-muted)' }}>
                      {p.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER TAB NAVIGATION ── */}
        <div className="bottom-tabs">
          <button className={`tab-btn ${activeModal === 'gallery' ? 'active' : ''}`} onClick={() => setActiveModal('gallery')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            <span>GALLERY</span>
          </button>
          <button className={`tab-btn ${activeModal === 'info' ? 'active' : ''}`} onClick={() => setActiveModal('info')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>INFO</span>
          </button>
          <button className={`tab-btn ${activeModal === 'locate' ? 'active' : ''}`} onClick={() => setActiveModal('locate')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>LOCATE</span>
          </button>
        </div>
      </div>

      {/* ── MODALS ── */}
      {activeModal !== 'none' && (
        <div className="modal-overlay" onClick={() => setActiveModal('none')}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
             <button className="modal-close" onClick={() => setActiveModal('none')}><XIcon /></button>
             
             {activeModal === 'gallery' && (
               <div className="modal-content">
                  <h2 style={{ fontFamily: 'Space Grotesk', marginBottom: 'var(--space-4)' }}>Project Gallery</h2>
                  <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} style={{ aspectRatio: '4/3', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {activeModal === 'info' && (
               <div className="modal-content">
                  <h2 style={{ fontFamily: 'Space Grotesk', marginBottom: 'var(--space-4)' }}>Project Information</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {[
                      ['Project', 'Preethi Estates'],
                      ['Location', 'Karad North, MH'],
                      ['Total Units', '114 Premium Plots'],
                      ['Status', 'RERA Approved'],
                      ['Launch', 'Q3 2024'],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                        <span style={{ fontWeight: 600 }}>{val}</span>
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {activeModal === 'locate' && (
               <div className="modal-content" style={{ textAlign: 'center' }}>
                  <h2 style={{ fontFamily: 'Space Grotesk', marginBottom: 'var(--space-4)' }}>Find Us</h2>
                  <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', display: 'grid', placeItems: 'center', marginBottom: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-secondary)' }}>MAP VIEW PORT</div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    Karad-Satara Hwy, Near Riverside Mall, Karad 415110
                  </p>
               </div>
             )}
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      <div className={`toast ${toast.visible ? 'visible' : ''}`}>
        {toast.msg}
      </div>
    </div>
  );
}
