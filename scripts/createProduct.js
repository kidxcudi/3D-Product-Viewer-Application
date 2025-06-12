import * as THREE from 'three';

// Build a 3D headphone using only basic geometries
export function createProduct() {
  // Group to hold all parts of the product
  const product = new THREE.Group();

  // create ear cup geometry and material
  const earCupGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 32);
  const earCupMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.3,
    roughness: 0.6,
  });

  // create left ear cup
  const leftEarCup = new THREE.Mesh(earCupGeometry, earCupMaterial);
  leftEarCup.rotation.x = Math.PI / 2;   // Rotate so flat side faces inward
  leftEarCup.position.set(-1, 0, 0);     // Position to the left

  // create right ear cup
  const rightEarCup = leftEarCup.clone();
  rightEarCup.position.set(1, 0, 0);     // Position to the right

  // create ear cushions
  const cushionGeometry = new THREE.TorusGeometry(0.6, 0.1, 16, 100);
  const cushionMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    metalness: 0.2,
  });

  // left cushion
  const leftCushion = new THREE.Mesh(cushionGeometry, cushionMaterial);
  leftCushion.rotation.y = Math.PI / 2;
  leftCushion.position.copy(leftEarCup.position);

  // right cushion
  const rightCushion = leftCushion.clone();
  rightCushion.position.copy(rightEarCup.position);

  // create headband segments (3 bent cylinder segments) ---
  const segmentGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
  const bandMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

  const segment1 = new THREE.Mesh(segmentGeometry, bandMaterial);
  segment1.rotation.z = Math.PI / 4;
  segment1.position.set(-0.7, 1, 0);     // Left angled band

  const segment2 = new THREE.Mesh(segmentGeometry, bandMaterial);
  segment2.rotation.z = 0;
  segment2.position.set(0, 1.3, 0);      // Top band (horizontal)

  const segment3 = new THREE.Mesh(segmentGeometry, bandMaterial);
  segment3.rotation.z = -Math.PI / 4;
  segment3.position.set(0.7, 1, 0);      // Right angled band

  // create mic boom
  const micGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
  const micMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });

  const micBoom = new THREE.Mesh(micGeometry, micMaterial);
  micBoom.rotation.z = -Math.PI / 3;
  micBoom.position.set(-1.4, -0.4, 0.4);

  // mic tip
  const micTipGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  const micTip = new THREE.Mesh(micTipGeometry, micMaterial);
  micTip.position.set(-1.85, -0.7, 0.65);

  // Add all parts to the main group
  product.add(
    leftEarCup,
    rightEarCup,
    leftCushion,
    rightCushion,
    segment1,
    segment2,
    segment3,
    micBoom,
    micTip
  );

  // Keep product centered at origin for smooth orbit controls
  product.position.set(0, 0, 0);

  return product;
}
