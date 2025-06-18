import * as THREE from 'three';

// Load textures used for the cushion material
const loader = new THREE.TextureLoader();

// Fabric normal map gives surface bump details (adds realism to lighting)
const fabricNormal = loader.load('assets/textures/Tulle01Large_1K_Normal.png');

// Fabric roughness map defines how matte/shiny different parts are
const fabricRoughness = loader.load('assets/textures/Tulle01Large_1K_Roughness.png');

// Repeat the textures so they tile nicely across the cushion surface
fabricNormal.wrapS = fabricNormal.wrapT = THREE.RepeatWrapping;
fabricRoughness.wrapS = fabricRoughness.wrapT = THREE.RepeatWrapping;
fabricNormal.repeat.set(2, 2); 
fabricRoughness.repeat.set(2, 2);

// Define reusable materials for various parts of the 3D product
export const materials = {
  // Refined metal look for outer ear cup or any metallic component
  metal: new THREE.MeshStandardMaterial({
    color: 0x2e3a59,           // Deep bluish-metal color
    metalness: 0.9,            // Very shiny and reflective
    roughness: 0.22,           // Slightly smooth surface
    name: 'metal'
  }),

  // Inner metal for speaker-like areas—slightly less polished than outer
  innerMetal: new THREE.MeshStandardMaterial({
    color: 0x4c5c8a,           // Lighter bluish shade
    metalness: 0.8,
    roughness: 0.3,
    name: 'innerMetal'
  }),

  // Soft cushion material with fabric textures for bumpiness and softness
  cushion: new THREE.MeshStandardMaterial({
    color: 0x849eb7,           // Soft gray-blue base color
    normalMap: fabricNormal,   // Adds soft fabric bumpiness
    roughnessMap: fabricRoughness, // Fabric detail defines roughness per pixel
    metalness: 0.0,            // Non-metallic
    roughness: 0.9,            // Very matte, as cushions usually are
    name: 'cushion'
  }),

  // Semi-glossy plastic for headband and structural parts
  plastic: new THREE.MeshStandardMaterial({
    color: 0x7b9bb9,           // Muted blue
    metalness: 0.25,           // Slight shine, like plastic
    roughness: 0.6,            // Somewhat matte
    name: 'plastic'
  }),

  // Microphone material: darker, moderately rough
  mic: new THREE.MeshStandardMaterial({
    color: 0x303c5e,           // Very dark blue
    metalness: 0.2,
    roughness: 0.65,
    name: 'mic'
  })
};
