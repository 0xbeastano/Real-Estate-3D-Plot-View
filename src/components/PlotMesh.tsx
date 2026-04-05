import { useRef, useState, useMemo } from 'react';
import { useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { PlotData } from '../types';

interface PlotMeshProps {
  data: PlotData;
  isSelected: boolean;
  onSelect: (plot: PlotData) => void;
  showStatus: boolean;
}

const statusColors: Record<string, string> = {
  available: '#22c55e', // Master Prompt Green
  sold: '#ef4444',      // Master Prompt Red
  corner: '#eab308',    // Master Prompt Yellow/Gold
};

const neutralColor = '#1e1e1e';
const selectedColor = '#38bdf8'; // Master Prompt Sky Blue

export const PlotMesh: React.FC<PlotMeshProps> = ({ data, isSelected, onSelect, showStatus }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const baseColor = useMemo(() => new THREE.Color(showStatus ? (statusColors[data.status] || '#555555') : neutralColor), [data.status, showStatus]);
  const highlightColor = useMemo(() => new THREE.Color(selectedColor), []);
  const hoveredColor = useMemo(() => new THREE.Color('#333333'), []);

  const elevation = isSelected ? 0.45 : hovered ? 0.15 : 0.05;
  const plotHeight = 0.25;

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const target = isSelected ? highlightColor : hovered ? hoveredColor : baseColor;
    mat.color.lerp(target, delta * 8);
    mat.emissiveIntensity = isSelected ? 0.5 : hovered ? 0.2 : 0;
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, elevation, delta * 8);
  });

  return (
    <group>
      {/* Plot surface */}
      <mesh
        ref={meshRef}
        position={[data.x + data.width / 2, elevation, data.z + data.depth / 2]}
        onClick={(e) => { e.stopPropagation(); onSelect(data); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[data.width, plotHeight, data.depth]} />
        <meshStandardMaterial
          roughness={0.4}
          metalness={0.2}
          transparent={!showStatus}
          opacity={showStatus ? 1 : 0.8}
          emissive={isSelected ? selectedColor : '#000000'}
        />
      </mesh>

      <lineSegments position={[data.x + data.width / 2, elevation + 0.13, data.z + data.depth / 2]}>
        <edgesGeometry args={[new THREE.BoxGeometry(data.width, plotHeight, data.depth)]} />
        <lineBasicMaterial color={isSelected ? '#ffffff' : '#444444'} transparent opacity={isSelected ? 1 : 0.4} />
      </lineSegments>

      {/* Plot number label */}
      <Text
        position={[data.x + data.width / 2, elevation + 0.2, data.z + data.depth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={Math.min(data.width, data.depth) * 0.35}
        color={isSelected ? '#ffffff' : 'rgba(0,0,0,0.8)'}
        font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mDoQDj3S50pg7EbD8C-0nc7VfV.woff2"
        anchorX="center"
        anchorY="middle"
      >
        {data.number}
      </Text>
    </group>
  );
};
