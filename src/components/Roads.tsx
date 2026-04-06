import { Text } from '@react-three/drei';
import type { RoadData } from '../types';

interface DashLineProps {
  width: number;
  depth: number;
  rotation?: number;
}

const DashLine: React.FC<DashLineProps> = ({ width, depth, rotation }) => {
  const isVertical = rotation && Math.abs(rotation) > Math.PI / 4;
  const length = isVertical ? depth : width;
  const dashCount = Math.floor(length / 2);
  const dashWidth = isVertical ? 0.08 : 0.8;
  const dashDepth = isVertical ? 0.8 : 0.08;
  const gap = length / dashCount;

  return (
    <group rotation={[0, rotation || 0, 0]}>
      {Array.from({ length: dashCount }).map((_, i) => (
        <mesh 
          key={i} 
          position={[isVertical ? 0 : -length / 2 + i * gap + gap/2, 0.05, isVertical ? -length / 2 + i * gap + gap/2 : 0]}
        >
          <boxGeometry args={[dashWidth, 0.01, dashDepth]} />
          <meshStandardMaterial color="#555555" roughness={1} />
        </mesh>
      ))}
    </group>
  );
};

interface RoadsProps {
  roads: RoadData[];
}

export const Roads: React.FC<RoadsProps> = ({ roads }) => {
  return (
    <group>
      {roads.map((road) => (
        <group key={road.id} position={[road.x, 0, road.z]}>
          {/* Road surface */}
          <mesh position={[0, 0.02, 0]} receiveShadow>
            <boxGeometry args={[road.width, 0.04, road.depth]} />
            <meshStandardMaterial color="#1a1b1e" roughness={0.95} metalness={0.0} />
          </mesh>

          {/* Dash line */}
          <DashLine width={road.width} depth={road.depth} rotation={road.labelRotation} />

          {/* Green edge strips */}
          {!road.labelRotation && (
            <>
              <mesh position={[0, 0.03, -road.depth / 2 - 0.25]}>
                <boxGeometry args={[road.width, 0.02, 0.4]} />
                <meshStandardMaterial color="#1a3d1b" roughness={0.9} />
              </mesh>
              <mesh position={[0, 0.03, road.depth / 2 + 0.25]}>
                <boxGeometry args={[road.width, 0.02, 0.4]} />
                <meshStandardMaterial color="#1a3d1b" roughness={0.9} />
              </mesh>
            </>
          )}

          {/* Road label */}
          {road.label && (
            <Text
              position={[0, 0.08, 0]}
              rotation={[-Math.PI / 2, 0, road.labelRotation || 0]}
              fontSize={0.85}
              color="#666666"
              font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6rjS3F9VMBPQ.woff2"
              anchorX="center"
              anchorY="middle"
              fillOpacity={0.6}
            >
              {road.label}
            </Text>
          )}
        </group>
      ))}
    </group>
  );
};
