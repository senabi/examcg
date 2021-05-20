import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};
var getRandomArbitrary = (min, max) => {
	return Math.random() * (max - min) + min;
};

const canvas = document.querySelector("#webgl");
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Handle window resizing
window.addEventListener("resize", () => {
	// Update dimensions
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	1000
);
camera.position.set(0, 0, 10);
scene.add(camera);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
camera.position.z = 100;

let stats = new Stats();
stats.domElement.style.position = "absolute";
stats.domElement.style.top = "0";
document.body.appendChild(stats.domElement);

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

///////////////////////////////////////////////////////////////////////////////
// RESOLUCION ================================================================
// ///////////////////////////////////////////////////////////////////////////

var sol = new THREE.Mesh( new THREE.BoxGeometry( 5, 5, 5 ), new THREE.MeshPhongMaterial( {color:0xFCFF33}) );
var tierra = new THREE.Mesh( new THREE.BoxGeometry( 4, 4, 4 ), new THREE.MeshPhongMaterial( {color:0x8E5229}) );
var luna = new THREE.Mesh( new THREE.BoxGeometry( 2, 2, 2 ), new THREE.MeshPhongMaterial( {color:0x51CEDF}) );
tierra.position.x = 20
luna.position.x = 25

camera.position.z = 100;
camera.position.y = 10;


scene.backgroundColor = new THREE.Color(0xffffff);
scene.add(sol);
scene.add(tierra);
scene.add(luna);

const light = new THREE.HemisphereLight(0xB1E1FF, 0x000000, 1);
scene.add(light);

const SM = () => {

const rotation = new THREE.Matrix4();
rotation.set (
    Math.cos(0.03), 0, Math.sin(0.03), 0,
    0, 1, 0, 0,
    -Math.sin(0.03), 0, Math.cos(0.03), 0,
    0, 0, 0, 1
);
 sol.geometry.applyMatrix4(rotation);
}

const TM = () => {
    let posSol = sol.position;
    let posTierra = tierra.position;
    let direction = new THREE.Vector3();
    direction.subVectors(posTierra, posSol);
    //console.log(direction);

    tierra.position.set(0,0,0);

    const rotation = new THREE.Matrix4();
    rotation.set (
        Math.cos(0.01), 0, Math.sin(0.01), 0,
        0, 1, 0, 0,
        -Math.sin(0.01), 0, Math.cos(0.01), 0,
        0, 0, 0, 1
    );

    const tras = new THREE.Matrix4();
    tras.set(
        1, 0, 0, 1.001,
        0, 1, 0, 0,
        0, 0, 1, 1.001,
        0, 0, 0, 1
    )
    const res = tras.multiply(rotation);
    tierra.geometry.applyMatrix4(res);

}
const LM = () => {
    let posTierra = tierra.position;
    const rotation = new THREE.Matrix4();

    luna.position.set(posTierra.x,posTierra.y, posTierra.z);
    rotation.set (
        Math.cos(0.02), 0, Math.sin(0.02), 0,
        0, 1, 0, 0,
        -Math.sin(0.02), 0, Math.cos(0.02), 0,
        0, 0, 0, 1
    );

    const tras = new THREE.Matrix4();
    tras.set(
        1, 0, 0, 1.001,
        0, 1, 0, 0,
        0, 0, 1, 1.001,
        0, 0, 0, 1
    )

    const res = tras.multiply(rotation);
    luna.geometry.applyMatrix4(res);
}

const updater = () => {
    SM();
    TM();
    LM();
}

const render = () => {
	requestAnimationFrame(render);
	updater();
	stats.update();
	orbitControls.update();
	renderer.render(scene, camera);
};

requestAnimationFrame(render);
