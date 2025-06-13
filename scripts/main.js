import { initScene } from './initScene.js';
import { createProduct } from './createProduct.js';
import { addLighting } from './addLighting.js';
import { enableInteraction } from './interaction.js';
import { animateCamera, pauseAutoRotate, resumeAutoRotate, animateCameraBack, isPaused } from './cameraAnimation.js';
import * as THREE from 'three';

const { scene, camera, renderer, controls } = initScene();
const product = createProduct();
scene.add(product);
addLighting(scene);
enableInteraction({ scene, camera, renderer, controls });

const clock = new THREE.Clock();
let returnTimeout = null;

controls.addEventListener('start', () => {
  pauseAutoRotate();
  if (returnTimeout) clearTimeout(returnTimeout);
});

controls.addEventListener('end', () => {
  returnTimeout = setTimeout(() => {
    animateCameraBack(camera, controls);
  }, 3000);
});

function animate() {
  requestAnimationFrame(animate);

  if (!isPaused()) {
    animateCamera(camera, clock); // Auto orbit
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
