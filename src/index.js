import * as THREE from 'three';
import GUI from 'lil-gui';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import {Ball} from "./Balls";
import { YELLOW_BALL_COLOR_INDEX} from "./utils/constants";
import Light from "./Light";
import CANNON from 'cannon'
import {randomImpulse, randomPosition3D} from "./random";


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
window.document.body.appendChild(renderer.domElement);

camera.position.set(-15,12,38);
// camera.lookAt(0,20,48);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setClearColor(0xCB4B8B, 1);
renderer.shadowMap.enabled = true;
scene.fog = new THREE.Fog(0xCB4B8B, 0, 80);

const light = new Light();
scene.add(light.ambientLight);
scene.add(light.directionalLight);

const planeRotationOffset = Math.PI/12;
const planeRotation = [-Math.PI/2+planeRotationOffset, planeRotationOffset, 0];
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200, 1),
    new THREE.MeshToonMaterial({
        color: 0xCB4B8B,
        opacity: 0.5,
    })
)
plane.rotation.set(...planeRotation);
plane.receiveShadow = true;
scene.add(plane);

// const position = [-10, 10, 0];
const position = randomPosition3D(20);

const ball = new Ball(YELLOW_BALL_COLOR_INDEX, position);
scene.add(ball.mesh)


// const axis = new THREE.AxesHelper(100);
// scene.add(axis);

const orbitControls = new OrbitControls(camera, renderer.domElement);

// const gui = new GUI();
// gui.add(plane.rotation, "x").min(-Math.PI).max(Math.PI).step(0.01);
// gui.add(plane.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01);
// gui.add(plane.rotation, "z").min(-Math.PI).max(Math.PI);

const world = new CANNON.World();
world.gravity.set(0, -10, 0);
const planeBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
})
planeBody.quaternion.setFromEuler(...planeRotation);
world.addBody(planeBody);

const ballBody = new CANNON.Body({
    mass: 1,
    position: {x:position[0], y:position[1], z: position[2]},
    shape: new CANNON.Sphere(2)
})
ballBody.applyLocalImpulse(
    new CANNON.Vec3(3, -6, 0),
    {x: 0, y: 0, z: 0},
)
world.addBody(ballBody);

const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0,
        restitution: 0.99
    }
);
world.defaultContactMaterial = defaultContactMaterial;

let ballList = [];

const initialBall = () => {
    Array.from({length: 10}).map(_ => {
        const position = randomPosition3D(80);
        position[0] -= 40;
        position[1] += 40*0.27*1.3;
        position[2] -= 20;
        const ball = new Ball(Math.round(Math.random()), position);
        scene.add(ball.mesh);
        const ballBody = new CANNON.Body({
            mass: 1,
            position: {x:position[0], y:position[1], z: position[2]},
            shape: new CANNON.Sphere(2)
        })
        ballBody.applyLocalImpulse(
            new CANNON.Vec3(...randomImpulse(10)),
            {x: 0, y: 0, z: 0},
        )
        world.addBody(ballBody);
        ballList.push({
            mesh: ball.mesh,
            body: ballBody,
        })
    })
    Array.from({length: 10}).map(_ => {
        const position = randomPosition3D(80);
        // position[0] -= 40;
        // position[1] += 40*0.27*1.3;
        // position[2] -= 20;
        const ball = new Ball(Math.round(Math.random()), position);
        scene.add(ball.mesh);
        const ballBody = new CANNON.Body({
            mass: 1,
            position: {x:position[0], y:position[1], z: position[2]},
            shape: new CANNON.Sphere(2)
        })
        ballBody.applyLocalImpulse(
            new CANNON.Vec3(...randomImpulse(10)),
            {x: 0, y: 0, z: 0},
        )
        world.addBody(ballBody);
        ballList.push({
            mesh: ball.mesh,
            body: ballBody,
        })
    })
}

initialBall();
const offset = 70;
const addBall = () => {
    Array.from({length: 7}).map(_ => {
        const position = randomPosition3D(80);
        position[0] -= offset;
        position[1] += offset*0.27*1.8;
        position[2] -= offset;
        const ball = new Ball(Math.round(Math.random()), position);
        scene.add(ball.mesh);
        const ballBody = new CANNON.Body({
            mass: 1,
            position: {x:position[0], y:position[1], z: position[2]},
            shape: new CANNON.Sphere(2)
        })
        ballBody.applyLocalImpulse(
            new CANNON.Vec3(...randomImpulse(5)),
            {x: 0, y: 0, z: 0},
        )
        world.addBody(ballBody);
        ballList.push({
            mesh: ball.mesh,
            body: ballBody,
        })
    })
}

setInterval(addBall, 1000)

setInterval(() => {
    console.log(camera.position);
    console.log(orbitControls.target);
}, 3000)

let oldElapsedTime = 0;
const clock = new THREE.Clock();

const update = () => {
    renderer.render(scene, camera);

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime-oldElapsedTime;
    oldElapsedTime = elapsedTime;
    world.step(1/60, deltaTime, 3);

    ball.mesh.position.copy(ballBody.position);
    ball.mesh.quaternion.copy(ballBody.quaternion);
    ballList = ballList.filter(({mesh, body}) => {
        if(mesh.position.x > 100 || mesh.position.z > 100) {
            scene.remove(mesh);
            world.removeBody(body);
            return false;
        }
        return true;
    })
    ballList.forEach(({mesh, body}) => {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
    })
    // if(ball && ballBody) {
    //     ball.position.copy(ballBody.position);
    //     ball.quaternion.copy(ballBody.quaternion);
    // }


    window.requestAnimationFrame(update);

}

update();
