import * as THREE from 'three';
import GUI from 'lil-gui';
import {Ball} from "./Balls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
window.document.body.appendChild(renderer.domElement);

camera.position.set(5,5,5);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xCB4B8B, 1);
renderer.shadowMap.enabled = true;
// scene.fog = new THREE.Fog(0xCB4B8B, 100, 1000);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000, 1),
    new THREE.MeshBasicMaterial({
        color: 0xCB4B8B,
    })
)
scene.add(plane);

const ball = new Ball(0, [0,0,0]);
scene.add(ball.mesh)

const axis = new THREE.AxesHelper(100);
scene.add(axis);

const gui = new GUI();
gui.add(plane.rotation, "x").min(0).max(Math.PI);
gui.add(plane.rotation, "y").min(0).max(Math.PI);
gui.add(plane.rotation, "z").min(0).max(Math.PI);