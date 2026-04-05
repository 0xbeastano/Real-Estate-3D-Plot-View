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
}

const statusColors: Record<string, string> = {
  available: '#d4c5a0',
  sold: '#c9a882',
  reserved: '#bfb898',
};

export const PlotMesh: React.FC<PlotMeshProps> = ({ data, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const baseColor = useMemo(() => new THREE.Color(statusColors[data.status] || '#d4c5a0'), [data.status]);
  const selectedColor = useMemo(() => new THREE.Color('#5bb8f5'), []);
  const hoveredColor = useMemo(() => new THREE.Color('#e8ddc0'), []);

  const borderColor = isSelected ? '#ffffff' : '#555555';
  const elevation = isSelected ? 0.35 : hovered ? 0.2 : 0.06;

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const target = isSelected ? selectedColor : hovered ? hoveredColor : baseColor;
    mat.color.lerp(target, delta * 8);
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
          color={baseColor}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Border */}
      <lineSegments position={[data.x + data.width / 2, elevation + 0.07, data.z + data.depth / 2]}>
        <edgesGeometry args={[new THREE.BoxGeometry(data.width, 0.12, data.depth)]} />
        <lineBasicMaterial color={borderColor} transparent opacity={0.6} />
      </lineSegments>

      {/* Plot number label */}
      <Text
        position={[data.x + data.width / 2, elevation + 0.15, data.z + data.depth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={Math.min(data.width, data.depth) * 0.32}
        color={isSelected ? '#ffffff' : '#3a3a3a'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
        fillOpacity={0.85}
      >
        {data.number}
      </Text>
    </group>
  );
};
