import { useGLTF } from '@react-three/drei';
import { useStore } from '../store/useStore';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { plotsData } from '../data/plots';

export function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { setSelectedPlot, setHoveredPlot, showWireframe } = useStore();
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (scene) {
      // Reset position and scale before recalculating to avoid compounding transformations
      scene.position.set(0, 0, 0);
      scene.scale.setScalar(1);

      // Center and scale the model
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      
      // Scale based on the X and Z dimensions to fit roughly within the 1000x500 layout area
      const maxDim = Math.max(size.x, size.z);
      const scale = 1000 / (maxDim || 1); // Avoid division by zero
      
      scene.scale.setScalar(scale);
      
      // Recalculate bounding box after scaling to position it correctly
      const scaledBox = new THREE.Box3().setFromObject(scene);
      const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
      
      // Center on X and Z, and ensure the model sits exactly on the ground (y = 0)
      scene.position.x -= scaledCenter.x;
      scene.position.z -= scaledCenter.z;
      scene.position.y -= scaledBox.min.y;

      // Traverse the model to enable shadows and wireframe
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Store original material if not already stored
          if (!child.userData.originalMaterial) {
            child.userData.originalMaterial = child.material;
          }

          if (showWireframe) {
            // Create wireframe material if it doesn't exist
            if (!child.userData.wireframeMaterial) {
              child.userData.wireframeMaterial = new THREE.MeshStandardMaterial({
                color: 0x00ff00,
                wireframe: true,
              });
            }
            child.material = child.userData.wireframeMaterial;
          } else {
            // Restore original material
            if (child.userData.originalMaterial) {
              child.material = child.userData.originalMaterial;
            }
          }
        }
      });
    }
  }, [scene, showWireframe]);

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    
    // Check if the hovered mesh corresponds to a valid plot ID
    const plot = plotsData.find(p => p.id === e.object.name);
    
    if (plot) {
      document.body.style.cursor = 'pointer';
      setHoveredPlot(plot.id);
      
      // Apply highlight effect only to interactive plots
      if (e.object.material && e.object.material.emissive) {
        if (!e.object.userData.originalEmissive) {
          e.object.userData.originalEmissive = e.object.material.emissive.clone();
        }
        e.object.material.emissive.setHex(0x444444); // Highlight color
      }
    }
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    
    const plot = plotsData.find(p => p.id === e.object.name);
    
    if (plot) {
      document.body.style.cursor = 'auto';
      setHoveredPlot(null);
      
      // Remove highlight effect
      if (e.object.material && e.object.material.emissive && e.object.userData.originalEmissive) {
        e.object.material.emissive.copy(e.object.userData.originalEmissive);
      }
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    
    // Map the clicked mesh name to actual plot data
    const plot = plotsData.find(p => p.id === e.object.name);
    if (plot) {
      setSelectedPlot(plot);
    }
  };

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
}

// Preload the model (optional, good for performance if you know the URL)
// useGLTF.preload('/model.glb');
