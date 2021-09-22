import * as THREE from "three";
import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { scene } from "./scene";

//Init Loaders
const gltfLoader = new GLTFLoader();
const textureLoader = new TextureLoader();

//Load Textures
const marbleTexture = textureLoader.load("/assets/textures/marbleColor.jpg");

//Define Materials
const roofMaterial = new THREE.MeshStandardMaterial({ color: "white" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "white" });
const marbleMaterial = new THREE.MeshStandardMaterial({
  map: marbleTexture,
  roughness: 0,
});
const lightMaterial = new THREE.MeshStandardMaterial({ emissive: 0xffffff });

export const loadRoom = () => {
  gltfLoader.load("/assets/models/portalRoom.glb", (gltf) => {
    const room = gltf.scene;

    //Fetch the names of the objects
    const wallsMesh = room.children.find((child) => {
      return child.name === "walls";
    });
    const floorMesh = room.children.find((child) => {
      return child.name === "floor";
    });
    const roofMesh = room.children.find((child) => {
      return child.name === "roof";
    });
    const frameMesh = room.children.find((child) => {
      return child.name === "frame";
    });
    const light1Mesh = room.children.find((child) => {
      return child.name === "light1";
    });
    const light2Mesh = room.children.find((child) => {
      return child.name === "light2";
    });

    //Assign Materials
    roofMesh.material = roofMaterial;
    wallsMesh.material = wallMaterial;
    floorMesh.material = marbleMaterial;
    light1Mesh.material = lightMaterial;
    light2Mesh.material = lightMaterial;

    room.position.set(0, -1, 0);
    scene.add(room);
  });
};
