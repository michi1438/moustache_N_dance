import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { showQuestion } from './menu.js';

// Afficher le menu
//showQuestion();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 30, 20);
controls.update();
camera.lookAt(0, 0, 0);

console.log(scene);

const loader = new GLTFLoader();
let paddle1, paddle2, ball, plane, topWall, bottomWall, scoreP1, scoreP2, scoreP1object = [], scoreP2object = [], p1WIN, p2WIN, title;

//Lights & shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
let dirLight = new THREE.DirectionalLight( 0xfffff0, 1 );
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

//scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

//scene.add( new THREE.AmbientLight( 0x404040, 3 ) );

let spotLight = new THREE.SpotLight( 0xff6666, 10000 );
spotLight.name = 'Spot Light';
spotLight.angle = Math.PI / 5;
spotLight.penumbra = 0.3;
spotLight.position.set( 45, 10, 20);
spotLight.castShadow = true;
spotLight.shadow.camera.near = 8;
spotLight.shadow.camera.far = 100;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
scene.add( spotLight );

//scene.add( new THREE.CameraHelper( spotLight.shadow.camera ) );

let spotLight2 = new THREE.SpotLight( 0x6666ff, 10000 );
spotLight2.name = 'Spot Light';
spotLight2.angle = Math.PI / 5;
spotLight2.penumbra = 0.3;
spotLight2.position.set( -45, 10, -20);
spotLight2.castShadow = true;
spotLight2.shadow.camera.near = 8;
spotLight2.shadow.camera.far = 100;
spotLight2.shadow.mapSize.width = 1024;
spotLight2.shadow.mapSize.height = 1024;
scene.add( spotLight2 );

//scene.add( new THREE.CameraHelper( spotLight2.shadow.camera ) );

//audio

const audioLoader = new THREE.AudioLoader();

const listener = new THREE.AudioListener();
camera.add( listener );
let sound, sound1, sound2, sound3;

audioLoader.load( 'sounds/salut.mp3', function ( buffer ) {
    sound = new THREE.Audio( listener );
    sound.setBuffer( buffer );
    sound.setVolume( 0.1 );
});
audioLoader.load( 'sounds/homer-woohoo.mp3', function ( buffer ) {
        sound1 = new THREE.Audio( listener );
        sound1.setBuffer( buffer );
        sound1.setVolume( 0.1 );
});
audioLoader.load( 'sounds/homer_doh.mp3', function ( buffer ) {
    sound2 = new THREE.Audio( listener );
    sound2.setBuffer( buffer );
    sound2.setVolume( 0.1 );
});
audioLoader.load( 'sounds/c_nul_homer.mp3', function ( buffer ) {
    sound3 = new THREE.Audio( listener );
    sound3.setBuffer( buffer );
    sound3.setLoop( false );
    sound3.setVolume( 0.1 );
});
let soundPlayed = false;

let isModelLoaded = false;
let isConfigReady = false;
let gameConfig = {};

loader.load('models/modelSimpson.glb', function(gltf) {
    scene.add(gltf.scene);

    plane = gltf.scene.getObjectByName('Plane');
    //plane.material.color.set(0x000);
  
    plane.material.receiveShadow = true;
    plane.receiveShadow = true;

    paddle1 = gltf.scene.getObjectByName('Paddle1');
    paddle1.castShadow = true;

    paddle2 = gltf.scene.getObjectByName('Paddle2');
    paddle2.castShadow = true;

    ball = gltf.scene.getObjectByName('Ball');
    //ball.castShadow = true;

    topWall = gltf.scene.getObjectByName('WallT');
    bottomWall = gltf.scene.getObjectByName('WallB');
    topWall.castShadow = true;
    bottomWall.castShadow = true;

    p1WIN = gltf.scene.getObjectByName('P1WIN');
    p1WIN.castShadow = true;
    p2WIN = gltf.scene.getObjectByName('P2WIN');
    p2WIN.castShadow = true;

    title = gltf.scene.getObjectByName('title');
    title.castShadow = true;

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

    for (let i = 0; i < scoreP1object.length; i++) {
        scoreP1object[i].castShadow = true;
        scoreP2object[i].castShadow = true;
    }

    scoreP1 = 0;
    scoreP2 = 0;
    p1WIN.visible = false;
    p2WIN.visible = false;

    isModelLoaded = true;
    maybeStartGame();
}, undefined, function(error) {
    console.error(error);
});

let go = false;

window.startGame = function(config) {
    gameConfig = config;
    isConfigReady = true;

    let countdown = 3;
    let countdownDisplay = document.getElementById('countdownDisplay');
    countdownDisplay.id = 'countdownDisplay';
    //document.body.appendChild(countdownDisplay);
    
    let countdownInterval = setInterval(() => {
        countdownDisplay.innerText = countdown;
        countdown--;
    
        if (countdown < 0) {
            countdownDisplay.innerText = 'GO';
            clearInterval(countdownInterval);
    
            // After a short delay, remove the 'GO' message
            setTimeout(() => {
                countdownDisplay.remove();
                go = true;
            }, 1000);
        }
    }, 1000)
    maybeStartGame();
    sound.play();
}

function maybeStartGame() {
    if (isModelLoaded && isConfigReady) {
        // Start the animation loop
        animate();
    }
}

let ballSpeed = { x: 0.3, z: 0.3 };
let paddleSpeed = 0.3;

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (ball && paddle1 && paddle2) {
        if(go) {
            ball.position.x += ballSpeed.x;
            ball.position.z += ballSpeed.z;
        }
        //collision murs
        if (ball.position.z <= topWall.position.z + 0.5 || ball.position.z >= bottomWall.position.z - 0.5) {
            ballSpeed.z *= -1;
            
        }
        //collision paddle1 et paddle2
        if (ball.position.x <= paddle1.position.x + 0.6 && ball.position.z <= paddle1.position.z + 6.2 / 2 && ball.position.z >= paddle1.position.z - 6.2 / 2) {
            ballSpeed.x *= -1.05;
            sound1.play();
        }
        if (ball.position.x >= paddle2.position.x - 0.6 && ball.position.z <= paddle2.position.z + 6.2 / 2 && ball.position.z >= paddle2.position.z - 6.2 / 2) {
            ballSpeed.x *= -1.05;
            sound1.play();
        }

        if (ball.position.x <= paddle1.position.x) {
            ball.position.set(0, 0, 0);
            ballSpeed = { x: 0.3, z: 0.3 };
            ball.position.x -= ballSpeed.x;
            ball.position.z -= ballSpeed.z;
            scoreP2++;
            sound2.play();
            scoreP2object[scoreP2 - 1].visible = false;
            scoreP2object[scoreP2].visible = true;
        } else if (ball.position.x >= paddle2.position.x) {
            ball.position.set(0, 0, 0);
            ballSpeed = { x: 0.3, z: 0.3 };
            ball.position.x -= ballSpeed.x;
            ball.position.z -= ballSpeed.z;
            scoreP1++;
            sound2.play();
            scoreP1object[scoreP1 - 1].visible = false;
            scoreP1object[scoreP1].visible = true;
        } else if (scoreP1 == 5 || scoreP2 == 5) {
            ball.position.set(0, 0, 0);
            if (!soundPlayed) {
                setTimeout(() => {
                    sound3.play();
                }, 1000);
                soundPlayed = true;
            }
            if (scoreP1 == 5) {
                p1WIN.visible = true;
            } else {
                p2WIN.visible = true;
            }
        }
        if (paddle1 && paddle2) {
            if (keys['ArrowUp'] && paddle2.position.z - 2 - paddleSpeed > topWall.position.z + 0.5) {
                paddle2.position.z -= paddleSpeed;
            } 
            if (keys['ArrowDown'] && paddle2.position.z + 2 + paddleSpeed < bottomWall.position.z - 0.5) {
                paddle2.position.z += paddleSpeed;
            } 
            if (keys['z'] && paddle1.position.z - 2 - paddleSpeed > topWall.position.z + 0.5) {
                paddle1.position.z -= paddleSpeed;
            } 
            if (keys['s'] && paddle1.position.z + 2 + paddleSpeed < bottomWall.position.z - 0.5) {
                paddle1.position.z += paddleSpeed;
            }
        }
    }

    renderer.render(scene, camera);
}

let keys = {};

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});
