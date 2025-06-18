import * as THREE from 'three';
import { gsap } from 'gsap';

// Flag indicating whether the camera is currently zoomed in on an object
let _zoomedIn = false;

// Function to check if the camera is zoomed in
export function isZoomedIn() {
  return _zoomedIn;
}

// Current orbit angle (in radians) of the camera around the scene center on the XZ plane
let orbitAngle = 0;

// Updates orbitAngle based on the camera's current X and Z position
export function setOrbitAngleFromCamera(camera) {
  const x = camera.position.x;
  const z = camera.position.z;
  orbitAngle = Math.atan2(x, z); // Calculate the angle from the camera position
}

// Returns the current orbit angle
export function getOrbitAngle() {
  return orbitAngle;
}

// Constants defining the radius and height of the orbit circle
const orbitRadius = 6;
const orbitHeight = 3;

// Smoothly zoom the camera in to focus on the given target object
export function animateCameraTo(camera, controls, targetObject) {
  // Get the world position of the target object
  const targetPosition = new THREE.Vector3();
  targetObject.getWorldPosition(targetPosition);

  // Calculate the distance from the camera to the target object
  const camDistance = camera.position.distanceTo(targetPosition);

  // If camera is farther than 1.5 units, stop auto-rotation during zoom
  if (camDistance > 1.5) {
    controls.autoRotate = false;
  }

  // Mark the camera as zoomed in
  _zoomedIn = true;

  // Calculate bounding box of the target object
  const box = new THREE.Box3().setFromObject(targetObject);
  // Calculate the center of the bounding box (the focus point)
  const center = box.getCenter(new THREE.Vector3());
  // Get the size (length of diagonal) of the bounding box to estimate how far to zoom out
  const size = box.getSize(new THREE.Vector3()).length();
  // Set the desired distance from the object based on its size
  const distance = size * 2;

  // Calculate direction vector from controls target to current camera position
  const direction = new THREE.Vector3()
    .subVectors(camera.position, controls.target)
    .normalize();

  // Calculate the new camera position by moving from the object's center outward along the direction vector
  const newPos = center.clone().add(direction.multiplyScalar(distance));

  // Animate camera position to the new position smoothly over 1 second
  gsap.to(camera.position, {
    x: newPos.x,
    y: newPos.y,
    z: newPos.z,
    duration: 1,
    ease: 'power2.out',
    onUpdate: () => controls.update(), // Update controls each animation frame
    onComplete: () => {
      controls.update();

      // If a global zoom-out scheduler function exists, call it to trigger zoom out after delay
      if (typeof window.scheduleZoomOut === 'function') {
        window.scheduleZoomOut(camera, controls);
      }
    }
  });

  // Animate the controls target to smoothly move to the object's center
  gsap.to(controls.target, {
    x: center.x,
    y: center.y,
    z: center.z,
    duration: 1,
    ease: 'power2.out',
    onUpdate: () => controls.update()
  });
}

// Smoothly zoom the camera back out to the default orbit position
export function animateCameraBack(camera, controls) {
  // Default controls target when zoomed out (slightly above origin)
  const defaultTarget = new THREE.Vector3(0, 0.5, 0);

  // Calculate the target camera position on the orbit circle based on the current orbit angle
  const targetPos = new THREE.Vector3(
    orbitRadius * Math.sin(orbitAngle),
    orbitHeight,
    orbitRadius * Math.cos(orbitAngle)
  );

  // Animate camera position back to the orbit position over 1.2 seconds
  gsap.to(camera.position, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onUpdate: () => controls.update(),
    onComplete: () => {
      // Reset controls target to default target
      controls.target.copy(defaultTarget);
      controls.update();

      // Clear zoomed-in state
      _zoomedIn = false;

      // Sync the orbitAngle with the new camera position
      setOrbitAngleFromCamera(camera);

      // Resume auto-rotation
      controls.autoRotate = true;
    }
  });

  // Animate controls target back to default position
  gsap.to(controls.target, {
    x: defaultTarget.x,
    y: defaultTarget.y,
    z: defaultTarget.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onUpdate: () => controls.update()
  });
}
