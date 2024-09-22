import * as THREE from "three";

function Light() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.castShadow = true;
    this.directionalLight.position.set(100, 100, 100);
    this.directionalLight.shadow.mapSize.width = 1024*4;
    this.directionalLight.shadow.mapSize.height = 1024*4;
    const scope = 100;
    this.directionalLight.shadow.camera.near = 1;
    this.directionalLight.shadow.camera.far = 300;
    this.directionalLight.shadow.camera.left = -scope;
    this.directionalLight.shadow.camera.right = scope;
    this.directionalLight.shadow.camera.top = scope;
    this.directionalLight.shadow.camera.bottom = -scope;
}

export default Light;