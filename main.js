import { initScene } from './scripts/initScene.js';

// Initialize the scene and get core objects
const { scene, camera, renderer, controls } = initScene();

// Animation loop using requestAnimationFrame
function animate() {
  requestAnimationFrame(animate);

  controls.update();          // Update controls (for damping or auto-rotate)
  renderer.render(scene, camera); // Render the current frame
}

// Start animation
animate();
