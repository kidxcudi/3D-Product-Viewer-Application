// scripts/interaction.js
import * as THREE from 'three';
import { animateCameraTo } from './cameraAnimation.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;
let originalEmissive = null;

export function enableInteraction({ scene, camera, renderer, controls }) {
  const canvas = renderer.domElement;
  const infoPanel = document.getElementById('info-panel');

  // Mouse move handler (for hover outline + tooltip)
  canvas.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const intersected = intersects[0].object;

      if (hoveredObject !== intersected) {
        if (hoveredObject && originalEmissive !== null) {
          hoveredObject.material.emissive.setHex(originalEmissive);
        }

        hoveredObject = intersected;
        originalEmissive = hoveredObject.material.emissive.getHex();
        hoveredObject.material.emissive.setHex(0x3333ff); // Soft blue outline
      }

      infoPanel.style.display = 'block';
      infoPanel.style.left = `${event.clientX + 10}px`;
      infoPanel.style.top = `${event.clientY + 10}px`;
      infoPanel.querySelector('#part-name').textContent = hoveredObject.name || hoveredObject.material.name || 'Unnamed Part';
    } else {
      if (hoveredObject && originalEmissive !== null) {
        hoveredObject.material.emissive.setHex(originalEmissive);
      }
      hoveredObject = null;
      originalEmissive = null;
      infoPanel.style.display = 'none';
    }
  });

  // Click handler (highlight + zoom in)
  canvas.addEventListener('click', () => {
    if (hoveredObject) {
      hoveredObject.material.color.setHex(0x6ca0ff); // Subtle blue highlight

      // Zoom camera to object
      const target = hoveredObject.getWorldPosition(new THREE.Vector3());
      animateCameraTo(camera, controls, target, 1.2);

      // Reset color after short delay
      setTimeout(() => {
        hoveredObject.material.color.setHex(hoveredObject.material.userData.originalColor);
      }, 800);
    }
  });
}
