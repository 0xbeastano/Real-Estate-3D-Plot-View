import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { SpecialArea } from '../types';

interface SpecialAreasProps {
  areas: SpecialArea[];
}

const ParkArea = ({ area }: { area: SpecialArea }) => (
  <group>
    {/* Green ground with higher quality grass material */}
    <mesh position={[area.x, 0.03, area.z]} receiveShadow>
      <boxGeometry args={[area.width, 0.06, area.depth]} />
      <meshStandardMaterial color={area.color} roughness={0.9} metalness={0.0} />
    </mesh>
    {/* Decorative paths matching image curves */}
    <mesh position={[area.x, 0.07, area.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.5, 2.5, 32]} />
      <meshStandardMaterial color="#333" roughness={0.7} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[area.x + 2, 0.07, area.z + 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.0, 1.8, 32]} />
      <meshStandardMaterial color="#333" roughness={0.7} side={THREE.DoubleSide} />
    </mesh>
    {/* Central feature / Monument */}
    <mesh position={[area.x, 0.4, area.z]} castShadow>
      <cylinderGeometry args={[0.5, 0.8, 0.8, 16]} />
      <meshStandardMaterial color="#888" roughness={0.5} metalness={0.5} />
    </mesh>
    {/* Label */}
    <Text
      position={[area.x, 0.15, area.z + 3]}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={0.9}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      fillOpacity={1.0}
      font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6rjS3F9VMBPQ.woff2"
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
      <meshStandardMaterial color={area.color} roughness={0.8} />
    </mesh>
    {/* Play structure details (Tower + Slides) */}
    <mesh position={[area.x - 1, 0.6, area.z]} castShadow>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color="#ff6b6b" />
    </mesh>
    <mesh position={[area.x + 1, 0.6, area.z]} castShadow>
      <cylinderGeometry args={[0.6, 0.6, 1.2, 8]} />
      <meshStandardMaterial color="#4ecdc4" />
    </mesh>
    <Text
      position={[area.x, 0.15, area.z + 3]}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={0.8}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      fillOpacity={1.0}
      font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6rjS3F9VMBPQ.woff2"
      fontWeight="bold"
    >
      {area.label}
    </Text>
  </group>
);

const CommonPlot = ({ area }: { area: SpecialArea }) => (
  <group>
    {/* Common area stylized as a utility zone or slab */}
    <mesh position={[area.x, 0.02, area.z]} receiveShadow>
      <boxGeometry args={[area.width, 0.04, area.depth]} />
      <meshStandardMaterial color="#222" roughness={0.9} />
    </mesh>
    <Text
      position={[area.x, 0.2, area.z]}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={1.2}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      fillOpacity={1.0}
      font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6rjS3F9VMBPQ.woff2"
      fontWeight={700}
    >
      {area.label}
    </Text>
  </group>
);

const EntryMarker = ({ area }: { area: SpecialArea }) => (
  <group>
    {/* Foundation */}
    <mesh position={[area.x, 0.03, area.z]} receiveShadow>
      <boxGeometry args={[area.width, 0.06, area.depth]} />
      <meshStandardMaterial color="#111" />
    </mesh>
    {/* High-fidelity gate pillars */}
    <mesh position={[area.x - 1.5, 1.5, area.z]} castShadow>
      <boxGeometry args={[0.5, 3, 0.5]} />
      <meshStandardMaterial color="#333" roughness={0.2} metalness={0.8} />
    </mesh>
    <mesh position={[area.x + 1.5, 1.5, area.z]} castShadow>
      <boxGeometry args={[0.5, 3, 0.5]} />
      <meshStandardMaterial color="#333" roughness={0.2} metalness={0.8} />
    </mesh>
    {/* Overhead beam */}
    <mesh position={[area.x, 3.2, area.z]} castShadow>
      <boxGeometry args={[3.5, 0.4, 0.5]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    <Text
      position={[area.x, 0.15, area.z + 2.5]}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={1.0}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      fontWeight="bold"
      font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6rjS3F9VMBPQ.woff2"
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
