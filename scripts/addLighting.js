import * as THREE from 'three';

export function addLighting(scene) {
  // Soft ambient for global fill 
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Slightly brighter
  scene.add(ambientLight);

  // Main key light (directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
  directionalLight.position.set(5, 10, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.bias = -0.0001;
  scene.add(directionalLight);

  // Soft fill light (reduces harsh shadow)
  const fillLight = new THREE.PointLight(0xffffff, 0.3);
  fillLight.position.set(-5, 5, 3);
  scene.add(fillLight);

  //  Rim light / Spot for specular pop 
  const spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.position.set(-5, 8, 5);
  spotLight.angle = Math.PI / 7;
  spotLight.penumbra = 0.5;
  spotLight.decay = 2;
  spotLight.distance = 60;
  spotLight.castShadow = true;
  scene.add(spotLight);
}
