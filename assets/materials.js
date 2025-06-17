import * as THREE from 'three';

const loader = new THREE.TextureLoader();

const fabricNormal = loader.load('assets/textures/Tulle01Large_1K_Normal.png');
const fabricRoughness = loader.load('assets/textures/Tulle01Large_1K_Roughness.png');

fabricNormal.wrapS = fabricNormal.wrapT = THREE.RepeatWrapping;
fabricRoughness.wrapS = fabricRoughness.wrapT = THREE.RepeatWrapping;
fabricNormal.repeat.set(2, 2); 
fabricRoughness.repeat.set(2, 2);

export const materials = {
  //  Refined Metal material
  metal: new THREE.MeshStandardMaterial({
    color: 0x2e3a59,           
    metalness: 0.9,
    roughness: 0.22,
    name: 'metal'
  }),

//   Inner metal material
  innerMetal: new THREE.MeshStandardMaterial({
    color: 0x4c5c8a,
    metalness: 0.8,
    roughness: 0.3,
    name: 'innerMetal'
  }),

  // Cushion material
  cushion: new THREE.MeshStandardMaterial({
    color: 0x849eb7,   
    normalMap: fabricNormal,
    roughnessMap: fabricRoughness,        
    metalness: 0.0,
    roughness: 0.9,
    name: 'cushion'
  }),

  // Plastic material
  plastic: new THREE.MeshStandardMaterial({
    color: 0x7b9bb9,           
    metalness: 0.25,
    roughness: 0.5,
    name: 'plastic'
  }),

  // Mic material
  mic: new THREE.MeshStandardMaterial({
    color: 0x303c5e,           
    metalness: 0.2,
    roughness: 0.65,
    name: 'mic'
  })
};
