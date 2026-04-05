import { useRef, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { TreeData } from '../types';

interface TreesProps {
  trees: TreeData[];
}

export const Trees: React.FC<TreesProps> = ({ trees }) => {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const bottomRef = useRef<THREE.InstancedMesh>(null);
  const topRef = useRef<THREE.InstancedMesh>(null);

  const { trunkGeo, bottomGeo, topGeo, trunkMat, leafMat } = useMemo(() => ({
    trunkGeo: new THREE.CylinderGeometry(0.06, 0.1, 1.2, 6),
    bottomGeo: new THREE.SphereGeometry(0.55, 8, 6),
    topGeo: new THREE.ConeGeometry(0.4, 0.8, 7),
    trunkMat: new THREE.MeshStandardMaterial({ color: '#5c4033', roughness: 0.9 }),
    leafMat: new THREE.MeshStandardMaterial({ roughness: 0.8 }) // Color overridden per instance
  }), []);

  useLayoutEffect(() => {
    if (!trunkRef.current || !bottomRef.current || !topRef.current) return;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    trees.forEach((tree, i) => {
      const s = tree.scale;

      // Update Trunk Matrix
      dummy.position.set(tree.x, s * 0.6, tree.z);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      trunkRef.current!.setMatrixAt(i, dummy.matrix);

      // Update Bottom Sphere Matrix
      dummy.position.set(tree.x, s * 1.4, tree.z);
      dummy.updateMatrix();
      bottomRef.current!.setMatrixAt(i, dummy.matrix);
      bottomRef.current!.setColorAt(i, color.set(tree.color));

      // Update Top Cone Matrix
      dummy.position.set(tree.x, s * 2.0, tree.z);
      dummy.updateMatrix();
      topRef.current!.setMatrixAt(i, dummy.matrix);
      topRef.current!.setColorAt(i, color.set(tree.color));
    });

    trunkRef.current.instanceMatrix.needsUpdate = true;
    
    bottomRef.current.instanceMatrix.needsUpdate = true;
    if (bottomRef.current.instanceColor) bottomRef.current.instanceColor.needsUpdate = true;
    
    topRef.current.instanceMatrix.needsUpdate = true;
    if (topRef.current.instanceColor) topRef.current.instanceColor.needsUpdate = true;
  }, [trees]);

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[trunkGeo, trunkMat, trees.length]} castShadow />
      <instancedMesh ref={bottomRef} args={[bottomGeo, leafMat, trees.length]} castShadow />
      <instancedMesh ref={topRef} args={[topGeo, leafMat, trees.length]} castShadow />
    </group>
  );
};
