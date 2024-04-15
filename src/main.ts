import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'dat.gui'

const scene = new THREE.Scene()
// scene.environment = new THREE.CubeTextureLoader().setPath('https://sbcode.net/img/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])

const gridHelper = new THREE.GridHelper()
scene.add(gridHelper)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(-1, 4, 2.5)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const light = new THREE.DirectionalLight(undefined, Math.PI)
light.position.set(1, 1, 1)
scene.add(light)

const data = { color: 0x00ff00, labelsVisible: true }

//const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshNormalMaterial())
plane.rotation.x = -Math.PI / 2
plane.visible = false
scene.add(plane)

const geometry = new THREE.IcosahedronGeometry(1, 1)

const meshes = [
  new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: data.color })),
  new THREE.Mesh(geometry, new THREE.MeshNormalMaterial({ flatShading: true })),
  new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: data.color, flatShading: true })),
  new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: data.color, flatShading: true })),
  new THREE.Mesh(geometry, new THREE.MeshToonMaterial({color: data.color})),
]

meshes[0].position.set(-3, 1, 0)
meshes[1].position.set(-1, 1, 0)
meshes[2].position.set(1, 1, 0)
meshes[3].position.set(3, 1, 0)
meshes[4].position.set(5, 1, 0)

scene.add(...meshes)

const stats = new Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()

// GUI color picker doesnt work quite so well with Threejs, so we have to do alot of casting here. 
// If you dont cast and write it like you would in javascript, 
// .
// .
// ;(meshes[0].material.color.set(data.color)
//
// The IDE will flag it and tell you it doesnt know whats going on. 
// TODO: find otu what the ';' is for. 

// Basic Mesh
const meshBasicMaterialFolder = gui.addFolder('MeshBasicMaterial')
meshBasicMaterialFolder.addColor(data, 'color').onChange(() => {
  ;(meshes[0].material as THREE.MeshBasicMaterial).color.set(data.color)
})
meshBasicMaterialFolder.add(meshes[0].material, 'wireframe')
meshBasicMaterialFolder.open()

// Normal Mesh
const meshNormalMaterialFolder = gui.addFolder('MeshNormalMaterial')
meshNormalMaterialFolder.add(meshes[1].material as THREE.MeshNormalMaterial, 'flatShading').onChange(() => {
  meshes[1].material.needsUpdate = true
})
meshNormalMaterialFolder.add(meshes[1].material, 'wireframe')
meshNormalMaterialFolder.open()

// Phong Mesh
const meshPhongMaterialFolder = gui.addFolder('MeshPhongMaterial')
meshPhongMaterialFolder.addColor(data, 'color').onChange(() => {
  ;(meshes[2].material as THREE.MeshPhongMaterial).color.set(data.color)
})
meshPhongMaterialFolder.add(meshes[2].material as THREE.MeshPhongMaterial, 'flatShading').onChange(() => {
  meshes[2].material.needsUpdate = true
})
meshPhongMaterialFolder.add(meshes[2].material, 'wireframe')
meshPhongMaterialFolder.open()

// Standard Mesh
const meshStandardMaterialFolder = gui.addFolder('MeshStandardMaterial')
meshStandardMaterialFolder.addColor(data, 'color').onChange(() => {
  ;(meshes[3].material as THREE.MeshStandardMaterial).color.set(data.color)
})
meshStandardMaterialFolder.add(meshes[3].material as THREE.MeshStandardMaterial, 'flatShading').onChange(() => {
  meshes[3].material.needsUpdate = true
})
meshStandardMaterialFolder.add(meshes[3].material, 'wireframe')
meshStandardMaterialFolder.open()

// Toon Mesh
const meshToonMaterialFolder = gui.addFolder('MeshToonMaterial')
meshToonMaterialFolder.addColor(data, 'color').onChange(() => {
  ;(meshes[4].material as THREE.MeshToonMaterial).color.set(data.color)
})
meshToonMaterialFolder.add(meshes[4].material, 'wireframe')
meshToonMaterialFolder.open()

const lightFolder = gui.addFolder('Light')
lightFolder.add(light, 'visible')
lightFolder.open()

const gridFolder = gui.addFolder('Grid')
gridFolder.add(gridHelper, 'visible')
gridFolder.open()

const labelsFolder = gui.addFolder('Labels')
labelsFolder.add(data, 'labelsVisible')
labelsFolder.open()

// See index.html and style
const labels = document.querySelectorAll<HTMLDivElement>('.label')
// Can also use:
// const labels = document.querySelectorAll('.label') as NodeListOf<HTMLDivElement>

let x, y
const v = new THREE.Vector3()

function animate() {
  requestAnimationFrame(animate)

  controls.update()

  // Rotate? 
  for (let i = 0; i < 5; i++) {
    if(i % 2 == 0 ){
     meshes[i].rotation.x += 0.005
    }
    meshes[i].rotation.y += 0.005
  }

  for (let i = 0; i < 5; i++) {
    v.copy(meshes[i].position)
    v.project(camera)

    x = ((1 + v.x) / 2) * innerWidth - 50
    y = ((1 - v.y) / 2) * innerHeight

    // Modify CSS style of labels using javascript
    labels[i].style.left = x + 'px'
    labels[i].style.top = y + 'px'
    labels[i].style.display = data.labelsVisible ? 'block' : 'none'

  }

  renderer.render(scene, camera)

  stats.update()
}

animate()