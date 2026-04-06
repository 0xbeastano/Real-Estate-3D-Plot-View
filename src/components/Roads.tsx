import { Text } from '@react-three/drei';
import type { RoadData } from '../types';

interface RoadsProps {
  roads: RoadData[];
}

export const Roads: React.FC<RoadsProps> = ({ roads }) => {
  return (
    <group>
      {roads.map((road) => (
        <group key={road.id}>
          {/* Road surface */}
          <mesh
            position={[road.x, 0.02, road.z]}
            receiveShadow
          >
            <boxGeometry args={[road.width, 0.04, road.depth]} />
            <meshStandardMaterial color="#4a4e52" roughness={0.9} metalness={0.0} />
          </mesh>

          {/* Road center line */}
          <mesh position={[road.x, 0.05, road.z]}>
            <boxGeometry
              args={[
                road.labelRotation ? 0.06 : road.width * 0.6,
                0.01,
                road.labelRotation ? road.depth * 0.6 : 0.06,
              ]}
            />
            <meshStandardMaterial color="#6b7280" roughness={0.5} />
          </mesh>

          {/* Green edge strips */}
          {!road.labelRotation && (
            <>
              <mesh position={[road.x, 0.03, road.z - road.depth / 2 - 0.3]}>
                <boxGeometry args={[road.width, 0.02, 0.5]} />
                <meshStandardMaterial color="#3d6b35" roughness={0.8} />
              </mesh>
              <mesh position={[road.x, 0.03, road.z + road.depth / 2 + 0.3]}>
                <boxGeometry args={[road.width, 0.02, 0.5]} />
                <meshStandardMaterial color="#3d6b35" roughness={0.8} />
              </mesh>
            </>
          )}

          {/* Road label */}
          {road.label && (
            <Text
              position={[road.x, 0.08, road.z]}
              rotation={[-Math.PI / 2, 0, road.labelRotation || 0]}
              fontSize={0.8}
              color="#9ca3af"
              anchorX="center"
              anchorY="middle"
              fillOpacity={0.7}
            >
              {road.label}
            </Text>
          )}
        </group>
      ))}
    </group>
  );
};
