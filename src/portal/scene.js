import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import Stats from "stats.js";

import portalVertexShader from "../shaders/portal/vertex.glsl";
import portalFragmentShader from "../shaders/portal/fragment.glsl";

import { loadRoom } from "./room";
import { setLights } from "./lights";

//Performance
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

//Init Debug
export const pane = new Pane({ title: "Portal Noise" });
const debugObject = {};

//Loaders
const textureLoader = new THREE.TextureLoader();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
export const scene = new THREE.Scene();

// Portal Geometry
const shaderGeometry = new THREE.PlaneGeometry(1, 1, 256, 256);

debugObject.baseColor = "#ff0000";
debugObject.accentColor = "#000000";

// Material
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
  // side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },

    uWaveSpeed: { value: 0.1 },

    uWaveFrequency: { value: new THREE.Vector2(5, 10) },
    uWaveHeight: { value: new THREE.Vector2(0.08, 0.04) },

    uNoiseFrequency: { value: 10 },

    uBaseColor: { value: new THREE.Color(debugObject.baseColor) },
    uAccentColor: { value: new THREE.Color(debugObject.accentColor) },
  },
});

const portalFolder = pane.addFolder({ title: "Portal" });

portalFolder.addInput(debugObject, "baseColor").on("change", () => {
  shaderMaterial.uniforms.uBaseColor.value.set(debugObject.baseColor);
});
portalFolder.addInput(debugObject, "accentColor").on("change", () => {
  shaderMaterial.uniforms.uAccentColor.value.set(debugObject.accentColor);
});

portalFolder.addInput(shaderMaterial.uniforms.uWaveSpeed, "value", {
  min: 0,
  max: 2,
  step: 0.01,
  label: "uWaveSpeed",
});

portalFolder.addInput(shaderMaterial.uniforms.uWaveFrequency.value, "x", {
  min: 0,
  max: 20,
  step: 0.1,
  label: "uWaveFrequencyX",
});
portalFolder.addInput(shaderMaterial.uniforms.uWaveFrequency.value, "y", {
  min: 0,
  max: 20,
  step: 0.1,
  label: "uWaveFrequencyY",
});

portalFolder.addInput(shaderMaterial.uniforms.uWaveHeight.value, "x", {
  min: 0,
  max: 0.5,
  step: 0.01,
  label: "uWaveHeightX",
});
portalFolder.addInput(shaderMaterial.uniforms.uWaveHeight.value, "y", {
  min: 0,
  max: 0.5,
  step: 0.01,
  label: "uWaveHeightY",
});

portalFolder.addInput(shaderMaterial.uniforms.uNoiseFrequency, "value", {
  min: 0,
  max: 30,
  step: 0.1,
  label: "uNoiseFrequency",
});

// Mesh
const portalMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
scene.add(portalMesh);

//Import room
loadRoom();

//Lights
setLights();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.25, 0.5, 5);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  stats.begin();

  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  //Portal movement
  shaderMaterial.uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  stats.end();
};

tick();
