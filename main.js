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
camera.position.setZ(5)

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
function makeInstance(geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({color});
  
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  cube.position.x = x;
  
  return cube;
}
const cubes = [
  makeInstance(geometry, 0x44aa88,  0),
  makeInstance(geometry, 0x8844aa, -2),
  makeInstance(geometry, 0xaa8844,  2),
]

const color = 0xFFFFFF;
const intensity = 1;
const pointLight = new THREE.DirectionalLight(color, intensity)
pointLight.position.set(5,5,5)
scene.add(pointLight)

// const ambientLight = new THREE.AmbientLight(0xffffff)
// ambientLight.position.set(15,15,15)
// scene.add(ambientLight)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50)
scene.add(lightHelper,gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)

function animate(time) {
  requestAnimationFrame( animate )
  time *= 0.001;  // convert time to seconds
 
  cubes.forEach((cube, ndx) => {
    const speed = 1 + ndx * .1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  })

  controls.update()

  renderer.render( scene, camera )
}

animate()