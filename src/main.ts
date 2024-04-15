import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'dat.gui'

const scene = new THREE.Scene()
scene.environment = new THREE.CubeTextureLoader().setPath('https://sbcode.net/img/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const gridHelper = new THREE.GridHelper()
gridHelper.position.y = -1
scene.add(gridHelper)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 2, 7)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const boxGeometry = new THREE.BoxGeometry()

const sphereGeometry = new THREE.SphereGeometry()

const icosahedronGeometry = new THREE.IcosahedronGeometry()

const planeGeometry = new THREE.PlaneGeometry()

const torusKnotGeometry = new THREE.TorusKnotGeometry()

//const material = new THREE.MeshStandardMaterial() // Same material used on all meshes; any changes made tot his mesh will affect all 
const material = new THREE.MeshNormalMaterial()

const cube = new THREE.Mesh(boxGeometry, material)
cube.position.set(5, 0, 0)
scene.add(cube)

const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.position.set(3, 0, 0)
scene.add(sphere)

const icosahedron = new THREE.Mesh(icosahedronGeometry, material)
icosahedron.position.set(0, 0, 0)
scene.add(icosahedron)

const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(-2, 0, 0)
scene.add(plane)

const torusKnot = new THREE.Mesh(torusKnotGeometry, material)
torusKnot.position.set(-5, 0, 0)
scene.add(torusKnot)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const stats = new Stats()
document.body.appendChild(stats.dom)

const options = {
  side: {
    FrontSide: THREE.FrontSide,
    BackSide: THREE.BackSide,
    DoubleSide: THREE.DoubleSide,
  },
}

// GUI and Controls
const gui = new GUI()

const materialFolder = gui.addFolder('THREE.Material')
// Transparency and opacity go together. 
// Any changes to the material that would require compilation, such as transparency, must also be updated
materialFolder.add(material, 'transparent').onChange(() => (material.needsUpdate = true))

//alphaTest is related to opacity
materialFolder.add(material, 'opacity', 0, 1, 0.01)
materialFolder.add(material, 'alphaTest', 0, 1, 0.01).onChange(() => updateMaterial())

materialFolder.add(material, 'visible')

// Dropdown in GUI
materialFolder.add(material, 'side', options.side).onChange(() => updateMaterial())
materialFolder.open()

function updateMaterial() {
  material.side = Number(material.side) as THREE.Side

  // Any changes to the material that would require compilation, such as transparency, must also be updated
  material.needsUpdate = true
}

function animate() {
  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

  stats.update()
}

animate()