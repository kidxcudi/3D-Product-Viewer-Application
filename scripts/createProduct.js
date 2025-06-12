import * as THREE from 'three';

// Build a 3D headphone using only basic geometries
export function createProduct() {
  // Group to hold all parts of the product
  const product = new THREE.Group();

  // --- Ear Cups (cylinders) ---
  const earCupGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 32);
  const earCupMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.3,
    roughness: 0.6,
  });

  const leftEarCup = new THREE.Mesh(earCupGeometry, earCupMaterial);
  leftEarCup.rotation.x = Math.PI / 2;   // Rotate so flat side faces inward
  leftEarCup.position.set(-1, 0, 0);     // Position to the left

  const rightEarCup = leftEarCup.clone();
  rightEarCup.position.set(1, 0, 0);     // Position to the right

  // --- Cushions (torus) ---
  const cushionGeometry = new THREE.TorusGeometry(0.6, 0.1, 16, 100);
  const cushionMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    metalness: 0.2,
  });

  const leftCushion = new THREE.Mesh(cushionGeometry, cushionMaterial);
  leftCushion.rotation.y = Math.PI / 2;
  leftCushion.position.copy(leftEarCup.position);

  const rightCushion = leftCushion.clone();
  rightCushion.position.copy(rightEarCup.position);

  // --- Headband (3 bent cylinder segments) ---
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

  // Add all parts to the main group
  product.add(
    leftEarCup,
    rightEarCup,
    leftCushion,
    rightCushion,
    segment1,
    segment2,
    segment3
  );

  // Keep product centered at origin for smooth orbit controls
  product.position.set(0, 0, 0);

  return product;
}
