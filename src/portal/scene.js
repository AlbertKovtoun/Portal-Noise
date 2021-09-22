import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import Stats from "stats.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

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
const shaderGeometry = new THREE.PlaneGeometry(2, 2.5, 256, 256);

debugObject.baseColor = "#ff0000";
debugObject.accentColor = "#000000";

// Portal Material
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

const portalMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
portalMesh.position.set(0, 0.5, -0.05);

const portalFolder = pane.addFolder({ title: "Portal" });

portalFolder.addInput(portalMesh.scale, "x", {
  min: 0,
  max: 5,
  step: 0.01,
  label: "portalScaleX",
});
portalFolder.addInput(portalMesh.scale, "y", {
  min: 0,
  max: 5,
  step: 0.01,
  label: "portalScaleY",
});
portalFolder.addInput(portalMesh.scale, "z", {
  min: 0,
  max: 5,
  step: 0.01,
  label: "portalScaleZ",
});
portalFolder.addInput(portalMesh.position, "x", {
  min: -2,
  max: 2,
  step: 0.01,
  label: "portalPositionX",
});
portalFolder.addInput(portalMesh.position, "y", {
  min: -2,
  max: 2,
  step: 0.01,
  label: "portalPositionY",
});
portalFolder.addInput(portalMesh.position, "z", {
  min: -1,
  max: 1,
  step: 0.01,
  label: "portalPositionZ",
});

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
camera.position.set(0.25, 0.5, 8);
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
renderer.shadowMap.needsUpdate = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;

/**
 * Post Processing
 */
const effectComposer = new EffectComposer(renderer);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const unrealBloomPass = new UnrealBloomPass();
effectComposer.addPass(unrealBloomPass);

unrealBloomPass.strength = 0.14;
unrealBloomPass.radius = 1;
unrealBloomPass.threshold = 0.455;

const postprocessingFolder = pane.addFolder({ title: "Post Processing" });

postprocessingFolder.addInput(unrealBloomPass, "strength", {
  min: 0,
  max: 0.5,
  step: 0.001,
  label: "bloomStrength",
});
postprocessingFolder.addInput(unrealBloomPass, "radius", {
  min: 0,
  max: 5,
  step: 0.001,
  label: "bloomRadius",
});
postprocessingFolder.addInput(unrealBloomPass, "threshold", {
  min: 0,
  max: 2,
  step: 0.001,
  label: "bloomThreshold",
});

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
  // renderer.render(scene, camera);
  effectComposer.render(scene, camera);

  // Call tick again on the next frame
  // window.requestAnimationFrame(tick);

  setTimeout(function () {
    requestAnimationFrame(tick);
  }, 1000 / 60);

  stats.end();
};

tick();
