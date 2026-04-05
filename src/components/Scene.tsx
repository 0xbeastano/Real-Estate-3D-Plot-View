import { Suspense, useEffect, useRef, useMemo } from 'react';
import { CameraControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
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
  showStatus: boolean;
  showCategories: boolean;
  onCameraChange: (rot: number) => void;
}

const CompassSync = ({ onCameraChange }: { onCameraChange: (rot: number) => void }) => {
  const { camera } = useThree();
  useFrame(() => {
    // Basic azimuthal rotation calculation
    const rot = Math.atan2(camera.position.x, camera.position.z);
    onCameraChange(rot);
  });
  return null;
};

const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -5]} receiveShadow>
    <planeGeometry args={[160, 80]} />
    <meshStandardMaterial color="#111111" roughness={0.8} />
  </mesh>
);

const EstateBorder = () => (
  <mesh position={[5, 0.005, -5]} receiveShadow>
    <boxGeometry args={[130, 0.01, 55]} />
    <meshStandardMaterial color="#3a3d41" roughness={0.9} />
  </mesh>
);

export const Scene: React.FC<SceneProps> = ({ 
  viewMode, 
  selectedPlot, 
  onSelectPlot, 
  filteredPlots, 
  showStatus, 
  showCategories, 
  onCameraChange 
}) => {
  const controlsRef = useRef<CameraControls>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Calculate the bounding box of the entire layout based on plot data.
  const layoutBox = useMemo(() => {
    const box = new THREE.Box3();
    allPlots.forEach(p => {
      box.expandByPoint(new THREE.Vector3(p.x, 0, p.z));
      box.expandByPoint(new THREE.Vector3(p.x + p.width, 2, p.z + p.depth));
    });
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
    
    controls.smoothTime = isMobile ? 0.6 : 0.8;
    controls.draggingSmoothTime = 0.3;
    controls.truckSpeed = isMobile ? 0.8 : 1.2;
    controls.dollySpeed = isMobile ? 0.3 : 0.4; 
    controls.azimuthRotateSpeed = 0.5;
    controls.polarRotateSpeed = 0.5;

    controls.minDistance = 5;
    controls.maxDistance = 150;
    
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.mouseButtons.left = 1; 

    if (selectedPlot) {
      const cx = selectedPlot.x + selectedPlot.width / 2;
      const cz = selectedPlot.z + selectedPlot.depth / 2;

      if (viewMode === '2D') {
        controls.setLookAt(cx, 30, cz, cx, 0, cz, true);
        controls.mouseButtons.left = 2; 
        controls.maxPolarAngle = 0.001; 
      } else if (viewMode === 'SIDE') {
        controls.setLookAt(cx + 15, 8, cz + 15, cx, 0, cz, true);
        controls.maxPolarAngle = Math.PI / 2 - 0.05;
      } else {
        controls.setLookAt(cx + 8, 12, cz + 12, cx, 0, cz, true);
        controls.maxPolarAngle = Math.PI / 2 - 0.05;
      }
    } else {
      if (viewMode === '2D') {
        controls.mouseButtons.left = 2; 
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = 0.001;
        controls.fitToBox(layoutBox, true, { paddingTop: 2, paddingBottom: 2, paddingLeft: 2, paddingRight: 2 });
      } else if (viewMode === 'SIDE') {
        controls.maxPolarAngle = Math.PI / 2.2; 
        controls.setLookAt(center.x + 60, 20, center.z + 50, center.x, center.y, center.z, true);
      } else {
        controls.maxPolarAngle = Math.PI / 2 - 0.05; 
        controls.setLookAt(center.x + 30, 40, center.z + 40, center.x, center.y, center.z, true);
      }
    }
  }, [viewMode, selectedPlot, layoutBox, isMobile]);

  const filteredIds = new Set(filteredPlots.map(p => p.id));

  return (
    <>
      <CameraControls
        ref={controlsRef}
        makeDefault
      />
      <CompassSync onCameraChange={onCameraChange} />

      <ambientLight intensity={isMobile ? 0.6 : 0.4} color="#ffffff" />
      <directionalLight
        position={[15, 25, 10]}
        intensity={1.2}
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [512, 512] : [1024, 1024]}
        shadow-camera-far={80}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-10, 10, -10]} intensity={0.3} color="#8bb5ff" />
      <hemisphereLight args={['#1a1a2e', '#0f0f0f', 0.5]} />

      <color attach="background" args={['#0f0f0f']} />
      <fogExp2 attach="fog" args={['#0f0f0f', 0.035]} />

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
              showStatus={showStatus}
              showCategories={showCategories}
            />
          );
        })}
      </Suspense>
    </>
  );
};
