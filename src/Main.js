import * as CANNON from '../build/cannon-es.js'
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';
import { OrbitControls } from './utils/OrbitControls.js';
import * as ContentManager from './modules/ContentManager.js';
import * as WorldPhysic from './modules/WorldPhysics.js'
import * as Vehicle from './modules/Vehicle.js'
import * as ThreeHelper from './modules/ThreeHelper.js'

// three.js variables 
const canvas = document.querySelector('#c');
const pointToCheckpoint = new THREE.Vector3(0, 0.5, -1);
let camera, scene, renderer, orbitControls, tutorialUI;
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector3(0, 0, 0);
let targetPosition = new THREE.Vector3(0, 0, 0);
let targetID = undefined;
let cameraAngle = new THREE.Quaternion(-0.2897841486884301, 0, 0, 0.9570920264890529);
let tutorialAngle = new THREE.Quaternion(-0.10288527619948838, 0, 0, 0.9946932290617823);
let mouseX = 0, mouseY = 0;
let alpha = 0.05;
let isChaseCam = false;
let isCheckpoint = false;
let closeTutorial = false;
let displayTutorial = true;
let disableKeyPress = false;
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
const origin = new THREE.Vector2(0, 0.4)

document.getElementById("x-button").onclick = () => {
    ContentManager.removeCard();
    if (!closeTutorial) {
        tutorialUI.visible = true;
    }
};
document.getElementById("next-slide").onclick = ContentManager.rotateCardsNext;
document.getElementById("prev-slide").onclick = ContentManager.rotateCardsPrev;
document.getElementById("collapseCardBtn").onclick = ContentManager.toggleCard;
const questions = document.getElementsByClassName('question-box');
for (const question of questions) {
    question.onclick = e => {
        targetID = e.target.dataset['id'];
        localStorage.clear();
        localStorage.setItem('currentID', targetID);
        isChaseCam = true;
        if (targetID == 0) {
            tutorialUI.visible = true;
        }
        const questionsList = document.getElementById('question-menu');
        questionsList.classList.toggle("d-none");
        questionsList.classList.toggle("d-flex");
    }
}

initThree();

function initThree() {
    // Camera
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 2000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(15, 150, 130);
    // camera.position.set(99, 204, 112);
    
    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color('#CBD9E6');

    ThreeHelper.initHemisphereLight(scene);

    ThreeHelper.initDirectionalLight(scene);

    ThreeHelper.load3dMap(scene);

    ThreeHelper.loadTitleText(scene);

    ThreeHelper.loadTutorialUI(scene);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)

    // orbitControls = new OrbitControls(camera, renderer.domElement);
    // orbitControls.enableDamping = true;
    // orbitControls.dampingFactor = 0.05;
    // orbitControls.screenSpacePanning = false;
    // orbitControls.minDistance = 0.1;
    // orbitControls.maxDistance = 2000;
    // orbitControls.maxPolarAngle = Math.PI / 2;

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
            WorldPhysic.addBlockPhysics(world, scene, new CANNON.Vec3(260, 32.5, 60), new CANNON.Vec3(20, 48.5, -63), false);

            WorldPhysic.addBellTower(world, scene, new CANNON.Vec3(267, 120, -51), false);
            
            engineeringFountain = WorldPhysic.loadEngineeringFountain(world, scene, new CANNON.Vec3(-50, 95, -30));

            // Adding stop signs, these are meant to be movable objects backed by the physics of the game.
            stopSigns.push(WorldPhysic.addStopSigns(world, scene, new CANNON.Vec3(-170,107,-40), new CANNON.Vec3(0,Math.PI,0), 0))
            stopSigns.push(WorldPhysic.addStopSigns(world, scene, new CANNON.Vec3(-60,107,-40), new CANNON.Vec3(0,Math.PI,0), 1))
            stopSigns.push(WorldPhysic.addStopSigns(world, scene, new CANNON.Vec3(30,107,-40), new CANNON.Vec3(0,Math.PI,0), 2))
            stopSigns.push(WorldPhysic.addStopSigns(world, scene, new CANNON.Vec3(130,107,-40), new CANNON.Vec3(0,Math.PI,0), 3))
            stopSigns.push(WorldPhysic.addStopSigns(world, scene, new CANNON.Vec3(220,107,-40), new CANNON.Vec3(0,Math.PI,0), 4))

            // Adding checkpoints, these are thin blocks to indicate when the vehicle should stop.
            // How does the vehicle know when to stop? Refer to calculate check point
            // WorldPhysic.addCheckPoint(world, scene, new CANNON.Vec3(-195,90,-80), undefined, true)
            WorldPhysic.addCheckPoint(world, scene, new CANNON.Vec3(-180,90,-80), ContentManager.CARDS[0], true)
            WorldPhysic.addCheckPoint(world, scene, new CANNON.Vec3(-70,90,-80), ContentManager.CARDS[1], false)
            WorldPhysic.addCheckPoint(world, scene, new CANNON.Vec3(20,90,-80), ContentManager.CARDS[2], false)
            WorldPhysic.addCheckPoint(world, scene, new CANNON.Vec3(120,90,-80), ContentManager.CARDS[3], false)
            WorldPhysic.addCheckPoint(world, scene, new CANNON.Vec3(210,90,-80), ContentManager.CARDS[4], false)
            WorldPhysic.addCheckPoint(world, scene, new CANNON.Vec3(255,90,-80), ContentManager.CARDS[5], false)
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
    let stopSign2 = scene.getObjectByName("stopSign2");
    let stopSign3 = scene.getObjectByName("stopSign3");
    let stopSign4 = scene.getObjectByName("stopSign4");
    try {
        stopSign0.position.copy(stopSigns[0].position);
        stopSign0.quaternion.copy(stopSigns[0].quaternion);
        
        stopSign1.position.copy(stopSigns[1].position);
        stopSign1.quaternion.copy(stopSigns[1].quaternion);

        stopSign2.position.copy(stopSigns[2].position);
        stopSign2.quaternion.copy(stopSigns[2].quaternion);
        
        stopSign3.position.copy(stopSigns[3].position);
        stopSign3.quaternion.copy(stopSigns[3].quaternion);

        stopSign4.position.copy(stopSigns[4].position);
        stopSign4.quaternion.copy(stopSigns[4].quaternion);
    } catch (e) {
        console.log("error with the stop sign");
    }

    let train = scene.getObjectByName("train", true)

    try {
        train.position.copy(chassisBody.position);
        train.quaternion.copy(chassisBody.quaternion);
        train.rotateY(Math.PI)
        train.position.y -= 0.5
    
        if (train.position.y < -100) {
            chassisBody.position.set(-200, 80, -50)
            chassisBody.quaternion.setFromEuler(0, Math.PI, 0)
            chassisBody.angularVelocity.set(0, 0, 0)
            chassisBody.velocity.set(0, 0, 0)
        }
    } catch (e) {
        console.log("error in updating chasis body");
    }

    let title = scene.getObjectByName("title", true);
    try {
        pointer.x += (mouseX - pointer.x) * .02 + 0.3;
        pointer.y += (- mouseY - pointer.y) * .02 + 3.7;
        pointer.z = camera.position.z;
        title.lookAt(pointer);
    } catch (e) {
        console.log("error in finding mouse position");
    }
    
    tutorialUI = scene.getObjectByName("tutorial", true);
    if (isChaseCam) {
        targetPosition.x = chassisBody.position.x;
        targetPosition.y = chassisBody.position.y + 40;
        targetPosition.z = chassisBody.position.z + 60;

        if (camera.position.y <= targetPosition.y + 0.01) {
            if (targetID == 0) {
                alpha = 1;
            }
            if (alpha < 1) {
                alpha += 0.0015
            } else {
                alpha = 1;
            }
        }
        camera.position.lerp(targetPosition, alpha);
        tutorialUI.lookAt(camera.position);

        let speedup = 30;
        let matched = true;
        if (alpha == 1) {
            camera.lookAt(new THREE.Vector3(chassisBody.position.x, chassisBody.position.y, chassisBody.position.z));
        } else {
            camera.quaternion.slerp(cameraAngle, alpha);
        }
        switch(targetID) {
            case '0':
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    speedup = 20;
                } else {
                    matched = false;
                }
                break;
            case '1':
                speedup = 30;
                break;
            case '2':
                speedup = 40;
                break;
            case '3':
                speedup = 50;
                break;
            case '4':
                speedup = 60;
                break;
            default:
                matched = false;
        }
        if (matched) {
            if (chassisBody.velocity.x < 0) {
                chassisBody.velocity.x = 0;
            } else {
                chassisBody.velocity.x = speedup;
            }
        }
        tutorialUI.position.x = chassisBody.position.x;
    } else {
        camera.lookAt(new THREE.Vector3(15, 100, -120));
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
    if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))){
        document.getElementById("start-slide").style.display = "none";
    }
    calculateCheckPoint();

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

/**
 * This function will calculate if the center of the screen is intersecting with one of the checkpoints
 * or not. If so, then will immediately stop the vehicle and show information card.
 */
function calculateCheckPoint() {
    // raycaster.setFromCamera(origin, camera)
    raycaster.set(chassisBody.position, pointToCheckpoint);

    const intersects = raycaster.intersectObjects(scene.children);

    if ((intersects.length != 0) && ((targetID == undefined) || (targetID == intersects[0].object.content.id))) {
        targetID = undefined;
        alpha = 1;
        // call the cards out because the vehicle is in checkpoint
        
        if (!isCheckpoint) {
            if (tutorialUI.visible) {
                tutorialUI.visible = false;
                closeTutorial = true;
            }

            chassisBody.quaternion.setFromEuler(0, Math.PI, 0);
            chassisBody.angularVelocity.set(0, 0, 0);
            chassisBody.velocity.set(0, 0, 0);
            chassisBody.position.z = -50;
            ContentManager.updateContent(document, intersects[0].object.content);
            ContentManager.addCard();
            isCheckpoint = true;
            disableKeyPress = true;
            setTimeout(() => {
                disableKeyPress = false;
            }, 2000);
        }
    } else if (document.getElementById("info-card-wrapper").classList.contains('popShow') && isCheckpoint){
        ContentManager.removeCard();
        if (!closeTutorial) {
            tutorialUI.visible = true;
        }
        isCheckpoint = false;
    } else {
        isCheckpoint = false;
    }
}

function onPointerMove(event) {
    // pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    // pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    mouseX = (event.clientX - (window.innerWidth / 2)) * 0.1;
    mouseY = (event.clientY - (window.innerHeight / 2)) * 0.1;
}

document.addEventListener('mousemove', onPointerMove, true)
document.addEventListener('keydown', (event) => { 
    if (alpha != 1) {
        event.preventDefault();
    } else {
        // if (event.repeat) { //|| (chassisBody.velocity !== {x: 0, y:0, z:0})
        //     return
        // }
        if (disableKeyPress) {
            chassisBody.quaternion.setFromEuler(0, Math.PI, 0);
            chassisBody.angularVelocity.set(0, 0, 0);
            chassisBody.velocity.set(0, 0, 0);
            event.preventDefault();
        } else {
            Vehicle.vehicleControlKeyDown(event, vehicle, chassisBody);
        }
    }
});


// Reset force on keyup
document.addEventListener('keyup', (event) => {
    Vehicle.vehicleControlKeyUp(event, vehicle, chassisBody);
    
    if (event.key == 'Escape') {
        ContentManager.removeCard();
    }
});