import * as THREE from 'three';
import { animateCameraTo } from './cameraAnimation.js';

// Initialize raycaster and mouse vector for detecting hover
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Variables to track currently hovered object and its original emissive color
let hoveredObject = null;
let originalEmissive = null;

// Enable object interaction (hover highlight + camera animation on click)
export function enableInteraction({ scene, camera, renderer, controls }) {
  const canvas = renderer.domElement;
  const infoPanel = document.getElementById('info-panel');

  // Handle mouse movement over canvas
  canvas.addEventListener('mousemove', (event) => {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cast a ray from the camera through the mouse position
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true); // true = recursive

    if (intersects.length > 0) {
      const intersected = intersects[0].object;

      // If the hovered object has changed, reset previous one
      if (hoveredObject !== intersected) {
        if (hoveredObject && originalEmissive !== null) {
          hoveredObject.material.emissive.setHex(originalEmissive); // Restore previous color
        }

        hoveredObject = intersected;

        // Highlight the new object (if it supports emissive)
        if (hoveredObject.material.emissive) {
          originalEmissive = hoveredObject.material.emissive.getHex();
          hoveredObject.material.emissive.setHex(0x99bbff); // Light blue highlight
          hoveredObject.material.emissiveIntensity = 0.8;
        }
      }

      // Show and update info panel near the cursor
      infoPanel.style.display = 'block';
      infoPanel.style.left = `${event.clientX + 10}px`;
      infoPanel.style.top = `${event.clientY + 10}px`;
      infoPanel.querySelector('#part-name').textContent = hoveredObject.name || 'Unnamed Part';
    } else {
      // If nothing is hovered, reset previous highlight and hide info panel
      if (hoveredObject && originalEmissive !== null) {
        hoveredObject.material.emissive.setHex(originalEmissive);
      }
      hoveredObject = null;
      originalEmissive = null;
      infoPanel.style.display = 'none';
    }
  });

  // Handle click on a hovered object
  canvas.addEventListener('click', () => {
    if (!hoveredObject) return; // Ignore if no object under cursor

    const mat = hoveredObject.material;

    // Store original color only if not already stored
    if (!mat.userData.originalColor) {
      mat.userData.originalColor = mat.color.clone(); // Use clone() for color
    }

    // Set a temporary highlight color
    mat.color.set(0x6ca0ff);

    hoveredObject.material.color.setHex(0x6ca0ff);

    // Animate camera to selected object
    animateCameraTo(camera, controls, hoveredObject);

    setTimeout(() => {
      if (mat.userData.originalColor) {
        mat.color.copy(mat.userData.originalColor); // Use copy instead of setHex
      }
    }, 800);
  });
}
