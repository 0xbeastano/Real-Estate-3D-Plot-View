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

  const { trunkGeo, canopyGeo, topperGeo, trunkMat, leafMat } = useMemo(() => ({
    trunkGeo: new THREE.CylinderGeometry(0.04, 0.07, 1.4, 6),
    canopyGeo: new THREE.ConeGeometry(0.5, 1.8, 8),
    topperGeo: new THREE.ConeGeometry(0.3, 0.6, 8),
    trunkMat: new THREE.MeshStandardMaterial({ color: '#3d2b1f', roughness: 0.95 }),
    leafMat: new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.05 }) // Color overridden per instance
  }), []);

  useLayoutEffect(() => {
    if (!trunkRef.current || !bottomRef.current || !topRef.current) return;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    trees.forEach((tree, i) => {
      const s = tree.scale;
      const baseColor = tree.color || '#22c55e';

      // Update Trunk Matrix
      dummy.position.set(tree.x, s * 0.7, tree.z);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      trunkRef.current!.setMatrixAt(i, dummy.matrix);

      // Update Main Canopy (Cone)
      dummy.position.set(tree.x, s * 1.6, tree.z);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      bottomRef.current!.setMatrixAt(i, dummy.matrix);
      bottomRef.current!.setColorAt(i, color.set(baseColor));

      // Update Topper Cone (Teardrop finish)
      dummy.position.set(tree.x, s * 2.2, tree.z);
      dummy.scale.set(s * 0.8, s * 0.8, s * 0.8);
      dummy.updateMatrix();
      topRef.current!.setMatrixAt(i, dummy.matrix);
      topRef.current!.setColorAt(i, color.set(baseColor));
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
      <instancedMesh ref={bottomRef} args={[canopyGeo, leafMat, trees.length]} castShadow />
      <instancedMesh ref={topRef} args={[topperGeo, leafMat, trees.length]} castShadow />
    </group>
  );
};
