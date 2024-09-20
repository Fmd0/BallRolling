import * as THREE from "three";
import {BallColors} from "./utils/constants";


function Ball(index, position) {
    this.mesh = new THREE.Mesh(
        new THREE.SphereGeometry(2),
        new THREE.MeshToonMaterial({
            color: BallColors[index]
        })
    )
    this.mesh.position.set([...position]);
}


function Balls() {
    this.mesh = new THREE.Group();

}

export {
    Ball,
    Balls
}