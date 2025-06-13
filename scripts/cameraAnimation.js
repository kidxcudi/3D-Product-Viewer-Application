import * as THREE from 'three';
import { gsap } from 'gsap';

let paused = false;
let zoomedIn = false;

// Pause auto-rotation
export function pauseAutoRotate() {
  paused = true;
}

// Resume auto-rotation
export function resumeAutoRotate() {
  paused = false;
}

// Check if auto-rotation is paused
export function isPaused() {
  return paused;
}

// Smooth auto-rotate around center
export function animateCamera(camera, clock) {
  if (paused || zoomedIn) return;

  const elapsed = clock.getElapsedTime();
  const angle = 0.4 * elapsed;
  const radius = 6;
  const height = 3;

  const x = radius * Math.sin(angle);
  const z = radius * Math.cos(angle);

  camera.position.set(x, height, z);
  camera.lookAt(new THREE.Vector3(0, 0.5, 0));
}

// Animate camera zoom-in to target
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

// Animate camera zoom-out to default
export function animateCameraBack(camera, controls) {
  const defaultPos = new THREE.Vector3(6, 3, 6);
  const defaultTarget = new THREE.Vector3(0, 0.5, 0);

  gsap.to(camera.position, {
    x: defaultPos.x,
    y: defaultPos.y,
    z: defaultPos.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onUpdate: () => controls.update()
  });

  gsap.to(controls.target, {
    x: defaultTarget.x,
    y: defaultTarget.y,
    z: defaultTarget.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onUpdate: () => controls.update()
  });

  zoomedIn = false;
  resumeAutoRotate();
}
