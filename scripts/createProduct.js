import * as THREE from 'three';
import { materials } from '../assets/materials.js';

// Store individual material instances for later dynamic updates (e.g., theming).
export const clonedMaterials = {
  metal: [],
  innerMetal: [],
  cushion: [],
  mic: [],
  plastic: []
};


 //Creates and returns a complete 3D product model (a headset).
export function createProduct() {
  const product = new THREE.Group(); // Root container for all product parts

  // === HEADBAND CONSTRUCTION ===
  // Simulate the arc of a headband using connected box segments.
  const headbandPoints = [
    new THREE.Vector3(-0.85, 0.4, 0),  // Near left ear
    new THREE.Vector3(-0.85, 1.0, 0),  // Upwards
    new THREE.Vector3(-0.45, 1.6, 0),  // Left top curve
    new THREE.Vector3(0.45, 1.6, 0),   // Right top curve
    new THREE.Vector3(0.85, 1.0, 0),   // Downwards
    new THREE.Vector3(0.85, 0.4, 0)    // Near right ear
  ];

  // Loop through pairs of points and create a box to bridge each pair
  for (let i = 0; i < headbandPoints.length - 1; i++) {
    const start = headbandPoints[i];
    const end = headbandPoints[i + 1];
    const direction = new THREE.Vector3().subVectors(end, start);
    const overlap = i === 2 ? 0.042 : 0.03; // Slightly extend segment to avoid visible seams
    const length = direction.length() + overlap;

    // Clone plastic material to make segments individually editable
    const segmentMaterial = materials.plastic;
    clonedMaterials.plastic.push(segmentMaterial);

    const segment = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, length, 0.3), // Width, Height, Depth of segment
      segmentMaterial
    );

    // Position segment at midpoint between the two points
    segment.position.copy(start.clone().add(end).multiplyScalar(0.5));

    // Rotate the box so it aligns between the two points
    segment.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()     
    );

    // Label the segment for interactivity
    segment.name = `Headband Segment ${i + 1}`;
    segment.userData.interactive = true;
    segment.userData.explodable = true;

    // Compute an outward explosion direction
    const arcCenter = new THREE.Vector3(0, 1.0, 0); // Approximate center of arc
    const midpoint = start.clone().add(end).multiplyScalar(1.5);
    const outwardDir = midpoint.clone().sub(arcCenter).normalize();
    outwardDir.y += 0.2; // Add slight upward movement
    outwardDir.normalize();
    segment.userData.explosionVector = outwardDir;

    segment.castShadow = true;
    segment.receiveShadow = true;

    product.add(segment);
  }

  // === SHARED GEOMETRIES ===
  // Define reusable shapes for left and right ears
  const outerCupGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32); // Metal ear cup
  const innerCupGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32); // Inner metal mesh
  const cushionGeometry = new THREE.TorusGeometry(0.34, 0.1, 16, 100);   // Ear cushion ring

  // === LEFT EAR ===
  // 1. Outer cup (metal)
  const leftOuterCupMaterial = materials.metal.clone();
  clonedMaterials.metal.push(leftOuterCupMaterial);
  const leftOuterCup = new THREE.Mesh(outerCupGeometry, leftOuterCupMaterial);
  leftOuterCup.rotation.z = Math.PI / 2; // Rotate to align horizontally
  leftOuterCup.position.set(-0.87, 0.3, 0); // Position on left side
  leftOuterCup.name = "Left Outer Ear Cup";
  leftOuterCup.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(-1.1, 0, 0)
  };
  leftOuterCup.receiveShadow = true;

  // 2. Inner mesh (smaller inner cylinder)
  const leftInnerCupMaterial = materials.innerMetal.clone();
  clonedMaterials.innerMetal.push(leftInnerCupMaterial);
  const leftInnerCup = new THREE.Mesh(innerCupGeometry, leftInnerCupMaterial);
  leftInnerCup.rotation.z = Math.PI / 2;
  leftInnerCup.position.set(-0.97, 0.3, 0); // Slightly inside outer cup
  leftInnerCup.name = "Left Inner Ear Cup";
  leftInnerCup.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(-1.5, 0, 0)
  };

  // 3. Cushion (torus-shaped)
  const leftCushionMaterial = materials.cushion.clone();
  clonedMaterials.cushion.push(leftCushionMaterial);
  const leftCushion = new THREE.Mesh(cushionGeometry, leftCushionMaterial);
  leftCushion.rotation.y = Math.PI / 2;
  leftCushion.position.set(-0.785, 0.3, 0); // Slightly outside outer cup
  leftCushion.name = "Left Ear Cushion";
  leftCushion.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(-0.5, 0, 0)
  };
  leftCushion.castShadow = true;
  leftCushion.receiveShadow = true;

  // === RIGHT EAR === (mirrors the left ear, just flipped)
  const rightOuterCupMaterial = materials.metal.clone();
  clonedMaterials.metal.push(rightOuterCupMaterial);
  const rightOuterCup = new THREE.Mesh(outerCupGeometry, rightOuterCupMaterial);
  rightOuterCup.rotation.z = Math.PI / 2;
  rightOuterCup.position.set(0.87, 0.3, 0);
  rightOuterCup.name = "Right Outer Ear Cup";
  rightOuterCup.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(1.1, 0, 0)
  };
  rightOuterCup.receiveShadow = true;

  const rightInnerCupMaterial = materials.innerMetal.clone();
  clonedMaterials.innerMetal.push(rightInnerCupMaterial);
  const rightInnerCup = new THREE.Mesh(innerCupGeometry, rightInnerCupMaterial);
  rightInnerCup.rotation.z = Math.PI / 2;
  rightInnerCup.position.set(0.97, 0.3, 0);
  rightInnerCup.name = "Right Inner Ear Cup";
  rightInnerCup.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(1.5, 0, 0)
  };

  const rightCushionMaterial = materials.cushion.clone();
  clonedMaterials.cushion.push(rightCushionMaterial);
  const rightCushion = new THREE.Mesh(cushionGeometry, rightCushionMaterial);
  rightCushion.rotation.y = Math.PI / 2;
  rightCushion.position.set(0.785, 0.3, 0);
  rightCushion.name = "Right Ear Cushion";
  rightCushion.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(0.5, 0, 0)
  };
  rightCushion.castShadow = true;
  rightCushion.receiveShadow = true;

  // === MICROPHONE BOOM ===
  // Cylinder arm that extends from the right ear cup
  const micBoomMaterial = materials.mic.clone();
  clonedMaterials.mic.push(micBoomMaterial);
  const micBoom = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.025, 0.7, 20), // Tapered arm
    micBoomMaterial
  );
  micBoom.name = "Mic Boom";
  micBoom.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(1, 0, 0.65)
  };
  micBoom.position.set(0.865, 0, 0.5); // Comes out of right cup
  micBoom.rotation.z = -Math.PI / 18;
  micBoom.rotation.x = -Math.PI / 2.5;

  // === MICROPHONE TIP ===
  // Small rounded sphere at the end of the mic boom
  const micTipMaterial = materials.mic.clone();
  clonedMaterials.mic.push(micTipMaterial);
  const micTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    micTipMaterial
  );
  micTip.name = "Mic Tip";
  micTip.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(0.945, -0.125, 1)
  };
  micTip.castShadow = true;
  micTip.receiveShadow = true;

  // Position the tip at the end of the boom
  const boomEndOffset = new THREE.Vector3(0, -0.35, 0);
  micTip.position.copy(micBoom.position.clone().add(boomEndOffset.applyEuler(micBoom.rotation)));

  // Assemble all components together ===
  product.add(
    leftOuterCup, leftInnerCup, leftCushion,
    rightOuterCup, rightInnerCup, rightCushion,
    micBoom, micTip
  );

  product.name = 'product';
  product.rotation.x = -Math.PI / 12; // Subtle tilt for better camera view
  product.position.set(0, 0, 0);

  return product;
}
