import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { v4 as uuidv4 } from 'uuid';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import {listenerPongOnline} from '../logic/unloadpongonline.js';
import { monitorTokenExpiration } from "../logic/router.js"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(700, 500);
const loader = new GLTFLoader();
const labelRenderer = new CSS2DRenderer();
sessionStorage.setItem("opponent", "KOICOUBE");
sessionStorage.setItem("gameOverO", "false");
let paddle1, paddle2, ball, plane, topWall, bottomWall, scoreP1, scoreP2, scoreP1object = [], scoreP2object = [], p1WIN, p2WIN, title, sound, sound1, sound2, sound3, modelPath, animationID, result;
let soundPlayed = false;
let isModelLoaded = false;
let isConfigReady = false;
let go = false;
let ballSpeed = { x: 0.2, z: 0.2 };
let paddleSpeed = 0.2;
let playerID = sessionStorage.getItem('id');


let gameID;
// window.ws = null;
let playerNumber;
let connectedPlayers = 0;

function initGame () {
    //console.log("Initializing game...");
//Camera
    camera.position.set(0, 30, 20);
    controls.update();
    camera.lookAt(0, 0, 0);

    //console.log(scene);

//Lights & shadowindow.ws
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
    spotLight2.penumbra = 0.2;
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

    audioLoader.load( '/frontend/js/game/sounds/obi-wan-hello-there.mp3', function ( buffer ) {
        sound = new THREE.Audio( listener );
        sound.setBuffer( buffer );
        sound.setVolume( 0.9 );
    });
    audioLoader.load( '/frontend/js/game/sounds/bouncing-effect.mp3', function ( buffer ) {
            sound1 = new THREE.Audio( listener );
            sound1.setBuffer( buffer );
            sound1.setVolume( 0.1 );
    });
    audioLoader.load( '/frontend/js/game/sounds/bruh.mp3', function ( buffer ) {
        sound2 = new THREE.Audio( listener );
        sound2.setBuffer( buffer );
        sound2.setVolume( 0.1 );
    });
    audioLoader.load( '/frontend/js/game/sounds/yeah-boiii-i-i-i.mp3', function ( buffer ) {
        sound3 = new THREE.Audio( listener );
        sound3.setBuffer( buffer );
        sound3.setLoop( false );
        sound3.setVolume( 0.1 );
    });

    //Shadowindow.ws
    plane.material.color.set(0x000);
    plane.material.receiveShadow = true;
    plane.receiveShadow = true;
    paddle1.castShadow = true;
    paddle2.castShadow = true;
    ball.castShadow = true;
    topWall.castShadow = true;
    bottomWall.castShadow = true;
    p1WIN.castShadow = true;
    p2WIN.castShadow = true;
    title.castShadow = true;
    for (let i = 0; i < scoreP1object.length; i++) {
        scoreP1object[i].castShadow = true;
        scoreP2object[i].castShadow = true;
    }
    //Scores
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
    isConfigReady = true;
    //console.log("isConfigReady set to true");
}

function initGameSimpson () {
    //console.log("Initializing game...");
    //Camera
        camera.position.set(0, 30, 20);
        controls.update();
        camera.lookAt(0, 0, 0);
    
        //console.log(scene);
    
    //Lights & shadowindow.ws
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
    
        let spotLight = new THREE.SpotLight( 0xfffff0, 10000 );
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
    
        let spotLight2 = new THREE.SpotLight( 0xfffff0, 10000 );
        spotLight2.name = 'Spot Light';
        spotLight2.angle = Math.PI / 5;
        spotLight2.penumbra = 0.2;
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
    
        audioLoader.load( '/frontend/js/game/sounds/salut.mp3', function ( buffer ) {
            sound = new THREE.Audio( listener );
            sound.setBuffer( buffer );
            sound.setVolume( 0.1 );
        });
        audioLoader.load( '/frontend/js/game/sounds/homer-woohoo.mp3', function ( buffer ) {
                sound1 = new THREE.Audio( listener );
                sound1.setBuffer( buffer );
                sound1.setVolume( 0.1 );
        });
        audioLoader.load( '/frontend/js/game/sounds/homer_doh.mp3', function ( buffer ) {
            sound2 = new THREE.Audio( listener );
            sound2.setBuffer( buffer );
            sound2.setVolume( 0.1 );
        });
        audioLoader.load( '/frontend/js/game/sounds/c_nul_homer.mp3', function ( buffer ) {
            sound3 = new THREE.Audio( listener );
            sound3.setBuffer( buffer );
            sound3.setLoop( false );
            sound3.setVolume( 0.1 );
        });
    
        //Shadowindow.ws
        //plane.material.color.set(0x000);
        plane.material.receiveShadow = true;
        plane.receiveShadow = true;
        paddle1.castShadow = true;
        paddle2.castShadow = true;
        ball.castShadow = true;
        topWall.castShadow = true;
        bottomWall.castShadow = true;
        p1WIN.castShadow = true;
        p2WIN.castShadow = true;
        title.castShadow = true;
        for (let i = 0; i < scoreP1object.length; i++) {
            scoreP1object[i].castShadow = true;
            scoreP2object[i].castShadow = true;
        }
        //Scores
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
        isConfigReady = true;
        //console.log("isConfigReady set to true");
    }

window.startGame = function(config) {
        console.log('JE COMMENCE REELEMENT LE JEU avec la config : ', config);
        if (config['Map'] == 'Simpson') {
            modelPath = '/frontend/js/game/models/modelSimpson.glb';
    
            new Promise((resolve, reject) => {
                loader.load(modelPath, function(gltf) {
                    scene.add(gltf.scene);
            
                    plane = gltf.scene.getObjectByName('Plane');
                    paddle1 = gltf.scene.getObjectByName('Paddle1');
                    paddle2 = gltf.scene.getObjectByName('Paddle2');
                    ball = gltf.scene.getObjectByName('Ball');
                    topWall = gltf.scene.getObjectByName('WallT');
                    bottomWall = gltf.scene.getObjectByName('WallB');
                    p1WIN = gltf.scene.getObjectByName('P1WIN');
                    p2WIN = gltf.scene.getObjectByName('P2WIN');
                    title = gltf.scene.getObjectByName('title');
                
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
                    isModelLoaded = true;
                    //console.log("isModelLoaded set to true");
                    resolve();
                }, undefined, function(error) {
                    console.error(error);
                    reject(error);
                });
            }).then(() => {
                if(isModelLoaded)
                    initGameSimpson();
            }).catch((error) => {
                console.error('Failed to load model:', error);
            });
        }
    else if (config['Map'] == 'Classique') {
        modelPath = '/frontend/js/game/models/modelMoustache.glb';
        new Promise((resolve, reject) => {
            loader.load(modelPath, function(gltf) {
            //console.log("Model loaded:", gltf);
                scene.add(gltf.scene);
        
            plane = gltf.scene.getObjectByName('Plane');
            paddle1 = gltf.scene.getObjectByName('Paddle1');
            paddle2 = gltf.scene.getObjectByName('Paddle2');
            ball = gltf.scene.getObjectByName('Ball');
            topWall = gltf.scene.getObjectByName('WallT');
            bottomWall = gltf.scene.getObjectByName('WallB');
            p1WIN = gltf.scene.getObjectByName('P1WIN');
            p2WIN = gltf.scene.getObjectByName('P2WIN');
            title = gltf.scene.getObjectByName('title');
            
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
            isModelLoaded = true;
            //console.log("isModelLoaded set to true");
            resolve();
            }, undefined, function(error) {
                console.error(error);
                reject(error);
            });
        }).then(() => {
            if(isModelLoaded)
                initGame();

        }).catch((error) => {
            console.error('Failed to load modelsimps:', error);
        }
    );

    }
    let countdown = 3;
    let countdownDisplay = document.getElementById('countdownDisplay');
    let waitingDisplay = document.getElementById('waitingDisplay');
    countdownDisplay.id = 'countdownDisplay';
    
    
    //console.log("isModelLoaded:", isModelLoaded, "isConfigReady:", isConfigReady);
    let vitesse;
    if(config['Vitesse du jeu'] == 'Progressive') {
        vitesse = true;
    }
    else {
        vitesse = false;
    }
    //console.log("Connected players:", connectedPlayers);
    console.log('JARRRRIVE ICI', connectedPlayers, isModelLoaded, isConfigReady);
    let checkReadyInterval = setInterval(() => {
        if (isModelLoaded && isConfigReady) {
            //console.log("Both isModelLoaded and isConfigReady are true. Starting animation.");
            //connectWebSocket();
            let countdownInterval = setInterval(() => {
                waitingDisplay.style.display = 'none';
                countdownDisplay.style.display = 'block';
                countdownDisplay.innerText = countdown;
                countdown--;
                
                if (countdown < 0) {
                    countdownDisplay.innerText = 'GO';
                    clearInterval(countdownInterval);
                    setTimeout(() => {
                        countdownDisplay.style.display = 'none';
                        go = true;
                    }, 1000);
                }
            }, 1000);
            nicknamesIG(config);
            animate(vitesse);
            sound.play();
            clearInterval(checkReadyInterval); // Clear the interval once conditions are met
        }
    }, 300); 
}


function animate(vitesse) {
    if (sessionStorage.getItem("gameOverO") == "false" && (window.ws && window.ws.readyState === WebSocket.OPEN)) {
        animationID = requestAnimationFrame(() => animate(vitesse));
        controls.update();
        if (ball && paddle1 && paddle2 ) {
            if(go) {
                ball.position.x += ballSpeed.x;
                ball.position.z += ballSpeed.z;
            }
            //collision murs
            if (ball.position.z <= topWall.position.z + 0.5 || ball.position.z >= bottomWall.position.z - 0.5) {
                ballSpeed.z *= -1;
                sendBallPosition();
                
            }
            //collision paddle1 et paddle2
            if (ball.position.x <= paddle1.position.x + 0.6 && ball.position.z <= paddle1.position.z + 6.4 / 2 && ball.position.z >= paddle1.position.z - 6.4 / 2) {
                sound1.play();
                if (vitesse == true) {
                    ballSpeed.x = Math.min(Math.max(ballSpeed.x * -1.1, -0.7), 0.7);
                    sendBallPosition();
                }
                else {
                    ballSpeed.x *= -1;
                    sendBallPosition();
                }
            }
            if (ball.position.x >= paddle2.position.x - 0.6 && ball.position.z <= paddle2.position.z + 6.4 / 2 && ball.position.z >= paddle2.position.z - 6.4 / 2) {
                sound1.play();
                if (vitesse == true) {
                    ballSpeed.x = Math.min(Math.max(ballSpeed.x * -1.1, -0.7), 0.7);
                    sendBallPosition();
                }
                else {
                    ballSpeed.x *= -1;
                    sendBallPosition();
                }
            }
            //point marqué
            if (ball.position.x <= paddle1.position.x) {
                sound2.play();
                scoreP2++;
                sendScore(2);
                for (let i = 0; i < scoreP1object.length; i++) {
                    scoreP2object[i].visible = false;
                }
                scoreP2object[scoreP2].visible = true;
                ball.position.set(0, 0, 0);
                ballSpeed = { x: -0.2, z: -0.2 };
                ball.position.x -= ballSpeed.x;
                ball.position.z -= ballSpeed.z;
                sendBallPosition();
            } else if (ball.position.x >= paddle2.position.x) {
                sound2.play();
                scoreP1++;
                sendScore(1);
                for (let i = 0; i < scoreP1object.length; i++) {
                    scoreP1object[i].visible = false;
                }
                scoreP1object[scoreP1].visible = true;
                ball.position.set(0, 0, 0);
                ballSpeed = { x: 0.2, z: 0.2 };
                ball.position.x -= ballSpeed.x;
                ball.position.z -= ballSpeed.z;
                sendBallPosition();
            //fin de la partie
            } else if (scoreP1 == 5 || scoreP2 == 5) {
                if (!soundPlayed) {
                    setTimeout(() => {
                        sound3.play();
                    }, 1000);
                    soundPlayed = true;
                }
                ball.position.set(0, 0, 0);
                ballSpeed = { x: 0, z: 0 };
                sendBallPosition();
                if (scoreP1 == 5) {
                    p1WIN.visible = true;
                    if(playerNumber == 1) {
                        result = 1;
                    }
                    else {
                        result = 0;
                    }
                    sendAPIWL(result);
                    handleGameOver();
                    
                } else {
                    p2WIN.visible = true;
                    if(playerNumber == 1) {
                        result = 0;
                    }
                    else {
                        result = 1;
                    }
                    sendAPIWL(result);
                    handleGameOver();
                }

                
            }
            //gestion des paddles
            if (paddle1 && paddle2) {
                if(playerNumber == 2) {
                    if (keys['o'] && paddle2.position.z - 2 - paddleSpeed > topWall.position.z + 0.5) {
                        paddle2.position.z -= paddleSpeed;
                        sendPaddlePosition(2);
                    } 
                    if (keys['l'] && paddle2.position.z + 2 + paddleSpeed < bottomWall.position.z - 0.5) {
                        paddle2.position.z += paddleSpeed;
                        sendPaddlePosition(2);
                    } 
                }
                if(playerNumber == 1) {
                    if (keys['q'] && paddle1.position.z - 2 - paddleSpeed > topWall.position.z + 0.5) {
                        paddle1.position.z -= paddleSpeed;
                        sendPaddlePosition(1);
                    } 
                    if (keys['a'] && paddle1.position.z + 2 + paddleSpeed < bottomWall.position.z - 0.5) {
                        paddle1.position.z += paddleSpeed;
                        sendPaddlePosition(1);
                    }
                }
            }
        }

        labelRenderer.render(scene, camera);
        renderer.render(scene, camera);
    }
}

let keys = {};

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

const questions = [
    {
        question: "Vitesse du jeu",
        options: ["Classique", "Progressive"]
    },
    {
        question: "Map",
        options: ["Classique", "Simpson"]
    }
];

let currentQuestionIndex = 0;
let configuration = {};

function showQuestion() {
	const configMenu = document.getElementById('config-menu');
	const questionContainer = document.getElementById('question-container');
	const optionsContainer = document.getElementById('options-container');
	configMenu.style.display = 'block';

    const currentQuestion = questions[currentQuestionIndex];
    questionContainer.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';
    
    currentQuestion.options.forEach(option => {
        const li = document.createElement('li');
        li.textContent = option;
		li.classList.add('btn');
		li.classList.add('btn-outline-secondary');
		li.classList.add('text-white');
		li.classList.add('d-block');
        li.addEventListener('click', () => selectOption(option));
        optionsContainer.appendChild(li);
    });
}

function selectOption(option) {
	const configMenu = document.getElementById('config-menu');
    const waitingDisplay = document.getElementById('waitingDisplay');
    const currentQuestion = questions[currentQuestionIndex];
    configuration[currentQuestion.question] = option;
    
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        configMenu.style.display = 'none';
        waitingDisplay.style.display = 'block';
        // Start the game with the selected configuration
        //console.log('Configuration:', configuration);
		document.getElementById('board_three').appendChild(renderer.domElement);
        //startGame(configuration);
        connectWebSocket(configuration);
        console.log('config dans startgame:', configuration);
    }
}

function connectWebSocket(config) {
    if (window.ws) {
        console.log('WebSocket already connected');
        return;
    }
    console.log('location.host', location.host);
    window.ws = new WebSocket('wss://'+ location.host + ':3000');

    window.ws.onopen = () => {
        console.log('WebSocket connection opened');
        window.ws.send(JSON.stringify({ type: 'config', config, playerID: playerID }));
        console.log('Sending configuration:', config);
    };

    window.ws.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            // if (message.type === 'player') {
            //     gameID = message.gameID; // Store the received gameID
            //     console.log('Received gameID from server:', gameID);
            // }
            handleWebSocketMessage(message, config);
        } catch (error) {
            console.error('Invalid JSON:', event.data);
        }
    };

    window.ws.onclose = () => {
        //sendAPIWL(0);
        console.log('WebSocket connection closed');
        window.ws = null;
    };

    window.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        alert('WebSocket connection failed. Please check the server status.');
    };

    
}


function handleWebSocketMessage(message, config) {
    console.log('Message reçu:', message);
    if (!message.type) {
        console.warn('Received message without type:', message);
        return;
    }
    switch (message.type) {
        case 'clientCount':
            //console.log('Connected clients:', message.count);
            connectedPlayers = message.count;
            break;
        case 'nickname':
            sessionStorage.setItem("opponent", message.nickname);
            break;
        case 'left':
            sendAPIWL(0);
            if (labelRenderer && labelRenderer.domElement) {
                document.body.removeChild(labelRenderer.domElement);
                console.log('labelRenderer removed.');
            }
            window.ws.close();
            break;
        case 'start':
            playerNumber = message.playerNumber;
            console.log('Player number:', playerNumber);
            console.log('Starting game with configuration:', message.config);
            window.ws.send(JSON.stringify({ type: 'nickname', nickname: sessionStorage.getItem("nickname") }));
            window.startGame(message.config);
        case 'paddle':
            if (message.player === 1) {
                paddle1.position.z = message.position;
                //console.log('Position paddle1:', paddle1.position.z);
            } else if (message.player === 2) {
                paddle2.position.z = message.position;
                //console.log('Position paddle2:', paddle2.position.z);
            }
            break;
        case 'ball':
            ball.position.x = message.position.x;
            ball.position.z = message.position.z;
            ballSpeed.x = message.speed.x;
            ballSpeed.z = message.speed.z;
            break;
        case 'score':
            scoreP1 = message.scoreP1;
            scoreP2 = message.scoreP2;
            if(message.player == 1) {
                for (let i = 0; i < scoreP1object.length; i++) {
                    scoreP1object[i].visible = false;
                }
                scoreP1object[scoreP1].visible = true;
            }
            else if(message.player == 2) {
                for (let i = 0; i < scoreP2object.length; i++) {
                    scoreP2object[i].visible = false;
                }
                scoreP2object[scoreP2].visible = true;
            }
            //updateScoreDisplay(message.player);
            break;
        case 'join':
            if (message.gameID !== gameID) {
                console.warn('Mismatched game ID', message.gameID, gameID);
                window.ws.close();
            }
        case 'errorID':
            handleGameOver();
            break;
        case 'deco':
            console.log('Player', message.player, 'disconnected');
            if(message.player == 0) {
                scoreP2 = 5;
                scoreP1 = 0;
                for (let i = 0; i < scoreP1object.length; i++) {
                    scoreP1object[i].visible = false;
                    scoreP2object[i].visible = false;
                }
                scoreP1object[scoreP1].visible = true;
                scoreP2object[scoreP2].visible = true;
            }
            else if(message.player == 1) {
                scoreP1 = 5;
                scoreP2 = 0;
                for (let i = 0; i < scoreP2object.length; i++) {
                    scoreP2object[i].visible = false;
                    scoreP1object[i].visible = false;
                }
                scoreP2object[scoreP2].visible = true;
                scoreP1object[scoreP1].visible = true;
            }

            break;

        default:
            console.warn('Unhandled message type:', message.type);
    }
}

function handleGameOver() {
    // Gérer la fin de la partie ici
    cancelAnimationFrame(animationID);
    setTimeout(() => {
        const boardTwo = document.getElementById('board_three');
        if (boardTwo && boardTwo.contains(renderer.domElement)) {
            boardTwo.removeChild(renderer.domElement);
            console.log("Game stopped and board_three cleared.");
            setTimeout(() => {
                listenerPongOnline();
                // Fermer la connexion WebSocket
                if (window.ws && window.ws.readyState === WebSocket.OPEN) {
                    window.ws.close();
                    console.log('WebSocket connection closed at game over. Connected players: ', connectedPlayers);
                }
                if (labelRenderer && labelRenderer.domElement) {
                    document.body.removeChild(labelRenderer.domElement);
                    console.log('labelRenderer removed.');
                }
            }, 3000);
        }
    }, 3000);


}


function sendPaddlePosition(playerNumber) {
    if (window.ws && window.ws.readyState === WebSocket.OPEN) {
        let position;
        if (playerNumber === 1) {
            position = paddle1.position.z;
        } else if (playerNumber === 2) {
            position = paddle2.position.z;
        }
        
        const message = {
            type: 'paddle',
            player: playerNumber,
            position: position
        };
        
        window.ws.send(JSON.stringify(message));
        //console.log('Sending paddle position:', message);
    } 
    else {
        console.warn('WebSocket is not open. ReadyState:');
    
    }
}

function sendBallPosition() {
    if (window.ws && window.ws.readyState === WebSocket.OPEN) {
        const message = {
            type: 'ball',
            position: { x: ball.position.x, z: ball.position.z },
            speed: { x: ballSpeed.x, z: ballSpeed.z }
        };
        
        window.ws.send(JSON.stringify(message));
        //console.log('Sending ball position:', message);
    } else {
        console.warn('WebSocket is not open. ReadyState:');
    }
}

function sendScore(playerNumber) {
    if (window.ws && window.ws.readyState === WebSocket.OPEN) {
        const message = {
            type: 'score',
            player: playerNumber,
            scoreP1: scoreP1,
            scoreP2: scoreP2
        };
        console.log('Sending score:', message);
        window.ws.send(JSON.stringify(message));
        //console.log('Sending score:', message);
    } else {
        console.warn('WebSocket is not open. ReadyState:');
    }
}

showQuestion();

async function sendAPIWL(result) {
    sessionStorage.setItem("gameOverO", "true");
    const access = await monitorTokenExpiration();
    const timestamp = new Date().getTime();
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('fr-FR');
    let message;
    let win;
    let lose;
    if(result == 1) {
        message = ['Win against ' + sessionStorage.getItem("opponent") + ' date: ' + formattedDate];
        win = 1;
        lose = 0;
    }
    else {
        message = ['Lose against ' + sessionStorage.getItem("opponent") + ' date: ' + formattedDate];
        win = 0;
        lose = 1;
    }


    const init = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`,
        },
        body: JSON.stringify({history: message, wins: win, losses: lose}),
    };

    try {
        let hostnameport = "https://" + window.location.host

        const response = await fetch(hostnameport + '/api/players/details', init);

        if (response.status != 200) {
            const errorMsg = await response.json();
			
            showError(errorMsg["error"]);
            return;
        }
        if (response.status === 200) {
            const data = await response.json();
        }

    } catch (e) {
        console.error(e);
    }
}

function nicknamesIG(config) {
    // Autres initialisations de jeu...

    // Charger la police et créer les textes
    const fontLoader = new FontLoader();
    let player1Nickname, player2Nickname, textMaterial1, textMaterial2, adaptedFont;
    if(config['Map'] == 'Classique') {
        adaptedFont = '/frontend/js/game/fonts/helvetiker_regular.typeface.json';
    }
    else if(config['Map'] == 'Simpson') {
        adaptedFont = '/frontend/js/game/fonts/Simpsonfont_Regular.json';
    }

    fontLoader.load(adaptedFont, function (font) {
        if(playerNumber == 1) {
            player1Nickname = sessionStorage.getItem("nickname");
            player2Nickname = sessionStorage.getItem("opponent");
        }
        else {
            player1Nickname = sessionStorage.getItem("opponent");
            player2Nickname = sessionStorage.getItem("nickname");
        }
        if(config['Map'] == 'Classique') {
            textMaterial1 = new THREE.MeshPhongMaterial({ color: 0x6666ff });
            textMaterial2 = new THREE.MeshPhongMaterial({ color: 0xff6666 });
        }
        else if(config['Map'] == 'Simpson') {
            textMaterial1 = new THREE.MeshPhongMaterial({ color: 0xf9f639 });
            textMaterial2 = new THREE.MeshPhongMaterial({ color: 0x5375f5 });
        }

        // Créer le texte pour le joueur 1
        const player1TextGeometry = new TextGeometry(player1Nickname, {
            font: font,
            size: 1,
            depth: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 5
        });
        const player1TextMesh = new THREE.Mesh(player1TextGeometry, textMaterial1);
        player1TextMesh.position.set(-14, 4, -12); // Position en haut à gauche
        player1TextMesh.rotation.set(-Math.PI / 8, 0, 0); // Inclinaison sur l'axe z
        player1TextMesh.castShadow = true;
        scene.add(player1TextMesh);

        // Créer le texte pour le joueur 2
        const player2TextGeometry = new TextGeometry(player2Nickname, {
            font: font,
            size: 1,
            depth: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 5
        });
        const player2TextMesh = new THREE.Mesh(player2TextGeometry, textMaterial2);
        player2TextMesh.position.set(10, 4, -12); // Position en haut à droite
        player2TextMesh.rotation.set(-Math.PI / 8, 0, 0); 
        player2TextMesh.castShadow = true;
        scene.add(player2TextMesh);
    });

    // Ajouter le renderer CSS2D
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);
}
