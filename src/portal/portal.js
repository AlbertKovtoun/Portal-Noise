import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import Stats from "stats.js";

import portalVertexShader from "../shaders/portal/vertex.glsl";
import portalFragmentShader from "../shaders/portal/fragment.glsl";

//Performance
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

//Init Debug
const pane = new Pane();
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 128, 128);

debugObject.baseColor = "#ff0000";
debugObject.accentColor = "#000000";

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
  side: THREE.DoubleSide,
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

pane.addInput(debugObject, "baseColor").on("change", () => {
  material.uniforms.uBaseColor.value.set(debugObject.baseColor);
});
pane.addInput(debugObject, "accentColor").on("change", () => {
  material.uniforms.uAccentColor.value.set(debugObject.accentColor);
});

pane.addInput(material.uniforms.uWaveSpeed, "value", {
  min: 0,
  max: 2,
  step: 0.01,
  label: "uWaveSpeed",
});

pane.addInput(material.uniforms.uWaveFrequency.value, "x", {
  min: 0,
  max: 20,
  step: 0.1,
  label: "uWaveFrequencyX",
});
pane.addInput(material.uniforms.uWaveFrequency.value, "y", {
  min: 0,
  max: 20,
  step: 0.1,
  label: "uWaveFrequencyY",
});

pane.addInput(material.uniforms.uWaveHeight.value, "x", {
  min: 0,
  max: 0.5,
  step: 0.01,
  label: "uWaveHeightX",
});
pane.addInput(material.uniforms.uWaveHeight.value, "y", {
  min: 0,
  max: 0.5,
  step: 0.01,
  label: "uWaveHeightY",
});

pane.addInput(material.uniforms.uNoiseFrequency, "value", {
  min: 0,
  max: 30,
  step: 0.1,
  label: "uNoiseFrequency",
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.set(0.25, -0.25, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
  material.uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  stats.end();
};

tick();
