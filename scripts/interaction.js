import * as THREE from 'three';
import { animateCameraTo, animateCameraBack, isZoomedIn } from './cameraAnimation.js';
import gsap from 'gsap';

// === State variables ===
let isExploded = false;                             // Track exploded view state
const originalPositions = new Map();                // Store original mesh positions
const raycaster = new THREE.Raycaster();            // For mouse picking
const mouse = new THREE.Vector2();                  // Normalized mouse coords

let lastCamPos = new THREE.Vector3();               // Store camera position before click
let lastCamTarget = new THREE.Vector3();            // Store camera target before click

let hoveredObject = null;                           // Currently hovered object
let originalEmissive = null;                        // To restore emissive color after hover

// === Enable mesh interaction and UI feedback ===
export function enableInteraction({ scene, camera, renderer, controls }) {
  const canvas = renderer.domElement;
  const infoPanel = document.getElementById('info-panel');

  // --- Mouse Move Hover Detection ---
  canvas.addEventListener('mousemove', (event) => {
    // Convert screen to normalized device coords
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Perform raycasting
    raycaster.setFromCamera(mouse, camera);
    const allIntersections = raycaster.intersectObjects(scene.children, true);
    const intersects = allIntersections.filter(i => i.object.userData.interactive);

    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      canvas.style.cursor = 'pointer';

      // Handle hover transition
      if (hoveredObject !== intersected) {
        if (hoveredObject && originalEmissive !== null && hoveredObject.material.emissive) {
          hoveredObject.material.emissive.setHex(originalEmissive);
        }

        hoveredObject = intersected;

        // Highlight emissive if available
        if (hoveredObject.material.emissive) {
          originalEmissive = hoveredObject.material.emissive.getHex();
          hoveredObject.material.emissive.setHex(0x99bbff);
          hoveredObject.material.emissiveIntensity = 0.8;
        }
      }

      // Show floating info panel
      infoPanel.classList.add('show');
      infoPanel.style.left = `${event.clientX + 10}px`;
      infoPanel.style.top = `${event.clientY + 10}px`;
      infoPanel.querySelector('#part-name').textContent = hoveredObject.name || 'Unnamed Part';
    } else {
      // No hover target: reset state
      canvas.style.cursor = 'default';
      if (hoveredObject && originalEmissive !== null && hoveredObject.material.emissive) {
        hoveredObject.material.emissive.setHex(originalEmissive);
      }
      hoveredObject = null;
      originalEmissive = null;
      infoPanel.classList.remove('show');
    }
  });

  // --- Pointer Down: Save current camera state ---
  canvas.addEventListener('pointerdown', () => {
    lastCamPos.copy(camera.position);
    lastCamTarget.copy(controls.target);
  });

  // --- Click Handler ---
  canvas.addEventListener('click', (event) => {
    // Skip if camera moved and we're zoomed in (considered navigation, not selection)
    const cameraMoved =
      lastCamPos.distanceTo(camera.position) > 0.01 ||
      lastCamTarget.distanceTo(controls.target) > 0.01;

    if (isZoomedIn() && cameraMoved) return;

    // Recalculate raycast for click
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const allIntersections = raycaster.intersectObjects(scene.children, true);
    const intersects = allIntersections.filter(i => i.object.userData.interactive);

    if (intersects.length === 0) {
      // Clicked empty space → zoom out if zoomed in
      if (isZoomedIn()) {
        animateCameraBack(camera, controls);
      }
      return;
    }

    // Zoom in on the clicked object
    const clickedObject = intersects[0].object;
    const mat = clickedObject.material;

    // Store original color if not yet stored
    if (!mat.userData.originalColor) {
      mat.userData.originalColor = mat.color.clone();
    }

    mat.color.set(0x6ca0ff); // briefly highlight selected

    animateCameraTo(camera, controls, clickedObject); // animate zoom

    // Restore color after delay
    setTimeout(() => {
      if (mat.userData.originalColor) {
        mat.color.copy(mat.userData.originalColor);
      }
    }, 800);
  });
}

// === Setup 'E' key to toggle exploded view ===
export function setupExplodedViewToggle(scene) {
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e') {
      toggleExplodedView(scene);
    }
  });
}

// === Toggle exploded/collapsed state ===
function toggleExplodedView(scene) {
  const label = document.getElementById('exploded-label');

  if (!isExploded) {
    // Show floating label briefly
    if (label) {
      label.classList.add('show');
      setTimeout(() => {
        label.classList.remove('show');
      }, 2000);
    }
  }

  // Traverse scene and animate parts
  scene.traverse((obj) => {
    if (obj.isMesh && obj.userData.explodable) {
      const positionKey = obj.uuid;

      if (!isExploded) {
        // Store original position if not already stored
        if (!originalPositions.has(positionKey)) {
          originalPositions.set(positionKey, obj.position.clone());
        }

        // Apply outward offset
        const dir = obj.userData.explosionVector || new THREE.Vector3(0, 1, 0);
        const offset = dir.clone().multiplyScalar(1);

        gsap.to(obj.position, {
          x: obj.position.x + offset.x,
          y: obj.position.y + offset.y,
          z: obj.position.z + offset.z,
          duration: 1.2,
          ease: 'power2.out',
        });
      } else {
        // Animate back to original position
        const original = originalPositions.get(positionKey);
        if (original) {
          gsap.to(obj.position, {
            x: original.x,
            y: original.y,
            z: original.z,
            duration: 1.2,
            ease: 'power2.inOut',
          });
        }
      }
    }
  });

  isExploded = !isExploded;
}

// === Force collapse exploded view ===
export function collapseExplodedView(scene) {
  if (!isExploded) return; // already collapsed

  // Traverse and animate all explodable parts back
  scene.traverse((obj) => {
    if (obj.isMesh && obj.userData.explodable) {
      const positionKey = obj.uuid;
      const original = originalPositions.get(positionKey);
      if (original) {
        gsap.to(obj.position, {
          x: original.x,
          y: original.y,
          z: original.z,
          duration: 1.2,
          ease: 'power2.inOut',
        });
      }
    }
  });

  isExploded = false;
}
