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

//lights & shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap


//Create a DirectionalLight and turn on shadows for the light
const light = new THREE.DirectionalLight(0xFFFFFF, 10);
light.position.set( -1, 1, -2 ); //default; light shining from top left
light.castShadow = true; // default false
scene.add( light );
const light2 = new THREE.DirectionalLight(0xFFFFFF, 10);
light2.position.set( 1, 1, -2 ); //default; light shining from top left
light2.castShadow = true; // default false
scene.add( light2 );
let paddle1, paddle2, ball, plane, topWall, bottomWall, boundry, scoreP1, scoreP2, scoreP1object = [], scoreP2object = [], p1WIN, p2WIN;

// Charger les modèles
loader.load('models/modelSimpson.glb', function(gltf) {
    scene.add(gltf.scene);

    // Récupérer les objets de la scène glTF
    plane = gltf.scene.getObjectByName('Plane');
    plane.material.color.set(0x000000);
    plane.material.receiveShadow = true;
    plane.castShadow = true;

    paddle1 = gltf.scene.getObjectByName('PaddleBart');
    paddle1.castShadow = true;

    paddle2 = gltf.scene.getObjectByName('PaddleMarge');

    paddle1.castShadow = true;
    paddle2.castShadow = true;
    ball = gltf.scene.getObjectByName('donut');
    ball.castShadow = true;
    topWall = gltf.scene.getObjectByName('Wall');
    bottomWall = gltf.scene.getObjectByName('Wall001');
    topWall.castShadow = true;
    bottomWall.castShadow = true;
    boundry = gltf.scene.getObjectByName('Boundry');
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
    scoreP2object.push(gltf.scene.getObjectByName('4R'));
    scoreP2object.push(gltf.scene.getObjectByName('5_R'));

    gltf.scene.getObjectByName('Moustache_&_dance').visible = false;
    gltf.scene.getObjectByName('Boundry').visible = false;
    gltf.scene.getObjectByName('Boundry001').visible = false;
    gltf.scene.getObjectByName('Boundry002').visible = false;
    gltf.scene.getObjectByName('Boundry003').visible = false;
    gltf.scene.getObjectByName('Boundry004').visible = false;
    gltf.scene.getObjectByName('Boundry005').visible = false;
    gltf.scene.getObjectByName('Boundry006').visible = false;
    gltf.scene.getObjectByName('Boundry007').visible = false;
    gltf.scene.getObjectByName('Boundry008').visible = false;
    gltf.scene.getObjectByName('Boundry009').visible = false;
    gltf.scene.getObjectByName('Boundry010').visible = false;
    gltf.scene.getObjectByName('Boundry011').visible = false;
    gltf.scene.getObjectByName('Boundry012').visible = false;
    gltf.scene.getObjectByName('Boundry013').visible = false;
    gltf.scene.getObjectByName('Boundry014').visible = false;
    gltf.scene.getObjectByName('Boundry015').visible = false;
    gltf.scene.getObjectByName('Boundry016').visible = false;
    gltf.scene.getObjectByName('Boundry017').visible = false;
    gltf.scene.getObjectByName('Ball').visible = false;
    gltf.scene.getObjectByName('Paddle').visible = false;
    gltf.scene.getObjectByName('Paddle001').visible = false;

    

    // Positionner les scores
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
    

    
    animate();
}, undefined, function(error) {
    console.error(error);
});




let ballSpeed = { x: 0.2, z: 0.2 };
console.log(ballSpeed);
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
        if (ball.position.x <= paddle1.position.x + 0.6 && ball.position.z <= paddle1.position.z + 6.2 / 2 && ball.position.z >= paddle1.position.z - 6.2 / 2) {
            ballSpeed.x *= -1;
        }
        if (ball.position.x >= paddle2.position.x - 0.6 && ball.position.z <= paddle2.position.z + 6.2 / 2 && ball.position.z >= paddle2.position.z - 6.2 / 2) {
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
        else if (scoreP1 == 5 || scoreP2 == 5){
            ball.position.set(0, 0, 0);
            if (scoreP1 == 5)
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
