import { useRef, useEffect, useCallback } from 'react';
import type { PlotData, RoadData, TreeData, SpecialArea } from '../types';

/* ── colour palette ── */
const C = {
  bg: '#0f1019',
  ground: '#1c1e28',
  estate: '#24262f',
  road: '#3a3d47',
  roadLine: '#555962',
  roadLabel: '#7d8390',
  greenStrip: '#2a5228',
  available: '#c9ba8e',
  sold: '#783636',
  reserved: '#7a6b28',
  availBorder: '#a09060',
  soldBorder: '#5a2828',
  resBorder: '#6a5820',
  hover: '#ffffff',
  selected: '#3b82f6',
  selectedGlow: 'rgba(59,130,246,0.45)',
  plotText: '#2a2a2a',
  park: '#2d6b2e',
  kids: '#3a8a3f',
  common: '#4a4d55',
  entry: '#3b82f6',
  tree: '#2d6b1e',
  treeAlt: '#c45ba0',
};

const STATUS_FILL: Record<string, string> = { available: C.available, sold: C.sold, reserved: C.reserved };
const STATUS_STROKE: Record<string, string> = { available: C.availBorder, sold: C.soldBorder, reserved: C.resBorder };

interface Props {
  plots: PlotData[];
  roads: RoadData[];
  trees: TreeData[];
  specialAreas: SpecialArea[];
  selectedPlotId: string | null;
  filteredIds: Set<string>;
  onSelectPlot: (p: PlotData | null) => void;
  onHoverPlot: (p: PlotData | null) => void;
  focusPlotId: string | null;
  onFocusComplete: () => void;
}

export default function Canvas2DViewer({
  plots, roads, trees, specialAreas,
  selectedPlotId, filteredIds,
  onSelectPlot, onHoverPlot,
  focusPlotId, onFocusComplete,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewRef = useRef({ x: 0, y: -3, zoom: 9 });
  const dragRef = useRef({ active: false, sx: 0, sy: 0, vx: 0, vy: 0, moved: false });
  const hoverRef = useRef<string | null>(null);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const timeRef = useRef(0);

  /* ── coordinate helpers ── */
  const screenToWorld = useCallback((sx: number, sy: number) => {
    const v = viewRef.current, s = sizeRef.current;
    return {
      x: (sx - s.w / 2) / v.zoom + v.x,
      y: (sy - s.h / 2) / v.zoom + v.y,
    };
  }, []);

  const hitTest = useCallback((wx: number, wy: number): PlotData | null => {
    for (let i = plots.length - 1; i >= 0; i--) {
      const p = plots[i];
      if (!filteredIds.has(p.id)) continue;
      if (wx >= p.x && wx <= p.x + p.width && wy >= p.z && wy <= p.z + p.depth) return p;
    }
    return null;
  }, [plots, filteredIds]);

  /* ── render ── */
  const render = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    timeRef.current = time;

    const dpr = window.devicePixelRatio || 1;
    const w = sizeRef.current.w, h = sizeRef.current.h;
    const v = viewRef.current;

    // clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // fill bg
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // camera
    const s = v.zoom * dpr;
    const tx = (w * dpr / 2) - v.x * s;
    const ty = (h * dpr / 2) - v.y * s;
    ctx.setTransform(s, 0, 0, s, tx, ty);

    // estate ground
    ctx.fillStyle = C.estate;
    ctx.beginPath();
    ctx.roundRect(-56, -24, 122, 56, 1);
    ctx.fill();

    // roads
    roads.forEach(r => {
      const rx = r.x - r.width / 2;
      const ry = r.z - r.depth / 2;
      ctx.fillStyle = C.road;
      ctx.fillRect(rx, ry, r.width, r.depth);
      // center line
      ctx.strokeStyle = C.roadLine;
      ctx.lineWidth = 0.08;
      ctx.setLineDash([0.4, 0.3]);
      if (!r.labelRotation) {
        ctx.beginPath();
        ctx.moveTo(rx + r.width * 0.1, r.z);
        ctx.lineTo(rx + r.width * 0.9, r.z);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(r.x, ry + r.depth * 0.1);
        ctx.lineTo(r.x, ry + r.depth * 0.9);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // green strips (horizontal roads)
      if (!r.labelRotation) {
        ctx.fillStyle = C.greenStrip;
        ctx.fillRect(rx, ry - 0.5, r.width, 0.4);
        ctx.fillRect(rx, ry + r.depth + 0.1, r.width, 0.4);
      }

      // label
      if (r.label && v.zoom > 4) {
        ctx.save();
        ctx.translate(r.x, r.z);
        if (r.labelRotation) ctx.rotate(r.labelRotation);
        ctx.fillStyle = C.roadLabel;
        ctx.font = `500 ${0.7}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = Math.min(1, (v.zoom - 4) / 3);
        ctx.fillText(r.label, 0, 0);
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    });

    // special areas
    specialAreas.forEach(a => {
      const fills: Record<string, string> = { park: C.park, kidsPlay: C.kids, commonPlot: C.common, entry: C.entry };
      ctx.fillStyle = fills[a.type] || '#555';
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.roundRect(a.x, a.z, a.width, a.depth, 0.4);
      ctx.fill();
      ctx.globalAlpha = 1;
      // label
      if (v.zoom > 3) {
        ctx.fillStyle = '#fff';
        ctx.font = `600 ${0.7}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const lines = a.label.split('\n');
        lines.forEach((line, i) => {
          ctx.fillText(line, a.x + a.width / 2, a.z + a.depth / 2 + (i - (lines.length - 1) / 2) * 1);
        });
      }
    });

    // trees
    trees.forEach(t => {
      ctx.fillStyle = t.color;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(t.x, t.z, t.scale * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // plots
    const pulse = Math.sin(time * 0.003) * 0.5 + 0.5;
    plots.forEach(p => {
      if (!filteredIds.has(p.id)) return;
      const isSel = p.id === selectedPlotId;
      const isHov = p.id === hoverRef.current;

      // fill
      ctx.fillStyle = STATUS_FILL[p.status] || C.available;
      ctx.globalAlpha = (p.status === 'sold') ? 0.45 : (p.status === 'reserved') ? 0.55 : 0.8;
      ctx.beginPath();
      ctx.roundRect(p.x + 0.05, p.z + 0.05, p.width - 0.1, p.depth - 0.1, 0.15);
      ctx.fill();
      ctx.globalAlpha = 1;

      // border
      ctx.strokeStyle = isSel ? C.selected : isHov ? C.hover : (STATUS_STROKE[p.status] || '#555');
      ctx.lineWidth = isSel ? 0.15 : isHov ? 0.1 : 0.04;
      ctx.stroke();

      // selection glow
      if (isSel) {
        ctx.save();
        ctx.shadowColor = C.selectedGlow;
        ctx.shadowBlur = 6 + pulse * 4;
        ctx.strokeStyle = C.selected;
        ctx.lineWidth = 0.12;
        ctx.stroke();
        ctx.restore();
      }

      // hover glow
      if (isHov && !isSel) {
        ctx.save();
        ctx.shadowColor = 'rgba(255,255,255,0.3)';
        ctx.shadowBlur = 4;
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 0.08;
        ctx.stroke();
        ctx.restore();
      }

      // number
      if (v.zoom > 5) {
        ctx.fillStyle = isSel ? '#fff' : isHov ? '#fff' : C.plotText;
        const fs = Math.max(0.5, Math.min(1.0, p.width * 0.35));
        ctx.font = `600 ${fs}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = Math.min(1, (v.zoom - 5) / 3);
        ctx.fillText(p.number, p.x + p.width / 2, p.z + p.depth / 2);
        ctx.globalAlpha = 1;
      }
    });

    rafRef.current = requestAnimationFrame(render);
  }, [plots, roads, trees, specialAreas, selectedPlotId, filteredIds]);

  /* ── setup ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement!.getBoundingClientRect();
      sizeRef.current = { w: rect.width, h: rect.height };
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [render]);

  /* ── mouse ── */
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    dragRef.current = { active: true, sx: e.clientX - rect.left, sy: e.clientY - rect.top, vx: viewRef.current.x, vy: viewRef.current.y, moved: false };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const d = dragRef.current, v = viewRef.current;

    if (d.active) {
      const dx = mx - d.sx, dy = my - d.sy;
      if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
      v.x = d.vx - dx / v.zoom;
      v.y = d.vy - dy / v.zoom;
    } else {
      const w = screenToWorld(mx, my);
      const plot = hitTest(w.x, w.y);
      const newId = plot?.id ?? null;
      if (newId !== hoverRef.current) {
        hoverRef.current = newId;
        onHoverPlot(plot);
        canvasRef.current!.style.cursor = plot ? 'pointer' : 'grab';
      }
    }
  }, [screenToWorld, hitTest, onHoverPlot]);

  const onMouseUp = useCallback((e: React.MouseEvent) => {
    const d = dragRef.current;
    if (!d.moved) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const w = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
      const plot = hitTest(w.x, w.y);
      onSelectPlot(plot);
    }
    d.active = false;
  }, [screenToWorld, hitTest, onSelectPlot]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const v = viewRef.current;
    const wb = screenToWorld(mx, my);
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    v.zoom = Math.max(2, Math.min(60, v.zoom * factor));
    v.x = wb.x - (mx - sizeRef.current.w / 2) / v.zoom;
    v.y = wb.y - (my - sizeRef.current.h / 2) / v.zoom;
  }, [screenToWorld]);

  /* ── focus on plot ── */
  useEffect(() => {
    if (!focusPlotId) return;
    const plot = plots.find(p => p.id === focusPlotId);
    if (!plot) return;
    const tx = plot.x + plot.width / 2;
    const ty = plot.z + plot.depth / 2;
    const v = viewRef.current;
    const startX = v.x, startY = v.y, startZoom = v.zoom;
    const targetZoom = 18;
    let start = 0;
    const dur = 600;
    const anim = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      v.x = startX + (tx - startX) * ease;
      v.y = startY + (ty - startY) * ease;
      v.zoom = startZoom + (targetZoom - startZoom) * ease;
      if (p < 1) requestAnimationFrame(anim);
      else onFocusComplete();
    };
    requestAnimationFrame(anim);
  }, [focusPlotId, plots, onFocusComplete]);

  /* ── zoom buttons (exposed via ref-less callbacks ) ── */
  // The parent can call zoomIn/zoomOut via focusPlotId or buttons
  // We expose zoom by listening to custom events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleZoom = (e: Event) => {
      const dir = (e as CustomEvent).detail;
      const v = viewRef.current;
      v.zoom = Math.max(2, Math.min(60, v.zoom * (dir > 0 ? 1.3 : 0.77)));
    };
    canvas.addEventListener('custom-zoom', handleZoom);
    return () => canvas.removeEventListener('custom-zoom', handleZoom);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={() => { dragRef.current.active = false; }}
      onWheel={onWheel}
    />
  );
}
