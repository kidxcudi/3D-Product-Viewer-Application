// interaction.js

import * as THREE from 'three';
import { animateCameraTo, animateCameraBack, isZoomedIn } from './cameraAnimation.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let hoveredObject = null;
let originalEmissive = null;

export function enableInteraction({ scene, camera, renderer, controls }) {
  const canvas = renderer.domElement;
  const infoPanel = document.getElementById('info-panel');

  canvas.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const allIntersections = raycaster.intersectObjects(scene.children, true);
    const intersects = allIntersections.filter(i => i.object.userData.interactive);

    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      canvas.style.cursor = 'pointer';

      if (hoveredObject !== intersected) {
        if (hoveredObject && originalEmissive !== null && hoveredObject.material.emissive) {
          hoveredObject.material.emissive.setHex(originalEmissive);
        }

        hoveredObject = intersected;

        if (hoveredObject.material.emissive) {
          originalEmissive = hoveredObject.material.emissive.getHex();
          hoveredObject.material.emissive.setHex(0x99bbff);
          hoveredObject.material.emissiveIntensity = 0.8;
        }
      }

      infoPanel.style.display = 'block';
      infoPanel.style.left = `${event.clientX + 10}px`;
      infoPanel.style.top = `${event.clientY + 10}px`;
      infoPanel.querySelector('#part-name').textContent = hoveredObject.name || 'Unnamed Part';
    } else {
      canvas.style.cursor = 'default';
      if (hoveredObject && originalEmissive !== null && hoveredObject.material.emissive) {
        hoveredObject.material.emissive.setHex(originalEmissive);
      }
      hoveredObject = null;
      originalEmissive = null;
      infoPanel.style.display = 'none';
    }
  });

  canvas.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const allIntersections = raycaster.intersectObjects(scene.children, true);
    const intersects = allIntersections.filter(i => i.object.userData.interactive);

    if (intersects.length === 0) {
      // Clicked empty space
      if (isZoomedIn()) {
        animateCameraBack(camera, controls);
      }
      return;
    }

    const clickedObject = intersects[0].object;
    const mat = clickedObject.material;

    if (!mat.userData.originalColor) {
      mat.userData.originalColor = mat.color.clone();
    }

    mat.color.set(0x6ca0ff);

    animateCameraTo(camera, controls, clickedObject);

    setTimeout(() => {
      if (mat.userData.originalColor) {
        mat.color.copy(mat.userData.originalColor);
      }
    }, 800);
  });
}
