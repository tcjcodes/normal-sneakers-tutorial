import './style.css';

import { animate, inView } from 'motion';
import {
    AmbientLight,
    BoxGeometry, DirectionalLight, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial,
    PerspectiveCamera, Scene, TorusKnotGeometry, WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const sneakerTag = document.querySelector('section.sneaker');

animate('header', {
    // slide down
    y: [-100, 0],
    // fade in
    opacity: [0, 1],
}, {
    duration: 1,
    // differentiate from next element on load
    delay: 2.5,
});

animate('section.new-drop', {
    // slide down
    y: [-100, 0],
    // fade in
    opacity: [0, 1],
}, { duration: 1, delay: 2 });

// Disappear content
animate('section.content', { opacity: 0 });

// Re-appear when in view
inView('section.content', (info) => {
    animate(info.target, { opacity: 1 }, { duration: 1, delay: 1 });
});

// -- ANIMATION --

// @source THREE.js docs
const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const webGLblack = 0x000000;
const alphaTransparency = 0;
renderer.setClearAlpha(webGLblack, alphaTransparency);

sneakerTag.appendChild(renderer.domElement);

// LIGHTING
const webGLWhite = 0xffffff;

const ambience = new AmbientLight(0x404040);
camera.add(ambience);

const strength = 1;
const keyLight = new DirectionalLight(webGLWhite, strength);
keyLight.position.set(-1, 1, 3);
camera.add(keyLight);

const fillLight = new DirectionalLight(webGLWhite, 0.5);
fillLight.position.set(1, 1, 3);
camera.add(fillLight);

const backLight = new DirectionalLight(webGLWhite, 1);
backLight.position.set(-1, 3, -1);
camera.add(backLight);

scene.add(camera);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 2;
controls.update();

// SHAPE
const geometry = new TorusKnotGeometry(1, 0.25, 100, 16);
// requires lighting
const material = new MeshLambertMaterial({ color: 0xff0000 });
const shape = new Mesh(geometry, material);

// fade and pull in from bottom:
const loadGroup = new Group();
loadGroup.position.y = -10;
loadGroup.add(shape);

scene.add(loadGroup);

animate((timeline) => {
loadGroup.position.y = -10 + (10 * timeline);
}, { duration: 2, delay: 1 })

camera.position.z = 5;

const render = () => {
    controls.update();

    renderer.render(scene, camera);
};

renderer.setAnimationLoop(render);