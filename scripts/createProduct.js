import * as THREE from 'three';
import { materials } from '../assets/materials.js';

export function createProduct() {
   // Group to hold all parts of the product
  const product = new THREE.Group();

  // Headband (Box segments forming an arc)
  const headbandPoints = [
    new THREE.Vector3(-0.85, 0.4, 0),
    new THREE.Vector3(-0.85, 1.0, 0),
    new THREE.Vector3(-0.45, 1.6, 0),
    new THREE.Vector3(0.45, 1.6, 0),
    new THREE.Vector3(0.85, 1.0, 0),
    new THREE.Vector3(0.85, 0.4, 0)
  ];

  for (let i = 0; i < headbandPoints.length - 1; i++) {
    const start = headbandPoints[i];
    const end = headbandPoints[i + 1];
    const direction = new THREE.Vector3().subVectors(end, start);
    // Custom overlap based on segment index
    let overlap = 0.03; // default for middle segments
    if (i === 2)
      overlap = 0.042; 

    const length = direction.length() + overlap;

    const segment = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, length, 0.3),
      materials.plastic
    );
    
    // Adjust position to account for segment length
    segment.position.copy(start.clone().add(end).multiplyScalar(0.5));
    segment.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    );

    //Add shadow and name
    segment.name = `Headband Segment ${i + 1}`;
    segment.castShadow = true;
    segment.receiveShadow = true;
    product.add(segment);
  }

  // Ear Cups (outer + inner cylinder) 
  const outerCupGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
  const innerCupGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
  
  // LEFT
  const leftOuterCup = new THREE.Mesh(outerCupGeometry, materials.metal);
  leftOuterCup.rotation.z = Math.PI / 2;
  leftOuterCup.position.set(-0.87, 0.3, 0);
  leftOuterCup.receiveShadow = true;
  leftOuterCup.name = "Left Outer Ear Cup";

  const leftInnerCup = new THREE.Mesh(innerCupGeometry, materials.innerMetal);
  leftInnerCup.rotation.z = Math.PI / 2;
  leftInnerCup.position.set(-0.97, 0.3, 0); // Slightly protruding
  leftInnerCup.name = "Left Inner Ear Cup";

  // RIGHT
  const rightOuterCup = leftOuterCup.clone();
  rightOuterCup.position.set(0.87, 0.3, 0);
  rightOuterCup.receiveShadow = true;
  rightOuterCup.name = "Right Outer Ear Cup";

  const rightInnerCup = leftInnerCup.clone();
  rightInnerCup.position.set(0.97, 0.3, 0);
  rightInnerCup.name = "Right Inner Ear Cup";

  // Cushions (aligned with outer cups) 
  const cushionGeometry = new THREE.TorusGeometry(0.34, 0.1, 16, 100);
  
  // left cushion
  const leftCushion = new THREE.Mesh(cushionGeometry, materials.cushion);
  leftCushion.rotation.y = Math.PI / 2;
  leftCushion.position.set(-0.785, 0.3, 0);
  leftCushion.castShadow = true;
  leftCushion.receiveShadow = true;
  leftCushion.name = "Left Ear Cushion";
  
  // right cushion 
  const rightCushion = leftCushion.clone();
  rightCushion.position.set(0.785, 0.3, 0);
  rightCushion.castShadow = true;
  rightCushion.receiveShadow = true;
  rightCushion.name = "Right Ear Cushion";
  
  // Mic Boom + Tip (attached to right cup) ===
  const micBoomLength = 0.7;
  
  // Mic boom as a thin box
  const micBoom = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04,0.025, micBoomLength, 20),
    materials.mic
  );
  micBoom.name = "Mic Boom";
  
  // Position boom to extend from lower front of right ear cup
  micBoom.position.set(0.865, 0, 0.5); // right cup edge
  micBoom.rotation.z = -Math.PI / 18;     // downward tilt
  micBoom.rotation.x = -Math.PI / 2.5;     // slight forward angle
  
  // micTip at the end of the boom
  const micTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    materials.mic
  );
  micTip.name = "Mic Tip";

  // Position micTip at boom end using local direction
  const boomEndOffset = new THREE.Vector3(0, -micBoomLength / 2, 0);
  micTip.position.copy(micBoom.position.clone().add(boomEndOffset.applyEuler(micBoom.rotation)));


  //  Add All to Group 
  product.add(
    leftOuterCup,
    leftInnerCup,
    rightOuterCup,
    rightInnerCup,
    leftCushion,
    rightCushion,
    micBoom,
    micTip
  );
  product.rotation.x = -Math.PI / 12; // backward tilt

  product.position.set(0, 0, 0);
  return product;
}
