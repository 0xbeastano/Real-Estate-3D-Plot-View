import * as THREE from 'three';

let grassTexture: THREE.CanvasTexture | null = null;
let asphaltTexture: THREE.CanvasTexture | null = null;
let dashTexture: THREE.CanvasTexture | null = null;

export const getGrassTexture = () => {
  if (grassTexture) return grassTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#65a30d'; // Base vibrant green
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 100000; i++) {
    const r = Math.random();
    ctx.fillStyle = r > 0.8 ? '#4d7c0f' : r > 0.4 ? '#84cc16' : '#3f6212';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5);
  }
  grassTexture = new THREE.CanvasTexture(canvas);
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(0.1, 0.1);
  return grassTexture;
};

export const getAsphaltTexture = () => {
  if (asphaltTexture) return asphaltTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#333333';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 100000; i++) {
    const r = Math.random();
    ctx.fillStyle = r > 0.8 ? '#222222' : r > 0.4 ? '#444444' : '#111111';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5);
  }
  asphaltTexture = new THREE.CanvasTexture(canvas);
  asphaltTexture.wrapS = THREE.RepeatWrapping;
  asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(2, 2);
  return asphaltTexture;
};

export const getDashTexture = () => {
  if (dashTexture) return dashTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'rgba(255, 255, 255, 0)';
  ctx.fillRect(0, 0, 64, 256);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(24, 0, 16, 128); // Dashed line
  dashTexture = new THREE.CanvasTexture(canvas);
  dashTexture.wrapS = THREE.RepeatWrapping;
  dashTexture.wrapT = THREE.RepeatWrapping;
  return dashTexture;
};
