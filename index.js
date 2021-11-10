import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useFrame, useCleanup, usePhysics, useApp} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');
const texBase = 'Vol_52_2';

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
  
  const size = new THREE.Vector3(2, 1, 1);
  const radius = 0.5;
  const physicsMaterial = new THREE.Vector3(0, 0, 0);
  const geometry = new THREE.SphereBufferGeometry(radius, 32, 16);
 
  /*const map = new THREE.Texture();
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
    img.src = baseUrl + texBase + '_Base_Color.png';
  }
  const normalMap = new THREE.Texture();
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  {
    const img = new Image();
    img.onload = () => {
      normalMap.image = img;
      normalMap.needsUpdate = true;
    };
    img.onerror = err => {
      console.warn(err);
    };
    img.crossOrigin = 'Anonymous';
    img.src = baseUrl + texBase + '_Normal.png';
  }
  const bumpMap = new THREE.Texture();
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  {
    const img = new Image();
    img.onload = () => {
      bumpMap.image = img;
      bumpMap.needsUpdate = true;
    };
    img.onerror = err => {
      console.warn(err);
    };
    img.crossOrigin = 'Anonymous';
    img.src = baseUrl + texBase + '_Height.png';
  }
  const material = new THREE.MeshStandardMaterial({
    // color: 0x00b2fc,
    // specular: 0x00ffff,
    // shininess: 20,
    map,
    normalMap,
    bumpMap,
    roughness: 1,
    metalness: 0,
  });*/
  const physicsCube = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
  app.add(physicsCube);

  const physicsObject = physics.addSphereGeometry(new THREE.Vector3(0, 0, 0), new THREE.Quaternion(), 0.5, true);
  const {physicsMesh} = physicsObject;
  // window.physicsCube = physicsCube;
  // window.physicsMesh = physicsMesh;

  let updateIndex = 0;
  const p = new THREE.Vector3(0, 10, 0);
  const q = new THREE.Quaternion(0, 0, 0, 1);
  const s = new THREE.Vector3(1, 1, 1);
  useFrame(({timestamp}) => {
    if ((updateIndex % 300) === 0) {
      // console.log('reset pos 1', physicsObject.position.toArray().join(','));
      physicsObject.position.copy(app.position).add(p);
      physicsObject.quaternion.copy(app.quaternion).premultiply(q);
      // physicsObject.physicsMesh.scale.copy(s);
      physicsObject.updateMatrixWorld();
      physicsObject.needsUpdate = true;
      // physics.setPhysicsTransform(physicsCubePhysicsId, p, q, s);
      // const {position, quaternion} = physics.getPhysicsTransform(physicsCubePhysicsId);
    }
    // console.log('tick pos 1', physicsCube.position.toArray().join(','));
    // const {position, quaternion} = physics.getPhysicsTransform(physicsCubePhysicsId);
    physicsObject.updateMatrixWorld();
    localMatrix.copy(physicsObject.matrixWorld)
      .premultiply(localMatrix2.copy(app.matrixWorld).invert())
      .decompose(physicsCube.position, physicsCube.quaternion, physicsCube.scale);
    // console.log('position', physicsObject.position.toArray().join(','), physicsCube.position.toArray().join(','));
    app.updateMatrixWorld();
    // physicsCube.updateMatrixWorld();
    updateIndex++;
  });
  
  useCleanup(() => {
    // console.log('cleanup 1');
    physics.removeGeometry(physicsObject);
  });
  
  return app;
};