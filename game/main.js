import * as THREE from './node_modules/three/build/three.module.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

const loader = new GLTFLoader();

let paddle1, paddle2, ball, topWall, bottomWall, boundry, plane;

// Charger les modèles
loader.load('models/model.glb', function(gltf) {
    scene.add(gltf.scene);

    // Récupérer les objets de la scène glTF
    paddle1 = gltf.scene.getObjectByName('Paddle');
    paddle2 = gltf.scene.getObjectByName('Paddle.001');
    ball = gltf.scene.getObjectByName('Ball');
    topWall = gltf.scene.getObjectByName('Wall');
    bottomWall = gltf.scene.getObjectByName('Wall.001');
    boundry = gltf.scene.getObjectByName('Boundry');
    plane = gltf.scene.getObjectByName('Plane');

    animate();
}, undefined, function(error) {
    console.error(error);
});

let ballSpeed = { x: 0.05, y: 0.05 };
let paddleSpeed = 0.1;

function animate() {
    requestAnimationFrame(animate);

    if (ball && paddle1 && paddle2) {
        // Déplacement de la balle
        ball.position.x += ballSpeed.x;
        ball.position.y += ballSpeed.y;

        // Collision avec les murs
        if (ball.position.y >= 2.4 || ball.position.y <= -2.4) {
            ballSpeed.y = -ballSpeed.y;
        }

        // Collision avec les raquettes
        if ((ball.position.x >= 2.4 && ball.position.y >= paddle2.position.y - 0.5 && ball.position.y <= paddle2.position.y + 0.5) ||
            (ball.position.x <= -2.4 && ball.position.y >= paddle1.position.y - 0.5 && ball.position.y <= paddle1.position.y + 0.5)) {
            ballSpeed.x = -ballSpeed.x;
        }
    }

    renderer.render(scene, camera);
}

document.addEventListener('keydown', (event) => {
    if (paddle1 && paddle2) {
        switch (event.key) {
            case 'ArrowUp':
                paddle2.position.y += paddleSpeed;
                break;
            case 'ArrowDown':
                paddle2.position.y -= paddleSpeed;
                break;
            case 'w':
                paddle1.position.y += paddleSpeed;
                break;
            case 's':
                paddle1.position.y -= paddleSpeed;
                break;
        }
    }
});
