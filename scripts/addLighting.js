import * as THREE from 'three';

export function addLighting(scene) {
  // Ambient light provides soft global illumination to brighten shadows
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  // Directional light simulates sunlight, casts shadows for depth
  const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
  directionalLight.position.set(10, 10, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024); // Shadow resolution
  directionalLight.shadow.camera.near = 0.5;       // Shadow camera near clipping plane
  directionalLight.shadow.camera.far = 50;         // Shadow camera far clipping plane
  directionalLight.shadow.bias = -0.0003;           // Shadow bias to reduce artifacts
  directionalLight.shadow.normalBias = 0.023;
  scene.add(directionalLight);

  // Point light fills in shadow areas softly to reduce harsh contrast
  const fillLight = new THREE.PointLight(0xffffff, 0.3);
  fillLight.position.set(-5, 5, 3);
  scene.add(fillLight);

  // Spot light creates rim highlights and specular emphasis
  const spotLight = new THREE.SpotLight(0xffffff, 10);
  spotLight.position.set(-5, 8, 5);
  spotLight.angle = Math.PI / 7;    // Light cone angle
  spotLight.penumbra = 0.5;          // Softness at edge of spotlight
  spotLight.decay = 2;               // Light decay over distance
  spotLight.distance = 60;           // Maximum range of light
  spotLight.castShadow = true;       // Enable shadows for spot light
  scene.add(spotLight);
}
