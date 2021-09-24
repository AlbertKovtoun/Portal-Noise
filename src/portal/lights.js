import * as THREE from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

import { scene } from "./scene";
import { pane } from "./scene";

export const setLights = () => {
  const lightsFolder = pane.addFolder({ title: "Lights" });

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
  scene.add(ambientLight);

  lightsFolder.addInput(ambientLight, "intensity", {
    min: 0,
    max: 1,
    step: 0.001,
    label: "ambientLightIntensity",
  });

  //!pointLight1
  const pointLight1 = new THREE.PointLight(0xff0000, 1.5, 7);
  pointLight1.position.z = 2;
  pointLight1.castShadow = true;
  pointLight1.position.set(0, 1.8, 3.1);
  scene.add(pointLight1);
  const pointLight1Helper = new THREE.PointLightHelper(pointLight1);
  //   scene.add(pointLight1Helper);

  //Light1 Tweaks
  lightsFolder.addInput(pointLight1.position, "x", {
    min: -5,
    max: 5,
    step: 0.001,
    label: "light1PosX",
  });
  lightsFolder.addInput(pointLight1.position, "y", {
    min: -5,
    max: 5,
    step: 0.001,
    label: "light1PosY",
  });
  lightsFolder.addInput(pointLight1.position, "z", {
    min: -5,
    max: 5,
    step: 0.001,
    label: "light1PosZ",
  });
  lightsFolder.addInput(pointLight1, "intensity", {
    min: 0,
    max: 2,
    step: 0.001,
    label: "light1Intensity",
  });

  //!pointLight2
  const pointLight2 = new THREE.PointLight(0xffffff, 1, 7);
  pointLight2.position.z = 2;
  pointLight2.position.set(5.7, 0.5, 0.9);
  pointLight2.castShadow = true;
  pointLight2.shadow.bias = -0.009;
  pointLight1.shadow.bias = -0.009;
  scene.add(pointLight2);
  const pointLight2Helper = new THREE.PointLightHelper(pointLight2);
  //   scene.add(pointLight2Helper);

  //Light2 Tweaks
  lightsFolder.addInput(pointLight2.position, "x", {
    min: -8,
    max: 8,
    step: 0.001,
    label: "light2PosX",
  });
  lightsFolder.addInput(pointLight2.position, "y", {
    min: -5,
    max: 5,
    step: 0.001,
    label: "light2PosY",
  });
  lightsFolder.addInput(pointLight2.position, "z", {
    min: -1,
    max: 4,
    step: 0.001,
    label: "light2PosZ",
  });
  lightsFolder.addInput(pointLight2, "intensity", {
    min: 0,
    max: 2,
    step: 0.001,
    label: "light2Intensity",
  });

  //!portalLight
  const portalLight = new THREE.RectAreaLight(0xff0000, 10, 2, 2);
  portalLight.rotation.y = Math.PI;
  portalLight.position.set(0, 0.54, 0.175);
  scene.add(portalLight);
  const portalLightHelper = new RectAreaLightHelper(portalLight);
  //   scene.add(portalLightHelper);

  //prtalLight Tweaks
  lightsFolder.addInput(portalLight.position, "x", {
    min: -8,
    max: 8,
    step: 0.001,
    label: "portalLightPosX",
  });
  lightsFolder.addInput(portalLight.position, "y", {
    min: -5,
    max: 5,
    step: 0.001,
    label: "portalLightPosY",
  });
  lightsFolder.addInput(portalLight.position, "z", {
    min: -1,
    max: 1,
    step: 0.001,
    label: "portalLightPosZ",
  });
  lightsFolder.addInput(portalLight, "intensity", {
    min: 0,
    max: 40,
    step: 0.01,
    label: "portalLightIntensity",
  });
};
