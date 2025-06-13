import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initScene() {
  // Get canvas element
  const canvas = document.querySelector('#viewer');

  // Create a new scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0); // Added background color
  
  // Setup PerspectiveCamera 
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000 );
   // Set camera position back and slightly above
  camera.position.set(0, 3, 6);
  camera.lookAt(0, 0.5, 0); // look slightly above origin
  
  // Create WebGL renderer and configure size and resolution
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Add OrbitControls for user interaction (zoom/pan)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;         // Smooth interaction
  controls.dampingFactor = 0.05;
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.autoRotate = false;            // disable auto-rotation by default
  controls.autoRotateSpeed = 3;

  // Adjust camera and renderer on window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Return core objects
  return { scene, camera, renderer, controls };
}
