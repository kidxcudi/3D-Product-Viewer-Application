import * as THREE from 'three';

export const materials = {
  //  Refined Metal material
  metal: new THREE.MeshStandardMaterial({
    color: 0xa8b6c6,           // Light steel/silver
    metalness: 0.9,
    roughness: 0.22,
    name: 'metal'
  }),

//   Inner metal material
  innerMetal: new THREE.MeshStandardMaterial({
    color: 0x8ea0b3,
    metalness: 0.85,
    roughness: 0.24,
    name: 'innerMetal'
  }),

  // Cushion material
  cushion: new THREE.MeshStandardMaterial({
    color: 0x94a3b1,           
    metalness: 0.1,
    roughness: 0.85,
    name: 'cushion'
  }),

  // Plastic material
  plastic: new THREE.MeshStandardMaterial({
    color: 0x94a3b1,           
    metalness: 0.25,
    roughness: 0.5,
    name: 'plastic'
  }),

  // Mic material
  mic: new THREE.MeshStandardMaterial({
    color: 0x3c4752,           // Medium-dark gray
    metalness: 0.2,
    roughness: 0.65,
    name: 'mic'
  })
};
