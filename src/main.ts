import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'dat.gui'

const scene = new THREE.Scene()
scene.add(new THREE.GridHelper())

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 1.5

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)

  renderer.render(scene, camera) // Render whenever the screen size changes
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener('change', ()=>{
  renderer.render(scene, camera) // Render whenever OrbitControls changes
})

new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshNormalMaterial({ wireframe: true })

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

renderer.render(scene, camera)

const stats = new Stats()
document.body.appendChild(stats.dom)

// GUI
const gui = new GUI()

// GUI - Camera Controls
const cameraFolder = gui.addFolder('Camera')

cameraFolder.add(camera.position, 'x', -10, 10)
cameraFolder.add(camera.position, 'y', -10, 10)
cameraFolder.add(camera.position, 'z', -10, 10)

cameraFolder.add(camera, 'fov', 0, 180, 0.01).onChange( () => {
  camera.updateProjectionMatrix()
})
cameraFolder.add(camera, 'aspect', 0.00001, 10).onChange( () => {
  camera.updateProjectionMatrix()
})
cameraFolder.add(camera, 'near', 0.01, 10).onChange( () => {
  camera.updateProjectionMatrix()
})
cameraFolder.add(camera, 'far', 0.01, 10).onChange( () => {
  camera.updateProjectionMatrix()
})

cameraFolder.open()
//Make the code frame rate independant by considering clock delta time

const clock = new THREE.Clock()
let delta

function animate() {
  requestAnimationFrame(animate)

  //cube.rotation.x += 0.01
  //cube.rotation.y += 0.01

  delta = clock.getDelta()
  cube.rotation.x += delta
  cube.rotation.y += delta


  renderer.render(scene, camera)

  stats.update()
}

animate()