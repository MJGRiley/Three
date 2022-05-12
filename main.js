import './style.css'

import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.setPixelRatio(devicePixelRatio)
camera.position.setZ(5)

const boxWidth = 1; //cube
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
// const radius = 1;  // ui: radius
// const detail = 2;  // ui: detail
// const geometry = new THREE.DodecahedronGeometry(radius, detail)
function makeInstance(geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({color,shininess: 75});
  
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  cube.position.x = x;
  cube.position.y = -2;
  cube.position.z = -2;
  return cube;
}
function makeMetalInstance(geometry, color, x) {
  const material = new THREE.MeshStandardMaterial({color, metalness: .95});
  
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  cube.position.x = x;
  cube.position.y = 2;
  cube.position.z = -2;
  return cube;
}
function makePhysicalInstance(geometry, color, x) {
  const material = new THREE.MeshPhysicalMaterial({color, roughness:1, metalness: .95, clearcoat: 1, });
  
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  cube.position.x = x;
  cube.position.z = -2;
  return cube;
}
const cubes = [
  makeInstance(geometry, 0x44aa88,  0),
  makeInstance(geometry, 0x8844aa, -2),
  makeInstance(geometry, 0xaa8844,  2),
]
const metalCubes = [
  makeMetalInstance(geometry, 0x44aa88,  0),
  makeMetalInstance(geometry, 0x8844aa, -2),
  makeMetalInstance(geometry, 0xaa8844,  2),
]
const physicalCubes = [
  makePhysicalInstance(geometry, 0x44aa88,  0),
  makePhysicalInstance(geometry, 0x8844aa, -2),
  makePhysicalInstance(geometry, 0xaa8844,  2),
]

const planeGeometry = new THREE.PlaneGeometry(5,5,10,10)
const planeMat = new THREE.MeshBasicMaterial({ color: 0xff0000})
const planeMesh = new THREE.Mesh( planeGeometry, planeMat)
scene.add(planeMesh)
planeMesh.position.z = -2

const color = 0xFFFFFF;
const intensity = 1;
const pointLight = new THREE.DirectionalLight(color, intensity)
pointLight.position.set(5,5,5)
scene.add(pointLight)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(50,100)
scene.add(lightHelper,gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)

function animate(time) {
  requestAnimationFrame( animate )
  time *= 0.001;  // convert time to seconds
  const allCubes = cubes.concat(metalCubes).concat(physicalCubes)
 
  allCubes.forEach((cube, ndx) => {
    const speed = 1 + ndx * .1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  })

  controls.update()

  renderer.render( scene, camera )
}

function onWindowResize() {// If the window gets resized
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize( window.innerWidth, window.innerHeight )
  renderer.setPixelRatio(devicePixelRatio)
}

window.addEventListener('resize',onWindowResize, false)

animate()