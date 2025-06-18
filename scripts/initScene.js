import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Initializes and returns a basic 3D scene setup
export function initScene() {
  // Get canvas element
  const canvas = document.querySelector('#viewer');

  // Create a new scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0); // Added background color
  
  // Setup PerspectiveCamera (fov, ar, near, far)
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000 );
   // Set camera position back and slightly above
  camera.position.set(0, 3, 6);
  camera.lookAt(0, 0.5, 0); // look slightly above origin
  
  // Create the WebGL renderer with anti-aliasing for smoother edges
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true                      // Helps reduce jagged edges
  });

  // Set the size of the renderer to fill the screen
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Match rendering resolution to the display (good for Retina/HiDPI)
  renderer.setPixelRatio(window.devicePixelRatio);

  // Enable soft shadows for realism
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Add orbit controls to allow the user to rotate/zoom/pan the camera
  const controls = new OrbitControls(camera, renderer.domElement);

  // Add damping for smoother motion (like inertia)
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Allow the user to pan and zoom
  controls.enablePan = true;
  controls.enableZoom = true;

  // Automatically rotate the model (can be turned off later)
  controls.autoRotate = true;
  controls.autoRotateSpeed = 3.25;

  // Set the point the camera orbits around (center of the object)
  controls.target.set(0, 0.5, 0);

  // Adjust camera and renderer on window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Return core objects
  return { scene, camera, renderer, controls };
}
