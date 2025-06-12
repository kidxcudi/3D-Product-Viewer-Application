import { initScene } from './initScene.js';
import { createProduct } from './createProduct.js';

// Initialize the scene and get core objects
const { scene, camera, renderer, controls } = initScene();

// Add the headphone model to the scene
const product = createProduct();
scene.add(product);

// Animation loop using requestAnimationFrame
function animate() {
  requestAnimationFrame(animate);

  controls.update();          // Update controls (for damping or auto-rotate)
  renderer.render(scene, camera); // Render the current frame
}

// Start animation
animate();
