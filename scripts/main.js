import { initScene } from './initScene.js';
import { createProduct, clonedMaterials } from './createProduct.js';
import { addLighting } from './addLighting.js';
import {
  enableInteraction,
  setupExplodedViewToggle,
  collapseExplodedView
} from './interaction.js';
import {
  animateCameraBack,
  isZoomedIn
} from './cameraAnimation.js';
import { themes } from '../assets/materialThemes.js';


// === interaction and floating animation state ===
let userIsInteracting = false;
window.scheduleZoomOut = scheduleZoomOut;
let floatPhase = 0;
let lastTime = 0;
const baseY = 0;

// Theme toggle logic
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeDropdown = document.getElementById('themeDropdown');

// === Legend toggle UI logic ===
const toggleBtn = document.getElementById('toggle-legend');
const legendList = document.getElementById('legend-list');

// Reset camera + collapse exploded view on reset button click
document.getElementById('resetViewBtn').addEventListener('click', () => {
  animateCameraBack(camera, controls);
  collapseExplodedView(scene);
});

// Start with legend list collapsed
legendList.classList.add('collapsed');
toggleBtn.setAttribute('aria-expanded', false);

// Toggle legend list visibility on button click
toggleBtn.addEventListener('click', () => {
  const isCollapsed = legendList.classList.toggle('collapsed');
  toggleBtn.setAttribute('aria-expanded', !isCollapsed);
});

// Toggle dropdown on button click
themeToggleBtn.addEventListener('click', () => {
  themeDropdown.classList.toggle('show');
});

// Hide dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!themeDropdown.contains(e.target) && e.target !== themeToggleBtn) {
    themeDropdown.classList.remove('show');
  }
});

// === 3D Scene Initialization ===
const { scene, camera, renderer, controls } = initScene();   // sets up scene, renderer, controls
const product = createProduct();                              // builds the product model
scene.add(product);                                           // adds model to scene
addLighting(scene);                                           // adds lighting for visibility
enableInteraction({ scene, camera, renderer, controls });     // enables raycasting, UI info panels, etc.
setupExplodedViewToggle(scene);                               // enables exploded view toggle via UI

// === Auto-Zoom-Out Timeout Logic ===
let returnTimeout = null;

// Schedules a zoom out if user is zoomed in and inactive
function scheduleZoomOut(camera, controls) {
  if (returnTimeout) clearTimeout(returnTimeout); // clear previous timer

  returnTimeout = setTimeout(() => {
    if (isZoomedIn()) {
      animateCameraBack(camera, controls);
    }
  }, 3000); // 3-second timeout
}

// Detects when user starts interacting
controls.addEventListener('start', () => {
  userIsInteracting = true;
  if (returnTimeout) clearTimeout(returnTimeout);
});

// Detects when user ends interaction
controls.addEventListener('end', () => {
  userIsInteracting = false;

  // Trigger timeout only if camera is still zoomed in
  if (isZoomedIn()) {
    scheduleZoomOut(camera, controls);
  }
});

themeSelect.addEventListener('change', (e) => {
  const selected = e.target.value;
  const theme = themes[selected];

  if (theme) {
    clonedMaterials.metal.forEach(mat => mat.color.setHex(theme.metal));
    clonedMaterials.innerMetal.forEach(mat => mat.color.setHex(theme.innerMetal));
    clonedMaterials.cushion.forEach(mat => mat.color.setHex(theme.cushion));
    clonedMaterials.mic.forEach(mat => mat.color.setHex(theme.mic));
    clonedMaterials.plastic.forEach(mat => mat.color.setHex(theme.plastic));
  }
});


// === Animation Loop ===
function animate(time) {
  requestAnimationFrame(animate); // continuous rendering

  // First frame timestamp init
  if (!lastTime) {
    lastTime = time;
    return;
  }

  const deltaTime = time - lastTime;
  lastTime = time;

  // Floating animation only when camera is zoomed out
  const product = scene.getObjectByName('product');
  if (product && !isZoomedIn()) {
    floatPhase += deltaTime * 0.002; // smooth oscillation
    product.position.y = baseY + 0.1 * Math.sin(floatPhase);
  }

  controls.update(); // orbit controls update
  renderer.render(scene, camera); // draw frame
}

animate(); // start the loop
