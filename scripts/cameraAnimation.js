import * as THREE from 'three';
import { gsap } from 'gsap';

let paused = false;
let zoomedIn = false;

// Orbit state
let orbitAngle = 0;
const orbitRadius = 6;
const orbitHeight = 3;
const orbitSpeed = 0.4; // radians per second

// Pause auto-rotation
export function pauseAutoRotate() {
  paused = true;
}

// Resume auto-rotation
export function resumeAutoRotate() {
  paused = false;
}

// Check if paused
export function isPaused() {
  return paused;
}

// Custom orbit animation
export function animateCamera(camera, deltaTime) {
  if (paused || zoomedIn) return;

  orbitAngle += orbitSpeed * deltaTime;

  const x = orbitRadius * Math.sin(orbitAngle);
  const z = orbitRadius * Math.cos(orbitAngle);

  camera.position.set(x, orbitHeight, z);
  camera.lookAt(new THREE.Vector3(0, 0.5, 0));
}

// Zoom in to target object
export function animateCameraTo(camera, controls, targetObject) {
  zoomedIn = true;
  pauseAutoRotate();

  const box = new THREE.Box3().setFromObject(targetObject);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  const distance = size * 2;

  const direction = new THREE.Vector3()
    .subVectors(camera.position, controls.target)
    .normalize();

  const newPos = center.clone().add(direction.multiplyScalar(distance));

  gsap.to(camera.position, {
    x: newPos.x,
    y: newPos.y,
    z: newPos.z,
    duration: 1,
    ease: 'power2.out',
    onUpdate: () => controls.update()
  });

  gsap.to(controls.target, {
    x: center.x,
    y: center.y,
    z: center.z,
    duration: 1,
    ease: 'power2.out',
    onUpdate: () => controls.update()
  });
}

// Zoom out to orbit position
export function animateCameraBack(camera, controls) {
  const defaultTarget = new THREE.Vector3(0, 0.5, 0);

  const targetPos = new THREE.Vector3(
    orbitRadius * Math.sin(orbitAngle),
    orbitHeight,
    orbitRadius * Math.cos(orbitAngle)
  );

  gsap.to(camera.position, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onUpdate: () => controls.update(),
    onComplete: () => {
      controls.target.copy(defaultTarget);
      controls.update();
      zoomedIn = false;
      resumeAutoRotate();
    }
  });

  gsap.to(controls.target, {
    x: defaultTarget.x,
    y: defaultTarget.y,
    z: defaultTarget.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onUpdate: () => controls.update()
  });
}
