import * as THREE from 'three';

export const materials = {
  //  Refined Metal material
  metal: new THREE.MeshStandardMaterial({
    color: 0xbec2c9,           // Light steel/silver
    metalness: 0.9,
    roughness: 0.25,
    name: 'metal'
  }),

//   Inner metal material
  innerMetal: new THREE.MeshStandardMaterial({
    color: 0xa3adb8,
    metalness: 0.8,
    roughness: 0.25,
    name: 'innerMetal'
  }),

  // Cushion material
  cushion: new THREE.MeshStandardMaterial({
    color: 0x8a7f74,           // Taupe/coffee leather
    metalness: 0.1,
    roughness: 0.85,
    name: 'cushion'
  }),

  // Plastic material
  plastic: new THREE.MeshStandardMaterial({
    color: 0x999999,           // Light gray
    metalness: 0.15,
    roughness: 0.6,
    name: 'plastic'
  }),

  // Mic material
  mic: new THREE.MeshStandardMaterial({
    color: 0x444444,           // Medium-dark gray
    metalness: 0.2,
    roughness: 0.7,
    name: 'mic'
  })
};
