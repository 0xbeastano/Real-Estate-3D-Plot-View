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
  available: '#1bb16b', // Emerald Green
  sold: '#eb5757',      // Coral Red
  reserved: '#f2c94c',  // Golden Yellow
};

const neutralColor = '#2a2a2a';
const selectedColor = '#2d9cdb'; // Sky Blue

export const PlotMesh: React.FC<PlotMeshProps> = ({ data, isSelected, onSelect, showStatus }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const baseColor = useMemo(() => new THREE.Color(showStatus ? (statusColors[data.status] || '#555555') : neutralColor), [data.status, showStatus]);
  const highlightColor = useMemo(() => new THREE.Color(selectedColor), []);
  const hoveredColor = useMemo(() => new THREE.Color('#444444'), []);

  const elevation = isSelected ? 0.6 : hovered ? 0.3 : 0.05;

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
        <boxGeometry args={[data.width, 0.12, data.depth]} />
        <meshStandardMaterial
          roughness={0.4}
          metalness={0.2}
          transparent={!showStatus}
          opacity={showStatus ? 1 : 0.8}
          emissive={isSelected ? selectedColor : '#000000'}
        />
      </mesh>

      {/* Border */}
      <lineSegments position={[data.x + data.width / 2, elevation + 0.08, data.z + data.depth / 2]}>
        <edgesGeometry args={[new THREE.BoxGeometry(data.width, 0.12, data.depth)]} />
        <lineBasicMaterial color={isSelected ? '#ffffff' : '#444444'} transparent opacity={isSelected ? 1 : 0.4} />
      </lineSegments>

      {/* Plot number label */}
      <Text
        position={[data.x + data.width / 2, elevation + 0.15, data.z + data.depth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={Math.min(data.width, data.depth) * 0.32}
        color={isSelected ? '#ffffff' : '#3a3a3a'}
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.85}
      >
        {data.number}
      </Text>
    </group>
  );
};
