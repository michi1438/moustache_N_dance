import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { v4 as uuidv4 } from 'uuid';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(700, 500);
const loader = new GLTFLoader();
let paddle1, paddle2, ball, plane, topWall, bottomWall, scoreP1, scoreP2, scoreP1object = [], scoreP2object = [], p1WIN, p2WIN, title, sound, sound1, sound2, sound3, modelPath;
let soundPlayed = false;
let isModelLoaded = false;
let isConfigReady = false;
let go = false;
let ballSpeed = { x: 0.2, z: 0.2 };
let paddleSpeed = 0.2;

let gameID = uuidv4();
let ws;
let playerNumber;
let connectedPlayers = 0;

function initGame () {
    //console.log("Initializing game...");
//Camera
    camera.position.set(0, 30, 20);
    controls.update();
    camera.lookAt(0, 0, 0);

    //console.log(scene);

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

    //Shadows
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
    
    //Lights & shadows
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        let dirLight = new THREE.DirectionalLight( 0xfffff0, 2 );
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
        scene.add( new THREE.CameraHelper( spotLight.shadow.camera ) );
    
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
        scene.add( new THREE.CameraHelper( spotLight2.shadow.camera ) );
    
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
    
        //Shadows
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
    let checkReadyInterval = setInterval(() => {
        if (connectedPlayers > 1 && isModelLoaded && isConfigReady) {
            //console.log("Both isModelLoaded and isConfigReady are true. Starting animation.");
            //connectWebSocket();
            let countdownInterval = setInterval(() => {
                countdownDisplay.innerText = countdown;
                countdown--;
                
                if (countdown < 0) {
                    countdownDisplay.innerText = 'GO';
                    clearInterval(countdownInterval);
                    setTimeout(() => {
                        countdownDisplay.remove();
                        go = true;
                    }, 1000);
                }
            }, 1000);
            console.log("playerNumber:", playerNumber);
            animate(vitesse);
            sound.play();
            clearInterval(checkReadyInterval); // Clear the interval once conditions are met
        }
    }, 300); 
}


function animate(vitesse) {
    requestAnimationFrame(() => animate(vitesse));
    controls.update();
    if (ball && paddle1 && paddle2 ) {
        if(go) {
            ball.position.x += ballSpeed.x;
            ball.position.z += ballSpeed.z;
            if(playerNumber == 1){
                setInterval(sendPaddlePosition(1), 100);
                setInterval(sendBallPosition, 100);
            } else {
                setInterval(sendPaddlePosition(2), 100);
            }
        }
        //collision murs
        if (ball.position.z <= topWall.position.z + 0.5 || ball.position.z >= bottomWall.position.z - 0.5) {
            ballSpeed.z *= -1;
            
        }
        //collision paddle1 et paddle2
        if (ball.position.x <= paddle1.position.x + 0.6 && ball.position.z <= paddle1.position.z + 6.4 / 2 && ball.position.z >= paddle1.position.z - 6.4 / 2) {
            sound1.play();
            if (vitesse == true) {
                ballSpeed.x = Math.min(Math.max(ballSpeed.x * -1.1, -0.7), 0.7);
            }
            else {
                ballSpeed.x *= -1;
            }
        }
        if (ball.position.x >= paddle2.position.x - 0.6 && ball.position.z <= paddle2.position.z + 6.4 / 2 && ball.position.z >= paddle2.position.z - 6.4 / 2) {
            sound1.play();
            if (vitesse == true) {
                ballSpeed.x = Math.min(Math.max(ballSpeed.x * -1.1, -0.7), 0.7);
            }
            else {
                ballSpeed.x *= -1;
            }
        }
        //point marqué
        if (ball.position.x <= paddle1.position.x) {
            sound2.play();
            ball.position.set(0, 0, 0);
            ballSpeed = { x: -0.2, z: -0.2 };
            ball.position.x -= ballSpeed.x;
            ball.position.z -= ballSpeed.z;
            scoreP2++;
            scoreP2object[scoreP2 - 1].visible = false;
            scoreP2object[scoreP2].visible = true;
        } else if (ball.position.x >= paddle2.position.x) {
            sound2.play();
            ball.position.set(0, 0, 0);
            ballSpeed = { x: 0.2, z: 0.2 };
            ball.position.x -= ballSpeed.x;
            ball.position.z -= ballSpeed.z;
            scoreP1++;
            scoreP1object[scoreP1 - 1].visible = false;
            scoreP1object[scoreP1].visible = true;
        //fin de la partie
        } else if (scoreP1 == 5 || scoreP2 == 5) {
            if (!soundPlayed) {
                setTimeout(() => {
                    sound3.play();
                }, 1000);
                soundPlayed = true;
            }
            ball.position.set(0, 0, 0);
            if (scoreP1 == 5) {
                p1WIN.visible = true;
            } else {
                p2WIN.visible = true;
            }
        }
        //gestion des paddles
        if (paddle1 && paddle2) {
            if(playerNumber == 2) {
                if (keys['o'] && paddle2.position.z - 2 - paddleSpeed > topWall.position.z + 0.5) {
                    paddle2.position.z -= paddleSpeed;
                } 
                if (keys['l'] && paddle2.position.z + 2 + paddleSpeed < bottomWall.position.z - 0.5) {
                    paddle2.position.z += paddleSpeed;
                } 
            }
            if(playerNumber == 1) {
                if (keys['a'] && paddle1.position.z - 2 - paddleSpeed > topWall.position.z + 0.5) {
                    paddle1.position.z -= paddleSpeed;
                } 
                if (keys['q'] && paddle1.position.z + 2 + paddleSpeed < bottomWall.position.z - 0.5) {
                    paddle1.position.z += paddleSpeed;
                }
            }
        }
    }

    renderer.render(scene, camera);
}


const questions = [
    {
        question: "Nombre de joueurs",
        options: ["2 joueurs", "3 joueurs", "4 joueurs", "5 joueurs", "6 joueurs"]
    },
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

function listenerPongOnline() {
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
        li.addEventListener('click', () => selectOption(option));
        optionsContainer.appendChild(li);
    });
}

function selectOption(option) {
	const configMenu = document.getElementById('config-menu');
    const currentQuestion = questions[currentQuestionIndex];
    configuration[currentQuestion.question] = option;
    
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        listenerPongOnline();
    } else {
        configMenu.style.display = 'none';
        // Start the game with the selected configuration
        //console.log('Configuration:', configuration);
		document.getElementById('board_two').appendChild(renderer.domElement);
        startGame(configuration);
    }
}

function startGame(config) {
    // if (connectedPlayers < 2) {
    //     console.log('Waiting for more players to connect...');
    //     return;
    // }
    //console.log('Starting game with configuration:', config);
    // This function will be implemented in main.js
    // You can call any initialization functions here
    connectWebSocket();
    window.startGame(config);
}




function connectWebSocket() {
    if (ws) {
        console.log('WebSocket already connected');
        return;
    }

    ws = new WebSocket('wss://localhost:3000');

    ws.onopen = () => {
        console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            if (message.type === 'player') {
                gameID = message.gameID; // Store the received gameID
                console.log('Received gameID from server:', gameID);
            }
            handleWebSocketMessage(message);
        } catch (error) {
            console.error('Invalid JSON:', event.data);
        }
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
        ws = null;
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        alert('WebSocket connection failed. Please check the server status.');
    };

    
}


function handleWebSocketMessage(message) {
    //console.log('Message reçu:', message);
    const now = Date.now();
    const delay = now - message.timestamp;
    if (delay > 100) { // Seuil de délai en millisecondes
        ws.send(JSON.stringify({ type: 'sync', delay }));
    }
    switch (message.type) {
        case 'clientCount':
            //console.log('Connected clients:', message.count);
            connectedPlayers = message.count;
            break;
        case 'player': 
            playerNumber = message.player;
            break;
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
        case 'adjustDelay':
            const adjustDelay = message.delay;
            setTimeout(() => {
                // Appliquer le délai
            }, adjustDelay);
            break;
        // case 'score':
        //     scoreP1 = message.scoreP1;
        //     scoreP2 = message.scoreP2;
        //     updateScoreDisplay();
        //     break;
        case 'gameOver':
            handleGameOver(message.winner);
            break;
        case 'join':
            if (message.gameID !== gameID) {
                console.warn('Mismatched game ID', message.gameID, gameID);
                ws.close();
            }
        default:
            console.warn('Unhandled message type:', message.type);
    }
}

function updateScoreDisplay() {
    // Mettre à jour l'affichage du score ici
    console.log('Score:', scoreP1, '-', scoreP2);
}

function handleGameOver(winner) {
    // Gérer la fin de la partie ici
    console.log('Game over! Winner:', winner);
}

let keys = {};

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

function sendPaddlePosition(playerNumber) {
    if (ws && ws.readyState === WebSocket.OPEN) {
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
        
        ws.send(JSON.stringify(message));
        //console.log('Sending paddle position:', message);
    } 
    // else {
    //     console.warn('WebSocket is not open. ReadyState:', ws.readyState);
    
    // }
}

function sendBallPosition() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        const message = {
            type: 'ball',
            position: { x: ball.position.x, z: ball.position.z },
            speed: { x: ballSpeed.x, z: ballSpeed.z }
        };
        
        ws.send(JSON.stringify(message));
        //console.log('Sending ball position:', message);
    } else {
        console.warn('WebSocket is not open. ReadyState:', ws.readyState);
    }
}


export default {
    listenerPongOnline,
    // loadPongLocal
};