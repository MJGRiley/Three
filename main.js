import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DoubleSide } from "three";
import * as dat from "dat.gui";
import gsap from "gsap";

const scene = new THREE.Scene();
const mouse = { x: undefined, y: undefined };
const raycaster = new THREE.Raycaster();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
camera.position.setZ(5);

//dat.gui
const gui = new dat.GUI();
const world = {
  plane: {
    width: 20,
    height: 20,
    widthSegments: 17,
    heightSegments: 17,
  },
};
gui.add(world.plane, "width", 1, 20).onChange(generatePlane);
gui.add(world.plane, "height", 1, 20).onChange(generatePlane);
gui.add(world.plane, "widthSegments", 1, 20).onChange(generatePlane);
gui.add(world.plane, "heightSegments", 1, 20).onChange(generatePlane);
function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );
  const { array } = planeMesh.geometry.attributes.position; // destructuring
  for (let i = 0; i < array.length; i += 3) {
    const z = array[i + 2];
    array[i + 2] = z - Math.random();
  }
  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
  }
  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
}
const planeGeometry = new THREE.PlaneGeometry(10, 10, 25, 25);
const planeMat = new THREE.MeshPhongMaterial({
  side: DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMat);
scene.add(planeMesh);

// vertice position randomization 
const { array } = planeMesh.geometry.attributes.position; // destructuring
for (let i = 0; i < array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];
  array[i] = x  - (Math.random()*.15 );
  array[i + 1] = y - (Math.random()*.15);
  array[i + 2] = z - (Math.random()*.15);
}
planeMesh.geometry.attributes.position.originialPosition = planeMesh.geometry.attributes.position.array

const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0.19, 0.4);
}
planeMesh.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);

//Lights
const pointLight = new THREE.DirectionalLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

//Helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(50, 100);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function animate(time) {
  requestAnimationFrame(animate);
  time *= 0.001; // convert time to seconds

  controls.update();

  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;
    color.setX(intersects[0].face.a, 0.1); //R
    color.setY(intersects[0].face.a, 0.5); //G
    color.setZ(intersects[0].face.a, 1); //B

    color.setX(intersects[0].face.b, 0.1);
    color.setY(intersects[0].face.b, 0.5);
    color.setZ(intersects[0].face.b, 1);

    color.setX(intersects[0].face.c, 0.1);
    color.setY(intersects[0].face.c, 0.5);
    color.setZ(intersects[0].face.c, 1);
    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4,
    };
    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1,
    };
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        color.setX(intersects[0].face.a, hoverColor.r); //R
        color.setY(intersects[0].face.a, hoverColor.g); //G
        color.setZ(intersects[0].face.a, hoverColor.b); //B

        color.setX(intersects[0].face.b, hoverColor.r);
        color.setY(intersects[0].face.b, hoverColor.g);
        color.setZ(intersects[0].face.b, hoverColor.b);

        color.setX(intersects[0].face.c, hoverColor.r);
        color.setY(intersects[0].face.c, hoverColor.g);
        color.setZ(intersects[0].face.c, hoverColor.b);
      },
    });

    color.setX(0, 0).needsUpdate = true;
  } //intersects[0].face
}
function onWindowResize() {
  // If the window gets resized
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
}
function onMouseMove(e) {
  mouse.x = (e.clientX / innerWidth) * 2 - 1; //normalizes coordinates to
  mouse.y = -(e.clientY / innerHeight) * 2 + 1; //match with Three.js
}
//Window Events
window.addEventListener("resize", onWindowResize, false);
addEventListener("mousemove", onMouseMove);

animate();
