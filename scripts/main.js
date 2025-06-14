import { initScene } from './initScene.js';
import { createProduct } from './createProduct.js';
import { addLighting } from './addLighting.js';
import { enableInteraction } from './interaction.js';
import { animateCamera, setOrbitAngleFromCamera , animateCameraBack, isPaused, isZoomedIn } from './cameraAnimation.js';
import * as THREE from 'three';

let userIsInteracting = false;

// Initialize the scene, camera, renderer, and controls
const { scene, camera, renderer, controls } = initScene();
const product = createProduct();
scene.add(product);
addLighting(scene);
enableInteraction({ scene, camera, renderer, controls });

const clock = new THREE.Clock();
let returnTimeout = null;

controls.addEventListener('start', () => {
  // pauseAutoRotate();
  userIsInteracting = true;
  if (returnTimeout) clearTimeout(returnTimeout);
});

controls.addEventListener('end', () => {
  userIsInteracting = false;

  // 🧠 Update orbitAngle based on current camera position
  setOrbitAngleFromCamera(camera);

  if (isZoomedIn()) {
    returnTimeout = setTimeout(() => {
      animateCameraBack(camera, controls);
    }, 3000);
  }
});

function animate() {
  requestAnimationFrame(animate);

  const deltaTime = clock.getDelta(); // 🟢 get time since last frame

  if (!isPaused() && !userIsInteracting) {
    animateCamera(camera, deltaTime);
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
