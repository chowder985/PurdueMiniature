import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';
import { OBJLoader } from '../utils/OBJLoader.js';
import { MTLLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';

export function initHemisphereLight(scene) {
    const skyColor = 0xCBD9E6;
    const groundColor = 0xE2E2E4;
    const intensity = 0.85;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    light.position.set(100, 0, 0);
    scene.add(light);
}

export function initDirectionalLight(scene) {
    const color = 0xFFFFFF;
    const intensity = 0.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(10, 70, 50);
    scene.add(light);
    scene.add(light.target);
}

export function load3dMap(scene) {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('models/PurdueMiniature/Linear.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('models/PurdueMiniature/Linear.obj',
            // onLoad Callback
            function (world) {
                scene.add(world);
            },
            // onProgress Callback
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            });
    });
}

export function loadBoilermakerXtraSpecial(scene) {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('models/BoilermakerXtraSpecial/BoilermakerXtraSpecial.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('models/BoilermakerXtraSpecial/BoilermakerXtraSpecial.obj', (train) => {
            scene.add(train);
            train.name = "train";
            console.log(train.name);
        }, (xhr) => {
            if (xhr.loaded / xhr.total == 1) {
                console.log("LOADED");
            }
        });
    });
}

export function loadTitleText(scene) {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('models/CareerCampusTitle/CareerCampusTitleText.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('models/CareerCampusTitle/CareerCampusTitleText.obj', (title) => {
            title.position.set(15, 170, 0);
            title.scale.set(0.5, 0.5, 0.5);
            scene.add(title);
            title.name = 'title';
            console.log(title.name);
        }, (xhr) => {
            if (xhr.loaded / xhr.total == 1) {
                console.log("LOADED");
            }
        });
    });
}

export function loadTutorialUI(scene) {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('models/TutorialUI/TutorialUI.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('models/TutorialUI/TutorialUI.obj', (tutorial) => {
            // tutorial.position.set(-245, 100, -20);
            tutorial.position.set(-220, 110, -50);
            tutorial.scale.set(0.15, 0.15, 0.15);
            scene.add(tutorial);
            tutorial.name = 'tutorial';
            tutorial.visible = false;
            console.log(tutorial.name);
        }, (xhr) => {
            if (xhr.loaded / xhr.total == 1) {
                console.log("LOADED");
            }
        });
    });
}