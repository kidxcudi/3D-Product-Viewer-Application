import { initScene } from './initScene.js';
import { createProduct } from './createProduct.js';
import { addLighting } from './addLighting.js';

// Initialize the scene and get core objects
const { scene, camera, renderer, controls } = initScene();

// Add the headphone model to the scene
const product = createProduct();
scene.add(product);

// Add ambient + directional + spot lighting
addLighting(scene);

// Animation loop using requestAnimationFrame
function animate() {
  requestAnimationFrame(animate);

  controls.update();          // Update controls (for damping or auto-rotate)
  renderer.render(scene, camera); // Render the current frame
}

// Start animation
animate();
