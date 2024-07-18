import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { showQuestion } from './menu.js';

// Afficher le menu
showQuestion();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 30, 20);
controls.update();
camera.lookAt(0, 0, 0);

console.log(scene);

const loader = new GLTFLoader();
let paddle1, paddle2, ball, plane, topWall, bottomWall, scoreP1, scoreP2, scoreP1object = [], scoreP2object = [], p1WIN, p2WIN;

//Lights & shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
let dirLight = new THREE.DirectionalLight( 0xffffff, 2 );
				dirLight.name = 'Dir. Light';
				dirLight.position.set( 0, 10, 0 );
				dirLight.castShadow = true;
				dirLight.shadow.camera.near = 1;
				dirLight.shadow.camera.far = 15;
				dirLight.shadow.camera.right = 25;
				dirLight.shadow.camera.left = - 25;
				dirLight.shadow.camera.top	= 15;
				dirLight.shadow.camera.bottom = - 15;
				dirLight.shadow.mapSize.width = 1024;
				dirLight.shadow.mapSize.height = 1024;
				scene.add( dirLight );

scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

scene.add(new THREE.AmbientLight(0x404040, 4));

let isModelLoaded = false;
let isConfigReady = false;
let gameConfig = {};

loader.load('models/modelSimpson.glb', function(gltf) {
    scene.add(gltf.scene);

    plane = gltf.scene.getObjectByName('Plane');
    //plane.material.color.set(0x000);
    //plane.material.receiveShadow = true;
    plane.receiveShadow = true;

    paddle1 = gltf.scene.getObjectByName('Paddle1');
    paddle1.castShadow = true;

    paddle2 = gltf.scene.getObjectByName('Paddle2');
    paddle2.castShadow = true;

    ball = gltf.scene.getObjectByName('Ball');
    // ball.castShadow = true;

    topWall = gltf.scene.getObjectByName('WallT');
    bottomWall = gltf.scene.getObjectByName('WallB');
    // topWall.castShadow = true;
    // bottomWall.castShadow = true;

    p1WIN = gltf.scene.getObjectByName('P1WIN');
    p2WIN = gltf.scene.getObjectByName('P2WIN');

    scoreP1object.push(gltf.scene.getObjectByName('0_L'));
    scoreP1object.push(gltf.scene.getObjectByName('1_L'));
    scoreP1object.push(gltf.scene.getObjectByName('2_L'));
    scoreP1object.push(gltf.scene.getObjectByName('3_L'));
    scoreP1object.push(gltf.scene.getObjectByName('4_L'));
    scoreP1object.push(gltf.scene.getObjectByName('5_L'));

    scoreP2object.push(gltf.scene.getObjectByName('0_R'));
    scoreP2object.push(gltf.scene.getObjectByName('1_R'));
    scoreP2object.push(gltf.scene.getObjectByName('2_R'));
    scoreP2object.push(gltf.scene.getObjectByName('3_R'));
    scoreP2object.push(gltf.scene.getObjectByName('4_R'));
    scoreP2object.push(gltf.scene.getObjectByName('5_R'));


    scoreP1object[0].visible = true;
    scoreP1object[1].visible = false;
    scoreP1object[2].visible = false;
    scoreP1object[3].visible = false;
    scoreP1object[4].visible = false;
    scoreP1object[5].visible = false;

    scoreP2object[0].visible = true;
    scoreP2object[1].visible = false;
    scoreP2object[2].visible = false;
    scoreP2object[3].visible = false;
    scoreP2object[4].visible = false;
    scoreP2object[5].visible = false;

    scoreP1 = 0;
    scoreP2 = 0;
    p1WIN.visible = false;
    p2WIN.visible = false;

    isModelLoaded = true;
    maybeStartGame();
}, undefined, function(error) {
    console.error(error);
});

window.startGame = function(config) {
    gameConfig = config;
    isConfigReady = true;
    maybeStartGame();
}

function maybeStartGame() {
    if (isModelLoaded && isConfigReady) {
        // Start the animation loop
        console.log('Starting game with configuration:', gameConfig);
        animate();
    }
}

let ballSpeed = { x: 0.2, z: 0.2 };
let paddleSpeed = 1;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    //ball.position.set(0, 0, 0);

    if (ball && paddle1 && paddle2) {
        ball.position.x += ballSpeed.x;
        ball.position.z += ballSpeed.z;

        if (ball.position.z <= topWall.position.z + 0.5 || ball.position.z >= bottomWall.position.z - 0.5) {
            ballSpeed.z *= -1;
        }

        if (ball.position.x <= paddle1.position.x + 0.6 && ball.position.z <= paddle1.position.z + 6.2 / 2 && ball.position.z >= paddle1.position.z - 6.2 / 2) {
            ballSpeed.x *= -1;
        }
        if (ball.position.x >= paddle2.position.x - 0.6 && ball.position.z <= paddle2.position.z + 6.2 / 2 && ball.position.z >= paddle2.position.z - 6.2 / 2) {
            ballSpeed.x *= -1;
        }

        if (ball.position.x <= paddle1.position.x) {
            ball.position.set(0, 0, 0);
            ball.position.x -= ballSpeed.x;
            ball.position.z -= ballSpeed.z;
            scoreP2++;
            scoreP2object[scoreP2 - 1].visible = false;
            scoreP2object[scoreP2].visible = true;
        } else if (ball.position.x >= paddle2.position.x) {
            ball.position.set(0, 0, 0);
            ball.position.x -= ballSpeed.x;
            ball.position.z -= ballSpeed.z;
            scoreP1++;
            scoreP1object[scoreP1 - 1].visible = false;
            scoreP1object[scoreP1].visible = true;
        } else if (scoreP1 == 5 || scoreP2 == 5) {
            ball.position.set(0, 0, 0);
            if (scoreP1 == 5) {
                p1WIN.visible = true;
            } else {
                p2WIN.visible = true;
            }
        }
    }

    renderer.render(scene, camera);
}

document.addEventListener('keydown', (event) => {
    if (paddle1 && paddle2) {
        switch (event.key) {
            case 'ArrowUp':
                if (paddle2.position.z - 2 - paddleSpeed > topWall.position.z + 0.5) {
                    paddle2.position.z -= paddleSpeed;
                }
                break;
            case 'ArrowDown':
                if (paddle2.position.z + 2 + paddleSpeed < bottomWall.position.z - 0.5) {
                    paddle2.position.z += paddleSpeed;
                }
                break;
            case 'z':
                if (paddle1.position.z - 2 - paddleSpeed > topWall.position.z + 0.5) {
                    paddle1.position.z -= paddleSpeed;
                }
                break;
            case 's':
                if (paddle1.position.z + 2 + paddleSpeed < bottomWall.position.z - 0.5) {
                    paddle1.position.z += paddleSpeed;
                }
                break;
        }
    }
});
