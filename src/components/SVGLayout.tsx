import React, { useState, useRef, useEffect } from 'react';
import { plotsData, roadsData, amenitiesData, boundaryData } from '../data/plots';
import { useStore } from '../store/useStore';

export function SVGLayout() {
  const { selectedPlot, setSelectedPlot, hoveredPlot, setHoveredPlot } = useStore();
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Handle Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    const newScale = Math.min(Math.max(0.5, transform.scale * (1 + delta)), 5);
    
    // Zoom towards mouse pointer
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const scaleRatio = newScale / transform.scale;
      
      setTransform(prev => ({
        x: mouseX - (mouseX - prev.x) * scaleRatio,
        y: mouseY - (mouseY - prev.y) * scaleRatio,
        scale: newScale
      }));
    }
  };

  // Handle Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    
    setTransform(prev => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Center layout on mount or when no plot is selected
  useEffect(() => {
    if (!selectedPlot && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      // Layout is roughly 1000x1000, let's scale it to fit
      const scale = Math.min(rect.width / 1000, rect.height / 1000) * 0.9;
      const x = (rect.width - 1000 * scale) / 2;
      const y = (rect.height - 1000 * scale) / 2;
      setTransform({ x, y, scale });
    } else if (selectedPlot && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const cx = selectedPlot.center[0];
      const cy = selectedPlot.center[1];
      
      // Target scale when zooming into a plot
      const targetScale = 2.5;
      
      // Calculate new x and y to center the plot
      // Offset slightly to the left to account for the right side panel
      const isMobile = window.innerWidth < 768;
      const offsetX = isMobile ? 0 : 200; // pixels
      
      const x = (rect.width - offsetX) / 2 - cx * targetScale;
      const y = rect.height / 2 - cy * targetScale;
      
      // Smooth transition would be nice, but for now just set it
      setTransform({ x, y, scale: targetScale });
    }
  }, [selectedPlot]);

  // Helper to generate path string from coordinates
  const getPath = (coords: [number, number][]) => {
    if (coords.length === 0) return '';
    return `M ${coords[0][0]} ${coords[0][1]} ` + 
           coords.slice(1).map(c => `L ${c[0]} ${c[1]}`).join(' ') + 
           ' Z';
  };

  return (
    <div 
      className="w-full h-full bg-[#f0f0f0] overflow-hidden cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg 
        ref={svgRef}
        width="100%" 
        height="100%" 
        style={{ touchAction: 'none' }}
      >
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          
          {/* Boundary */}
          <path 
            d={getPath(boundaryData)} 
            fill="#e8e8e8" 
            stroke="#999" 
            strokeWidth="2" 
          />

          {/* Roads */}
          {roadsData.map((road, i) => (
            <path 
              key={`road-${i}`}
              d={getPath(road.coordinates)}
              fill="#d0d0d0"
              stroke="#b0b0b0"
              strokeWidth="1"
            />
          ))}

          {/* Amenities */}
          {amenitiesData.map((amenity, i) => {
            let fill = '#aed581'; // park
            if (amenity.type === 'kids-play') fill = '#81c784';
            if (amenity.type === 'common-plot') fill = '#e0e0e0';
            
            return (
              <path 
                key={`amenity-${i}`}
                d={getPath(amenity.coordinates)}
                fill={fill}
                stroke="#7cb342"
                strokeWidth="1"
              />
            );
          })}

          {/* Plots */}
          {plotsData.map((plot) => {
            const isSelected = selectedPlot?.id === plot.id;
            const isHovered = hoveredPlot === plot.id;
            
            let fill = '#ffffff';
            if (plot.status === 'sold') fill = '#ffcdd2';
            if (plot.status === 'reserved') fill = '#fff9c4';
            if (isSelected) fill = '#bbdefb';
            else if (isHovered) fill = '#e3f2fd';

            // Calculate center for text
            const minX = Math.min(...plot.coordinates.map(c => c[0]));
            const maxX = Math.max(...plot.coordinates.map(c => c[0]));
            const minY = Math.min(...plot.coordinates.map(c => c[1]));
            const maxY = Math.max(...plot.coordinates.map(c => c[1]));
            const centerX = minX + (maxX - minX) / 2;
            const centerY = minY + (maxY - minY) / 2;

            return (
              <g 
                key={`plot-${plot.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlot(plot);
                }}
                onMouseEnter={() => setHoveredPlot(plot.id)}
                onMouseLeave={() => setHoveredPlot(null)}
                style={{ cursor: 'pointer' }}
              >
                <path 
                  d={getPath(plot.coordinates)}
                  fill={fill}
                  stroke={isSelected ? '#1976d2' : '#757575'}
                  strokeWidth={isSelected ? "2" : "1"}
                  className="transition-colors duration-200"
                />
                <text 
                  x={centerX} 
                  y={centerY} 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="#333"
                  pointerEvents="none"
                  fontWeight={isSelected ? "bold" : "normal"}
                >
                  {plot.id}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
