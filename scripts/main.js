import { initScene } from './initScene.js';
import { createProduct } from './createProduct.js';
import { addLighting } from './addLighting.js';
import { enableInteraction } from './interaction.js';
import { animateCamera, setOrbitAngleFromCamera , animateCameraBack, isPaused, isZoomedIn,pauseAutoRotate, resumeAutoRotate } from './cameraAnimation.js';
import * as THREE from 'three';

let userIsInteracting = false;

// Initialize the scene, camera, renderer, and controls
const { scene, camera, renderer, controls } = initScene();
const product = createProduct();
scene.add(product);
addLighting(scene);
enableInteraction({ scene, camera, renderer, controls });

let returnTimeout = null;

controls.addEventListener('start', () => {
  userIsInteracting = true;
  if (returnTimeout) clearTimeout(returnTimeout);
});

controls.addEventListener('end', () => {
  userIsInteracting = false;

  if (returnTimeout) clearTimeout(returnTimeout);

  if (isZoomedIn()) {
    returnTimeout = setTimeout(() => {
      if (isZoomedIn()) {
        animateCameraBack(camera, controls);
      }
    }, 3000);
  } 
});




function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

animate();
