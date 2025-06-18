import * as THREE from 'three';
import { materials } from '../assets/materials.js';

// The product is built from multiple meshes grouped into a single THREE.Group
export function createProduct() {
  const product = new THREE.Group(); // This group will hold all the parts of the product

  // Create the HEADBAND PARTS

  // These points define the curve of the headband from left to right
  const headbandPoints = [
    new THREE.Vector3(-0.85, 0.4, 0),
    new THREE.Vector3(-0.85, 1.0, 0),
    new THREE.Vector3(-0.45, 1.6, 0),
    new THREE.Vector3(0.45, 1.6, 0),
    new THREE.Vector3(0.85, 1.0, 0),
    new THREE.Vector3(0.85, 0.4, 0)
  ];

  // Loop through each pair of points and connect them with a box to form segments
  for (let i = 0; i < headbandPoints.length - 1; i++) {
    const start = headbandPoints[i];
    const end = headbandPoints[i + 1];

    // Calculate the direction and length between each pair
    const direction = new THREE.Vector3().subVectors(end, start);
    const overlap = i === 2 ? 0.042 : 0.03; // Slight overlap to avoid gaps
    const length = direction.length() + overlap;

    // Create a narrow box to represent each curved segment
    const segment = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, length, 0.3),
      materials.plastic
    );

    // Position the segment at the midpoint between start and end
    segment.position.copy(start.clone().add(end).multiplyScalar(0.5));

    // Rotate the segment so it aligns with the direction vector
    segment.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    );

    // Mark this mesh as interactive and explodable
    segment.name = `Headband Segment ${i + 1}`;
    segment.userData.interactive = true;
    segment.userData.explodable = true;

    // Calculate an explosion direction pushing outward from the arc
    const arcCenter = new THREE.Vector3(0, 1.0, 0); // Center of curve
    const midpoint = start.clone().add(end).multiplyScalar(1.5); // Go a bit past midpoint
    const outwardDir = midpoint.clone().sub(arcCenter).normalize();
    outwardDir.y += 0.2; // Add vertical boost
    outwardDir.normalize();
    segment.userData.explosionVector = outwardDir;

    // Enable shadows for realism
    segment.castShadow = true;
    segment.receiveShadow = true;

    // Add this headband piece to the main group
    product.add(segment);
  }

  // SHARED GEOMETRY for cups and cushions
  const outerCupGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
  const innerCupGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
  const cushionGeometry = new THREE.TorusGeometry(0.34, 0.1, 16, 100);

  // LEFT EAR COMPONENTS

  // Outer shell of the left ear cup
  const leftOuterCup = new THREE.Mesh(outerCupGeometry, materials.metal.clone());
  leftOuterCup.rotation.z = Math.PI / 2; // Rotate so it's flat like a speaker
  leftOuterCup.position.set(-0.87, 0.3, 0); // Position on the left
  leftOuterCup.name = "Left Outer Ear Cup";
  leftOuterCup.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(-1.1, 0, 0)
  };
  leftOuterCup.receiveShadow = true;

  // Inner part (speaker area)
  const leftInnerCup = new THREE.Mesh(innerCupGeometry, materials.innerMetal.clone());
  leftInnerCup.rotation.z = Math.PI / 2;
  leftInnerCup.position.set(-0.97, 0.3, 0); // Slightly deeper inside
  leftInnerCup.name = "Left Inner Ear Cup";
  leftInnerCup.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(-1.5, 0, 0)
  };

  // Cushion that wraps around the ear
  const leftCushion = new THREE.Mesh(cushionGeometry, materials.cushion.clone());
  leftCushion.rotation.y = Math.PI / 2;
  leftCushion.position.set(-0.785, 0.3, 0);
  leftCushion.name = "Left Ear Cushion";
  leftCushion.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(-0.5, 0, 0)
  };
  leftCushion.castShadow = true;
  leftCushion.receiveShadow = true;

  // RIGHT EAR COMPONENTS (same as left, mirrored)
  const rightOuterCup = new THREE.Mesh(outerCupGeometry, materials.metal.clone());
  rightOuterCup.rotation.z = Math.PI / 2;
  rightOuterCup.position.set(0.87, 0.3, 0);
  rightOuterCup.name = "Right Outer Ear Cup";
  rightOuterCup.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(1.1, 0, 0)
  };
  rightOuterCup.receiveShadow = true;

  const rightInnerCup = new THREE.Mesh(innerCupGeometry, materials.innerMetal.clone());
  rightInnerCup.rotation.z = Math.PI / 2;
  rightInnerCup.position.set(0.97, 0.3, 0);
  rightInnerCup.name = "Right Inner Ear Cup";
  rightInnerCup.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(1.5, 0, 0)
  };

  const rightCushion = new THREE.Mesh(cushionGeometry, materials.cushion.clone());
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

  // MICROPHONE BOOM AND TIP

  // Microphone boom arm extending from the side of ear cup
  const micBoom = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.025, 0.7, 20),
    materials.mic.clone()
  );
  micBoom.name = "Mic Boom";
  micBoom.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(1, 0, 0.65)
  };
  micBoom.position.set(0.865, 0, 0.5);
  micBoom.rotation.z = -Math.PI / 18;   // tilt outward
  micBoom.rotation.x = -Math.PI / 2.5; // angle downward

  // Microphone tip (ball at the end)
  const micTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    materials.mic.clone()
  );
  micTip.name = "Mic Tip";
  micTip.userData = {
    interactive: true,
    explodable: true,
    explosionVector: new THREE.Vector3(0.945, -0.125, 1)
  };
  micTip.castShadow = true;
  micTip.receiveShadow = true;

  // Position mic tip at the end of the boom using offset + rotation
  const boomEndOffset = new THREE.Vector3(0, -0.35, 0);
  micTip.position.copy(micBoom.position.clone().add(boomEndOffset.applyEuler(micBoom.rotation)));

  // ADD ALL COMPONENTS TO THE MAIN PRODUCT GROUP
  product.add(
    leftOuterCup, leftInnerCup, leftCushion,
    rightOuterCup, rightInnerCup, rightCushion,
    micBoom, micTip
  );

  // Final positioning and rotation of the entire product
  product.name = 'product';
  product.rotation.x = -Math.PI / 12; // slight downward tilt
  product.position.set(0, 0, 0); // Center the product in the scene

  return product;
}
