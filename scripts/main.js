import { initScene } from './initScene.js';
import { createProduct } from './createProduct.js';
import { addLighting } from './addLighting.js';
import { enableInteraction } from './interaction.js';
import { animateCamera, setOrbitAngleFromCamera , animateCameraBack, isPaused, isZoomedIn,pauseAutoRotate, resumeAutoRotate } from './cameraAnimation.js';
import * as THREE from 'three';

let userIsInteracting = false;
window.scheduleZoomOut = scheduleZoomOut;
let floatPhase = 0;
let lastTime = 0;
const baseY = 0;

const toggleBtn = document.getElementById('toggle-legend');
const legendList = document.getElementById('legend-list');

document.getElementById('resetViewBtn').addEventListener('click', () => {
  animateCameraBack(camera, controls);
});

// Start collapsed
legendList.classList.add('collapsed');
toggleBtn.setAttribute('aria-expanded', false);

toggleBtn.addEventListener('click', () => {
  const isCollapsed = legendList.classList.toggle('collapsed');
  toggleBtn.setAttribute('aria-expanded', !isCollapsed);
});



// Initialize the scene, camera, renderer, and controls
const { scene, camera, renderer, controls } = initScene();
const product = createProduct();
scene.add(product);
addLighting(scene);
enableInteraction({ scene, camera, renderer, controls });

function scheduleZoomOut(camera, controls) {
  if (returnTimeout) clearTimeout(returnTimeout);

  returnTimeout = setTimeout(() => {
    if (isZoomedIn()) {
      animateCameraBack(camera, controls);
    }
  }, 3000);
}

let returnTimeout = null;

controls.addEventListener('start', () => {
  userIsInteracting = true;
  if (returnTimeout) clearTimeout(returnTimeout);
});

controls.addEventListener('end', () => {
  userIsInteracting = false;

  if (isZoomedIn()) {
    scheduleZoomOut(camera, controls);
  } 
});

function animate(time) {
  requestAnimationFrame(animate);

  if (!lastTime) {
    lastTime = time;
    return;
  }

  const deltaTime = time - lastTime;
  lastTime = time;

  const product = scene.getObjectByName('product');
  if (product) {
    if (!isZoomedIn()) {
      floatPhase += deltaTime * 0.002; // advance smoothly only when floating
      product.position.y = baseY + 0.1 * Math.sin(floatPhase);
    }
    // Do nothing if zoomed in: retain current Y position
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
