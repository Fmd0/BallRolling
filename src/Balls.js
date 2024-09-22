import * as THREE from "three";
import {BallColors} from "./utils/constants";

const ballGeometry = new THREE.SphereGeometry(2);
const ballMaterialFirst = new THREE.MeshToonMaterial({
    color: BallColors[0]
})
const ballMaterialSecond = new THREE.MeshToonMaterial({
    color: BallColors[1]
})
const ballMaterialList = [
    ballMaterialFirst,
    ballMaterialSecond
]


function Ball(index, position) {
    this.mesh = new THREE.Mesh(
        ballGeometry,
        ballMaterialList[index],
    )
    this.mesh.position.set(...position);
    this.mesh.castShadow = true;
}


function Balls() {
    this.mesh = new THREE.Group();
}

export {
    Ball,
    Balls
}