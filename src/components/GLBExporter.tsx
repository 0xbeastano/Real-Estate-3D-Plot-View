import { useThree } from '@react-three/fiber';
import { GLTFExporter } from 'three-stdlib';
import { useEffect } from 'react';

export function GLBExporter({ onExport }: { onExport: (exportFn: () => void) => void }) {
  const { scene } = useThree();

  useEffect(() => {
    const exportScene = () => {
      const exporter = new GLTFExporter();
      
      // We want to export the layout group, not the whole scene (which includes lights, cameras, etc.)
      // Let's find the group that contains our layout.
      // We can name it 'layout-group' in Scene.tsx
      const layoutGroup = scene.getObjectByName('layout-group');
      
      if (!layoutGroup) {
        console.error("Layout group not found for export");
        return;
      }

      exporter.parse(
        layoutGroup,
        (gltf) => {
          if (gltf instanceof ArrayBuffer) {
            saveArrayBuffer(gltf, 'layout.glb');
          } else {
            const output = JSON.stringify(gltf, null, 2);
            saveString(output, 'layout.gltf');
          }
        },
        (error) => {
          console.error('An error happened during parsing', error);
        },
        { binary: true }
      );
    };

    onExport(() => exportScene);
  }, [scene, onExport]);

  return null;
}

function save(blob: Blob, filename: string) {
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function saveString(text: string, filename: string) {
  save(new Blob([text], { type: 'text/plain' }), filename);
}

function saveArrayBuffer(buffer: ArrayBuffer, filename: string) {
  save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
}
