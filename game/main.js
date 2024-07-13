import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls( camera, renderer.domElement );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 30, 25 );
controls.update();
camera.lookAt(0, 0, 0);

console.log(scene);

const loader = new GLTFLoader();

let paddle1, paddle2, ball, topWall, bottomWall, boundry, scoreP1, scoreP2, scoreP1object = [], scoreP2object = [], p1WIN, p2WIN;

// Charger les modèles
loader.load('models/model.glb', function(gltf) {
    scene.add(gltf.scene);

    // Récupérer les objets de la scène glTF
    paddle1 = gltf.scene.getObjectByName('Paddle');
    paddle2 = gltf.scene.getObjectByName('Paddle001');
    ball = gltf.scene.getObjectByName('Ball');
    topWall = gltf.scene.getObjectByName('Wall');
    bottomWall = gltf.scene.getObjectByName('Wall001');
    boundry = gltf.scene.getObjectByName('Boundry');
    gltf.scene.getObjectByName('Plane').visible = false;
    p1WIN = gltf.scene.getObjectByName('P1WIN');
    p2WIN = gltf.scene.getObjectByName('P2WIN');
    scoreP1object.push(gltf.scene.getObjectByName('0_L'));
    scoreP1object.push(gltf.scene.getObjectByName('1_L'));
    scoreP1object.push(gltf.scene.getObjectByName('2_L'));
    scoreP2object.push(gltf.scene.getObjectByName('0_R'));
    scoreP2object.push(gltf.scene.getObjectByName('1_R'));
    scoreP2object.push(gltf.scene.getObjectByName('2_R'));

    // Positionner les scores
    scoreP1object[0].visible = true;
    scoreP1object[1].visible = false;
    scoreP1object[2].visible = false;
    scoreP2object[0].visible = true;
    scoreP2object[1].visible = false;
    scoreP2object[2].visible = false;
    scoreP1 = 0;
    scoreP2 = 0;
    p1WIN.visible = false;
    p2WIN.visible = false;
    

    
    animate();
}, undefined, function(error) {
    console.error(error);
});

//lights

const light = new THREE.AmbientLight( 0x404040, 15 ); // soft white light
scene.add( light );

let ballSpeed = { x: 0.2, z: 0.2 };
let paddleSpeed = 1;

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (ball && paddle1 && paddle2) {
        // Déplacement de la balle
        ball.position.x += ballSpeed.x;
        ball.position.z += ballSpeed.z;
        

        //Collision avec les murs
        if (ball.position.z <= topWall.position.z + 0.5 || ball.position.z >= bottomWall.position.z - 0.5) {
            ballSpeed.z *= -1;
        }
        //console.log(ball.position.z, topWall.position.z);

        // Collision avec les raquettes
        if (ball.position.x <= paddle1.position.x + 1 && ball.position.z <= paddle1.position.z + 1 && ball.position.z >= paddle1.position.z - 1) {
            ballSpeed.x *= -1;
        }
        if (ball.position.x >= paddle2.position.x - 1 && ball.position.z <= paddle2.position.z + 1 && ball.position.z >= paddle2.position.z - 1) {
            ballSpeed.x *= -1;
        }
        // Point marqué
        if (ball.position.x <= paddle1.position.x){
            ball.position.set(0, 0, 0);
            ball.position.x -= ballSpeed.x;
            ball.position.z -= ballSpeed.z;
            scoreP2++;
            scoreP2object[scoreP2 - 1].visible = false;
            scoreP2object[scoreP2].visible = true;
        }
        else if (ball.position.x >= paddle2.position.x){
            ball.position.set(0, 0, 0);
            ball.position.x -= ballSpeed.x;
            ball.position.z -= ballSpeed.z;
            scoreP1++;
            scoreP1object[scoreP1 - 1].visible = false;
            scoreP1object[scoreP1].visible = true;
        }
        else if (scoreP1 == 2 || scoreP2 == 2){
            ball.position.set(0, 0, 0);
            if (scoreP1 == 2)
                p1WIN.visible = true;
            else
                p2WIN.visible = true;
        }
    



        //console.log(ball.position.x, paddle2.position.x);
     

    }

    renderer.render(scene, camera);
}

document.addEventListener('keydown', (event) => {
    if (paddle1 && paddle2) {
        switch (event.key) {
            case 'ArrowUp':
                paddle2.position.z -= paddleSpeed;
                break;
            case 'ArrowDown':
                paddle2.position.z += paddleSpeed;
                break;
            case 'z':
                paddle1.position.z -= paddleSpeed;
                break;
            case 's':
                paddle1.position.z += paddleSpeed;
                break;
        }
    }
});
