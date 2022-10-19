import * as CANNON from '../build/cannon-es.js'
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';
import { OrbitControls } from './utils/OrbitControls.js';
import * as ContentManager from './modules/ContentManager.js';
import * as WorldPhysic from './modules/WorldPhysics.js'
import * as Vehicle from './modules/Vehicle.js'
import * as ThreeHelper from './modules/ThreeHelper.js'

// three.js variables
const canvas = document.querySelector('#c');
let camera, scene, renderer;
let raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
pointer.x = 100;
pointer.y = 100;
let intersects = [];

// cannon.js variables
let world;
let engineeringFountain;
let chassisBody;
let vehicle;
let wheelBody;
let stopSigns = []
const timeStep = 1 / 60;
let lastCallTime;
const groundMaterial = new CANNON.Material('ground');
const wheelMaterial = new CANNON.Material('wheel');

document.getElementById("x-button").onclick = ContentManager.removeCard;
document.getElementById("next-slide").onclick = ContentManager.rotateCardsNext;
document.getElementById("prev-slide").onclick = ContentManager.rotateCardsPrev;

initThree();

function initThree() {
    // Camera
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 2000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(99, 204, 112);


    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color('#CBD9E6');

    ThreeHelper.initHemisphereLight(scene);

    ThreeHelper.initDirectionalLight(scene);

    ThreeHelper.load3dMap(scene);


    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)

    const orbitControls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize)

    ThreeHelper.loadBoilermakerXtraSpecial(scene);

    initCannon();
    animate();


}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}



function initCannon() {
    world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -15, 0),
    })
    world.defaultContactMaterial.friction = 0.3
    world.broadphase = new CANNON.NaiveBroadphase();
    world.iterations = 10;



    // Create the physics of the Car
    chassisBody = Vehicle.initChassisBody();
    vehicle = Vehicle.initVehicle(world, scene, chassisBody, wheelBody, wheelMaterial);

    // Adding physics of the world
    {
        // Adding the physics of the interaction/behavior between the wheel material and the ground material
        {
            const wheel_ground = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
                friction: 0.3,
                restitution: 0,
                contactEquationStiffness: 1000,
            })
            world.addContactMaterial(wheel_ground)

            const groundGround = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
                friction: 0.8,
                restitution: 30,
                contactEquationStiffness: 1000,
            })

            world.addContactMaterial(groundGround)
        }

        // Adding the physics of all objects on block0 (block0 is defined to be the block with the gateway to the future arch)
        {
            // Adding physics of block0
            WorldPhysic.addBlockPhysics(world, scene, new CANNON.Vec3(260, 32.5, 60), new CANNON.Vec3(20, 48.5, -63), true);

            // pillar besides the lawn
            WorldPhysic.addGatewayPillarPhysics(world, scene, new CANNON.Vec3(6, 6, 20), new CANNON.Vec3(Math.PI / 2, 0, 0), new CANNON.Vec3(-235, 100, -63), true);

            // pillar at the corner, near the edge of the block
            WorldPhysic.addGatewayPillarPhysics(world, scene, new CANNON.Vec3(6, 6, 20), new CANNON.Vec3(Math.PI / 2, 0, 0), new CANNON.Vec3(-235, 100, -37), true);


            WorldPhysic.addBellTower(world, scene, new CANNON.Vec3(267, 120, -51), true);
            // big tree
            WorldPhysic.addTreePhysics(world, scene, new CANNON.Vec3(-92, 83, -90), true);
            // small tree infront of the big tree
            WorldPhysic.addTreePhysics(world, scene, new CANNON.Vec3(-90, 83, -80), true);
            // small tree besides the big academic building
            WorldPhysic.addTreePhysics(world, scene, new CANNON.Vec3(-67, 83, -88), true);
            
            engineeringFountain = WorldPhysic.loadEngineeringFountain(world, scene, new CANNON.Vec3(-70, 95, -30));

            stopSigns.push(WorldPhysic.addStopSigns(world, scene, new CANNON.Vec3(-170,107,-40), new CANNON.Vec3(0,Math.PI,0), 0))
            stopSigns.push(WorldPhysic.addStopSigns(world, scene, new CANNON.Vec3(-95,107,-40), new CANNON.Vec3(0,Math.PI,0), 1))
        }

    }
}


function animate() {
    requestAnimationFrame(animate);

    // Step the physics world
    updatePhysics();
    let fountain = scene.getObjectByName("engineeringFountain", true);
    try {
        fountain.position.copy(engineeringFountain.position);
        fountain.quaternion.copy(engineeringFountain.quaternion);
        fountain.position.y -= 5;
    } catch (e) {
        console.error("engineering fountain not loaded yet.");
    }

    let stopSign0 = scene.getObjectByName("stopSign0");
    let stopSign1 = scene.getObjectByName("stopSign1");
    // let stopSignB4 = scene.getObjectByName("checkPoint2");
    try {
        stopSign0.position.copy(stopSigns[0].position);
        stopSign0.quaternion.copy(stopSigns[0].quaternion);
        
        stopSign1.position.copy(stopSigns[1].position);
        stopSign1.quaternion.copy(stopSigns[1].quaternion);

        // stopSignB3.position.copy(checkPoint1.position);
        // stopSignB3.quaternion.copy(checkPoint1.quaternion);
        // stopSignB3.position.y -= 12;

        // stopSignB4.position.copy(checkPoint2.position);
        // stopSignB4.quaternion.copy(checkPoint2.quaternion);
        // stopSignB4.position.y -= 12;

        
        // for (let i = 0; i < stopSigns.length; i++) {
        //     let checkPoint = scene.getObjectByName("checkPoint"+i)
        //     checkPoint.position.copy(stopSigns[i])
        //     checkPoint.quaternion.copy(stopSigns[i].quaternion)
        //     checkPoint.position.y -= 12
        // }
    } catch (e) {

    }


    let train = scene.getObjectByName("train", true)

    try {
        train.position.copy(chassisBody.position);
        train.quaternion.copy(chassisBody.quaternion);
        train.rotateY(Math.PI)
        train.position.y -= 0.5
    
        if (train.position.y < -100) {
            chassisBody.position.set(-200, 90, -50)
            chassisBody.quaternion.setFromEuler(0, Math.PI, 0)
            chassisBody.angularVelocity.set(0, 0, 0)
            chassisBody.velocity.set(0, 0, 0)
        }
    } catch (e) {
    }

    const isChaseCam = document.getElementById("yes");
    isChaseCam.addEventListener("keyup", (e) => { e.preventDefault(); });
    if (isChaseCam.checked) {
        camera.position.x = chassisBody.position.x;
        camera.position.y = chassisBody.position.y + 30;
        camera.position.z = chassisBody.position.z + 50;
        camera.lookAt(new THREE.Vector3(chassisBody.position.x, chassisBody.position.y, chassisBody.position.z));
    }

    render()
}

function updatePhysics() {
    const time = performance.now() / 1000
    if (!lastCallTime) {
        world.step(timeStep)
    } else {
        const dt = time - lastCallTime
        world.step(timeStep, dt)
    }
    lastCallTime = time
}
let pyramidExist = false

function render() {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        const toggle = document.getElementById("chaseCamToggle");
        toggle.style.display = "none";
    } else {
        // hoverEffect();
        document.getElementById("start-slide").style.display = "none";
    }
    renderer.render(scene, camera)
}

/*
 Hover effect calculates the pointer's position and determine if it is pointing
 at a building. If true, then it will show the information card related to the building
*/
function hoverEffect() {
    raycaster.setFromCamera(pointer, camera)

    const objects = raycaster.intersectObjects(scene.children);

    if (objects.length != 0 && !pyramidExist) {

        intersects = objects;
        let obj = intersects[0].object;
        if (obj.name === "vehicle") {
            renderer.render(scene, camera);
            return
        }

        const pyramidGeo = new THREE.CylinderGeometry(0, 3, 9, 4);
        const pyramidMat = new THREE.MeshPhongMaterial({ transparent: true, opacity: 1, color: 0xD2927D })
        const pyramidMesh = new THREE.Mesh(pyramidGeo, pyramidMat)
        pyramidMesh.rotateX(Math.PI)
        pyramidMesh.position.copy(new THREE.Vector3(obj.position.x, obj.position.y + 30, obj.position.z))
        pyramidExist = true
        pyramidMesh.name = "pyramid"
        scene.add(pyramidMesh)
        ContentManager.updateContent(document, obj.content);
        ContentManager.addCard();


    } else if (objects.length == 0) {
        if (intersects.length != 0) {
            let removePyramid = scene.getObjectByName("pyramid")
            scene.remove(removePyramid)
            pyramidExist = false;
        }
    } else if (objects.length != 0 && pyramidExist) {
        let pyramid = scene.getObjectByName("pyramid")
        pyramid.rotation.y += 0.05
    }

}

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

document.addEventListener('mousemove', onPointerMove, true)
document.addEventListener('keydown', (event) => {
    Vehicle.vehicleControlKeyDown(event, vehicle, chassisBody);
});


// Reset force on keyup
document.addEventListener('keyup', (event) => {
    Vehicle.vehicleControlKeyUp(event, vehicle, chassisBody);
    if (event.key == 'Escape') {
        ContentManager.removeCard();
    }
});