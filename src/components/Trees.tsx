import { useMemo } from 'react';
import * as THREE from 'three';
import type { TreeData } from '../types';

interface TreesProps {
  trees: TreeData[];
}

const Tree = ({ data }: { data: TreeData }) => {
  const s = data.scale;
  return (
    <group position={[data.x, 0, data.z]}>
      {/* Trunk */}
      <mesh position={[0, s * 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.06 * s, 0.1 * s, 1.2 * s, 6]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      {/* Foliage - bottom sphere */}
      <mesh position={[0, s * 1.4, 0]} castShadow>
        <sphereGeometry args={[0.55 * s, 8, 6]} />
        <meshStandardMaterial color={data.color} roughness={0.8} />
      </mesh>
      {/* Foliage - top cone */}
      <mesh position={[0, s * 2.0, 0]} castShadow>
        <coneGeometry args={[0.4 * s, 0.8 * s, 7]} />
        <meshStandardMaterial color={data.color} roughness={0.8} />
      </mesh>
    </group>
  );
};

export const Trees: React.FC<TreesProps> = ({ trees }) => {
  return (
    <group>
      {trees.map((t) => (
        <Tree key={t.id} data={t} />
      ))}
    </group>
  );
};
