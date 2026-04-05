import { Suspense, useEffect, useRef, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import type { PlotData } from '../types';
import { allPlots, roads, trees, specialAreas } from '../data/layoutData';
import { PlotMesh } from './PlotMesh';
import { Roads } from './Roads';
import { Trees } from './Trees';
import { SpecialAreas } from './SpecialAreas';

export type ViewMode = '2D' | '3D' | 'SIDE';

interface SceneProps {
  viewMode: ViewMode;
  selectedPlot: PlotData | null;
  onSelectPlot: (plot: PlotData | null) => void;
  filteredPlots: PlotData[];
}

const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -5]} receiveShadow>
    <planeGeometry args={[160, 80]} />
    <meshStandardMaterial color="#2c2f33" roughness={0.95} metalness={0.0} />
  </mesh>
);

const EstateBorder = () => (
  <mesh position={[5, 0.005, -5]} receiveShadow>
    <boxGeometry args={[130, 0.01, 55]} />
    <meshStandardMaterial color="#3a3d41" roughness={0.9} />
  </mesh>
);

export const Scene: React.FC<SceneProps> = ({ viewMode, selectedPlot, onSelectPlot, filteredPlots }) => {
  const controlsRef = useRef<CameraControls>(null);
  
  // Calculate the bounding box of the entire layout based on plot data.
  // This ensures the camera can frame everything perfectly regardless of layout changes.
  const layoutBox = useMemo(() => {
    const box = new THREE.Box3();
    allPlots.forEach(p => {
      box.expandByPoint(new THREE.Vector3(p.x, 0, p.z));
      box.expandByPoint(new THREE.Vector3(p.x + p.width, 2, p.z + p.depth));
    });
    // Add amenities/specials to bounds
    specialAreas.forEach(a => {
      box.expandByPoint(new THREE.Vector3(a.x, 0, a.z));
      box.expandByPoint(new THREE.Vector3(a.x + a.width, 2, a.z + a.depth));
    });
    return box;
  }, []);

  // Frame logic for view switching
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const center = new THREE.Vector3();
    layoutBox.getCenter(center);
    
    // Smooth transition
    controls.smoothTime = 0.4;
    controls.draggingSmoothTime = 0.1;

    // Base settings common to all modes unless restricted
    controls.minDistance = 5;
    controls.maxDistance = 150;
    
    // Clear restrictions
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.mouseButtons.left = 1; // 1 = ROTATE

    if (selectedPlot) {
      // Step 4: FOCUS ON SELECTED PLOT
      const cx = selectedPlot.x + selectedPlot.width / 2;
      const cz = selectedPlot.z + selectedPlot.depth / 2;

      if (viewMode === '2D') {
        controls.setLookAt(cx, 30, cz, cx, 0, cz, true);
        // Lock rotation in 2D mode
        controls.mouseButtons.left = 2; // 2 = TRUCK
        controls.maxPolarAngle = 0.001; 
      } else if (viewMode === 'SIDE') {
        controls.setLookAt(cx + 15, 8, cz + 15, cx, 0, cz, true);
        controls.maxPolarAngle = Math.PI / 2 - 0.05; // Ground limit
      } else {
        // Default 3D
        controls.setLookAt(cx + 8, 12, cz + 12, cx, 0, cz, true);
        controls.maxPolarAngle = Math.PI / 2 - 0.05;
      }
    } else {
      // Step 1: AUTO CENTER + FIT VIEW
      if (viewMode === '2D') {
        // 2D MODE: Top-down, rotation locked
        controls.mouseButtons.left = 2; // 2 = TRUCK
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = 0.001; // Lock near pure top-down
        
        // Use fitToBox to frame the entire layout perfectly from top
        controls.fitToBox(layoutBox, true, { paddingTop: 2, paddingBottom: 2, paddingLeft: 2, paddingRight: 2 });
      } else if (viewMode === 'SIDE') {
        // SIDE VIEW: Side angle, slight elevation
        controls.maxPolarAngle = Math.PI / 2.2; 
        controls.setLookAt(center.x + 60, 20, center.z + 50, center.x, center.y, center.z, true);
      } else {
        // 3D MODE: Angle perspective, full control, padded
        controls.maxPolarAngle = Math.PI / 2 - 0.05; 
        controls.setLookAt(center.x + 30, 40, center.z + 40, center.x, center.y, center.z, true);
      }
    }
  }, [viewMode, selectedPlot, layoutBox]);

  const filteredIds = new Set(filteredPlots.map(p => p.id));

  return (
    <>
      {/* 
        Step 6 & 7: CameraControls manages restrictions smoothly via lerping,
        providing professional standard interactions (rotation, pan bounding, damping)
      */}
      <CameraControls ref={controlsRef} makeDefault />

      <ambientLight intensity={0.6} color="#c8d0e0" />
      <directionalLight
        position={[20, 40, 20]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={150}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />
      <directionalLight position={[-15, 20, -10]} intensity={0.3} color="#94b8ff" />
      <hemisphereLight args={['#1a1a2e', '#0a0a0f', 0.4]} />

      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 80, 160]} />

      <Suspense fallback={null}>
        <Ground />
        <EstateBorder />
        <Roads roads={roads} />
        <Trees trees={trees} />
        <SpecialAreas areas={specialAreas} />

        {allPlots.map((plot) => {
          if (!filteredIds.has(plot.id)) return null;
          return (
            <PlotMesh
              key={plot.id}
              data={plot}
              isSelected={selectedPlot?.id === plot.id}
              onSelect={onSelectPlot}
            />
          );
        })}
      </Suspense>
    </>
  );
};
