import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { PLOTS, type PlotData } from './data/plotsData';
import './index.css';

const SitePlan: React.FC = () => {
  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);
  const [search, setSearch] = useState('');
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 2400, h: 1000 });
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const pinchDist = useRef<number | null>(null);

  // Conversion helpers
  const clientToSVG = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: viewBox.x + (clientX - rect.left) / rect.width * viewBox.w,
      y: viewBox.y + (clientY - rect.top) / rect.height * viewBox.h,
    };
  }, [viewBox]);

  const clampViewBox = useCallback((vb: typeof viewBox) => {
    return {
      ...vb,
      x: Math.max(-400, Math.min(2800 - vb.w, vb.x)),
      y: Math.max(-200, Math.min(1200 - vb.h, vb.y)),
    };
  }, []);

  const handleZoom = useCallback((factor: number, cx: number, cy: number) => {
    setViewBox((prev) => {
      const maxZoom = 8;
      const minZoom = 0.4;
      const newW = Math.min(Math.max(prev.w / factor, 2400 / maxZoom), 2400 / minZoom);
      const newH = newW * (1000 / 2400);
      const ratio = newW / prev.w;
      const newX = cx - (cx - prev.x) * ratio;
      const newY = cy - (cy - prev.y) * ratio;
      return clampViewBox({ x: newX, y: newY, w: newW, h: newH });
    });
  }, [clampViewBox]);

  const handlePan = useCallback((dx: number, dy: number) => {
    setViewBox((prev) => clampViewBox({ ...prev, x: prev.x - dx, y: prev.y - dy }));
  }, [clampViewBox]);

  // Event Listeners
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 0.87;
      const c = clientToSVG(e.clientX, e.clientY);
      handleZoom(factor, c.x, c.y);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !lastPointer.current) return;
      const rect = svg.getBoundingClientRect();
      const scaleX = viewBox.w / rect.width;
      const scaleY = viewBox.h / rect.height;
      handlePan((e.clientX - lastPointer.current.x) * scaleX, (e.clientY - lastPointer.current.y) * scaleY);
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging.current = false;
      lastPointer.current = null;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchDist.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      } else if (e.touches.length === 1) {
        lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchDist.current) {
        const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const c = clientToSVG(midX, midY);
        handleZoom(dist / pinchDist.current, c.x, c.y);
        pinchDist.current = dist;
      } else if (e.touches.length === 1 && lastPointer.current) {
        const rect = svg.getBoundingClientRect();
        const scaleX = viewBox.w / rect.width;
        const scaleY = viewBox.h / rect.height;
        handlePan((e.touches[0].clientX - lastPointer.current.x) * scaleX, (e.touches[0].clientY - lastPointer.current.y) * scaleY);
        lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    svg.addEventListener('wheel', onWheel, { passive: false });
    svg.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    svg.addEventListener('touchstart', onTouchStart, { passive: true });
    svg.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);

    return () => {
      svg.removeEventListener('wheel', onWheel);
      svg.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      svg.removeEventListener('touchstart', onTouchStart);
      svg.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [clientToSVG, handlePan, handleZoom, viewBox.h, viewBox.w]);

  // Focus on plot handler
  const focusOnPlot = useCallback((plot: PlotData) => {
    setSelectedPlot(plot);
    const padding = 250;
    const targetW = plot.w + padding * 2;
    const targetH = targetW * (1000 / 2400);
    setViewBox(clampViewBox({
      x: plot.x - padding,
      y: plot.y - padding,
      w: targetW,
      h: targetH,
    }));
  }, [clampViewBox]);

  const searchResults = useMemo(() => {
    if (!search) return [];
    return PLOTS.filter(p => p.number.includes(search)).slice(0, 5);
  }, [search]);

  return (
    <div className="viewer-shell">
      {/* ── TOP BAR ── */}
      <header className="top-bar">
        <div className="brand">
          PREETHI ESTATES
          <span className="brand-sub">SITE PLAN — DTCP APPROVED</span>
        </div>
        <div className="header-right">
          <button className="btn-zoom" onClick={() => handleZoom(1.5, viewBox.x + viewBox.w / 2, viewBox.y + viewBox.h / 2)}>+</button>
          <button className="btn-zoom" onClick={() => handleZoom(0.7, viewBox.x + viewBox.w / 2, viewBox.y + viewBox.h / 2)}>−</button>
          <button className="btn-zoom" onClick={() => setViewBox({ x: 0, y: 0, w: 2400, h: 1000 })}>⊡</button>
          <button className="btn-share">↑ SHARE</button>
        </div>
      </header>

      {/* ── MAIN SVG DRAWING AREA ── */}
      <div id="drawing-container">
        <svg
          ref={svgRef}
          id="site-plan"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker id="arrow-dim" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--dim-line)"/>
            </marker>
            <filter id="glow-selected" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* GROUND */}
          <polygon points="0,0 2400,0 2400,1000 0,1000" fill="var(--bg)"/>
          <polygon points="80,220 2340,140 2340,820 80,960" fill="#0d0d0d" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />

          {/* ROADS */}
          <g id="layer-roads">
            <rect x="80" y="220" width="2260" height="120" fill="var(--road-12m)"/>
            <line x1="80" y1="280" x2="2340" y2="280" stroke="var(--road-line)" strokeWidth="1.5" strokeDasharray="20,12"/>
            <text x="800" y="275" className="road-label">12 Meter Road</text>
            
            <rect x="390" y="340" width="120" height="580" fill="var(--road-12m)"/>
            <rect x="640" y="340" width="120" height="520" fill="var(--road-12m)"/>
            <rect x="950" y="340" width="90" height="480" fill="var(--road-9m)"/>
            <rect x="1230" y="340" width="80" height="440" fill="var(--road-8m)"/>
            <rect x="1510" y="340" width="80" height="380" fill="var(--road-8m)"/>
            <rect x="1780" y="340" width="90" height="280" fill="var(--road-9m)"/>
          </g>

          {/* PLOTS */}
          <g id="layer-plots">
            {PLOTS.map(plot => (
              <rect
                key={plot.id}
                x={plot.x}
                y={plot.y}
                width={plot.w}
                height={plot.h}
                className={`plot-unit ${plot.status}`}
                fill={selectedPlot?.id === plot.id ? 'var(--plot-selected)' : `var(--plot-${plot.status})`}
                stroke={selectedPlot?.id === plot.id ? 'var(--plot-selected-stroke)' : `var(--plot-${plot.status}-stroke)`}
                strokeWidth={selectedPlot?.id === plot.id ? 3 : 1.5}
                filter={selectedPlot?.id === plot.id ? 'url(#glow-selected)' : ''}
                onClick={() => focusOnPlot(plot)}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              />
            ))}
          </g>

          {/* LABELS */}
          <g id="layer-labels">
            {PLOTS.map(plot => (
              <text
                key={`label-${plot.id}`}
                x={plot.x + plot.w/2}
                y={plot.y + plot.h/2}
                className="plot-number"
                fill={selectedPlot?.id === plot.id ? '#fff' : 'rgba(255,255,255,0.7)'}
              >
                {plot.number}
              </text>
            ))}
          </g>

          {/* AMENITIES */}
          <g id="layer-amenities">
            <rect x="90" y="840" width="280" height="200" fill="var(--park-fill)" stroke="var(--park-stroke)" strokeWidth="1.5" rx="8"/>
            <text x="230" y="940" className="amenity-label">PARK AREA</text>
          </g>

          {/* DIMENSIONS */}
          <g className="dimension">
            <line x1="82" y1="210" x2="82" y2="348" stroke="var(--dim-line)" strokeWidth="1.5" markerStart="url(#arrow-dim)" markerEnd="url(#arrow-dim)"/>
            <text x="60" y="285" className="dim-text" transform="rotate(-90,60,285)">12.00 M</text>
          </g>

          {/* TITLE BLOCK */}
          <g id="title-block" transform="translate(1820, 850)">
              <rect width="420" height="70" fill="rgba(10,10,10,0.9)" stroke="rgba(255,255,255,0.1)"/>
              <text x="210" y="30" textAnchor="middle" fill="#fff" fontWeight="800" letterSpacing="2">PREETHI ESTATES</text>
              <text x="210" y="50" textAnchor="middle" fill="var(--text-muted)" fontSize="10">SITE PLAN — RESIDENTIAL LAYOUT</text>
          </g>
        </svg>

        {/* PLOT INFO PANEL */}
        <aside id="plot-panel" hidden={!selectedPlot}>
          {selectedPlot && (
            <>
              <button className="panel-close" onClick={() => setSelectedPlot(null)}>×</button>
              <div className="panel-plot-no">Plot #{selectedPlot.number}</div>
              <div className={`status-badge ${selectedPlot.status}`}>{selectedPlot.status}</div>
              <div className="panel-grid">
                <div className="panel-cell"><label>AREA</label><span>{selectedPlot.area} SQ.FT</span></div>
                <div className="panel-cell"><label>PRICE</label><span>{selectedPlot.price}</span></div>
                <div className="panel-cell"><label>FACING</label><span>{selectedPlot.facing}</span></div>
                <div className="panel-cell"><label>TYPE</label><span>{selectedPlot.type}</span></div>
              </div>
              <div className="panel-actions">
                <button className="btn-book" disabled={selectedPlot.status === 'sold'}>BOOK NOW</button>
                <button className="btn-contact">CONTACT</button>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* ── BOTTOM TOOLBAR ── */}
      <footer className="bottom-toolbar">
        <div className="legend">
          <span className="leg-item"><span className="leg-dot available"></span>Available</span>
          <span className="leg-item"><span className="leg-dot sold"></span>Sold</span>
          <span className="leg-item"><span className="leg-dot corner"></span>Corner</span>
        </div>
        
        <div className="search-wrap">
          <input
            type="search"
            placeholder="Search plot..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, background: '#111', padding: 8, border: '1px solid var(--border)', borderRadius: 8 }}>
              {searchResults.map(p => (
                <div key={p.id} onClick={() => { focusOnPlot(p); setSearch(''); }} style={{ padding: 8, cursor: 'pointer' }}>Plot #{p.number}</div>
              ))}
            </div>
          )}
        </div>

        <div className="tab-group">
          <button className="tab-btn">GALLERY</button>
          <button className="tab-btn">INFO</button>
          <button className="tab-btn" onClick={() => setViewBox({ x: 0, y: 0, w: 2400, h: 1000 })}>LOCATE</button>
        </div>
      </footer>
    </div>
  );
};

export default SitePlan;
