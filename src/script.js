import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import ghostVertexShader from './shaders/ghost/vertex.glsl'
import ghostFragmentShader from './shaders/ghost/fragment.glsl'
import GUI from 'lil-gui'


const gui = new GUI({width: 340})

const debugObject = {}

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const ghostGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)
debugObject.color = "#5c5bc8"            //d9bfdf     b397ba   7a77fd    5c5bc8
const ghostMaterial = new THREE.ShaderMaterial({ 
    vertexShader: ghostVertexShader,
    fragmentShader: ghostFragmentShader,
    uniforms: {
        uMaxElevation: {value: 3.7},
        uRadius: {value: 1.3},
        uTime: {value: 0},
        uColor: {value: new THREE.Color(debugObject.color)}
    },
    transparent: true
    
})

gui.add(ghostMaterial.uniforms.uMaxElevation, 'value').min(0).max(5).step(0.1).name('Max Elevation')
gui.add(ghostMaterial.uniforms.uRadius, 'value').min(0.5).max(3).step(0.1).name('Roundness')
gui.addColor(debugObject, 'color').name('Ghost Color').onChange(() => 
{
    ghostMaterial.uniforms.uColor.value.set(debugObject.color)
})

const axes = new THREE.AxesHelper(4)
scene.add(axes)

const ghost = new THREE.Mesh(ghostGeometry, ghostMaterial)
ghost.rotation.x += Math.PI / 2 + Math.PI
ghost.position.y -= 1
scene.add(ghost)
//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
    
        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
    
        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
    
//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 3, 5)
camera.lookAt(0, 0, 0)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)




//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    ghostMaterial.uniforms.uTime.value = elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()