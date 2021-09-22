import * as THREE from "three";

import { scene } from "./scene";

export const setLights = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  scene.add(pointLight);
};
