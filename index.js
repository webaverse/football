import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useFrame, useCleanup, usePhysics, useApp} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

const localVector = new THREE.Vector3();
const localVector2 = new THREE.Vector3();
const localVector3 = new THREE.Vector3();
const localVector4 = new THREE.Vector3();
const localTriangle = new THREE.Triangle();
const localMatrix = new THREE.Matrix4();
const localMatrix2 = new THREE.Matrix4();

export default () => {
  const app = useApp();
  const physics = usePhysics();
  
  const radius = 0.5;
  const physicsMaterial = new THREE.Vector3(1, 1, 1);
  const geometry = new THREE.SphereGeometry(radius, 32, 16);
 
  const map = new THREE.Texture();
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  {
    const img = new Image();
    img.onload = () => {
      map.image = img;
      map.needsUpdate = true;
    };
    img.onerror = err => {
      console.warn(err);
    };
    img.crossOrigin = 'Anonymous';
    img.src = 'https://i.ibb.co/tX1gj29/sda.jpg';
  }
  
  const material = new THREE.MeshStandardMaterial({
    map,
    roughness: 1,
    metalness: 0,
  });

  const physicsBall = new THREE.Mesh(geometry, material);
  app.add(physicsBall);

  const physicsObject = physics.addSphereGeometry(new THREE.Vector3(0, 0, 0), new THREE.Quaternion(), radius, physicsMaterial, true);
  const {physicsMesh} = physicsObject;
  
  useFrame(({timestamp}) => {
    physicsObject.updateMatrixWorld();
    localMatrix.copy(physicsObject.matrixWorld)
      .premultiply(localMatrix2.copy(app.matrixWorld).invert())
      .decompose(physicsBall.position, physicsBall.quaternion, physicsBall.scale);

    app.updateMatrixWorld();
    physicsBall.updateMatrixWorld();
  });
  
  useCleanup(() => {
    physics.removeGeometry(physicsObject);
  });
  
  return app;
};