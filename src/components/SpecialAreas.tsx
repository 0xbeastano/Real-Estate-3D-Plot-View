import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { SpecialArea } from '../types';

interface SpecialAreasProps {
  areas: SpecialArea[];
}

const ParkArea = ({ area }: { area: SpecialArea }) => (
  <group>
    {/* Green ground */}
    <mesh position={[area.x, 0.03, area.z]} receiveShadow>
      <boxGeometry args={[area.width, 0.06, area.depth]} />
      <meshStandardMaterial color={area.color} roughness={0.85} />
    </mesh>
    {/* Circular path / fountain */}
    <mesh position={[area.x, 0.07, area.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.2, 1.8, 24]} />
      <meshStandardMaterial color="#6b7b5c" roughness={0.7} side={THREE.DoubleSide} />
    </mesh>
    {/* Center circle */}
    <mesh position={[area.x, 0.08, area.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.0, 20]} />
      <meshStandardMaterial color="#7a8a6a" roughness={0.6} />
    </mesh>
    {/* Label */}
    <Text
      position={[area.x, 0.12, area.z + 2.5]}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={0.7}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      fillOpacity={0.9}
      fontWeight="bold"
    >
      {area.label}
    </Text>
  </group>
);

const KidsPlayArea = ({ area }: { area: SpecialArea }) => (
  <group>
    <mesh position={[area.x, 0.03, area.z]} receiveShadow>
      <boxGeometry args={[area.width, 0.06, area.depth]} />
      <meshStandardMaterial color={area.color} roughness={0.85} />
    </mesh>
    {/* Play structure */}
    <mesh position={[area.x, 0.4, area.z]}>
      <boxGeometry args={[1.5, 0.8, 1.5]} />
      <meshStandardMaterial color="#e8c547" roughness={0.6} />
    </mesh>
    <Text
      position={[area.x, 0.12, area.z + 2.5]}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={0.6}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      fillOpacity={0.9}
      fontWeight="bold"
    >
      {area.label}
    </Text>
  </group>
);

const CommonPlot = ({ area }: { area: SpecialArea }) => (
  <group>
    <mesh position={[area.x, 0.02, area.z]} receiveShadow>
      <boxGeometry args={[area.width, 0.04, area.depth]} />
      <meshStandardMaterial color={area.color} roughness={0.9} />
    </mesh>
    <Text
      position={[area.x, 0.08, area.z]}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={0.9}
      color="#9ca3af"
      anchorX="center"
      anchorY="middle"
      fillOpacity={0.7}
    >
      {area.label}
    </Text>
  </group>
);

const EntryMarker = ({ area }: { area: SpecialArea }) => (
  <group>
    <mesh position={[area.x, 0.03, area.z]} receiveShadow>
      <boxGeometry args={[area.width, 0.06, area.depth]} />
      <meshStandardMaterial color={area.color} roughness={0.6} metalness={0.2} />
    </mesh>
    {/* Entry gate pillars */}
    <mesh position={[area.x - 1.2, 1, area.z]} castShadow>
      <boxGeometry args={[0.3, 2, 0.3]} />
      <meshStandardMaterial color="#9ca3af" roughness={0.4} metalness={0.3} />
    </mesh>
    <mesh position={[area.x + 1.2, 1, area.z]} castShadow>
      <boxGeometry args={[0.3, 2, 0.3]} />
      <meshStandardMaterial color="#9ca3af" roughness={0.4} metalness={0.3} />
    </mesh>
    <Text
      position={[area.x, 0.12, area.z + 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={0.8}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      fontWeight="bold"
    >
      {area.label}
    </Text>
  </group>
);

export const SpecialAreas: React.FC<SpecialAreasProps> = ({ areas }) => {
  return (
    <group>
      {areas.map((area) => {
        switch (area.type) {
          case 'park': return <ParkArea key={area.id} area={area} />;
          case 'kidsPlay': return <KidsPlayArea key={area.id} area={area} />;
          case 'commonPlot': return <CommonPlot key={area.id} area={area} />;
          case 'entry': return <EntryMarker key={area.id} area={area} />;
          default: return null;
        }
      })}
    </group>
  );
};
