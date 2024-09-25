
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {listenerPongLocal} from '../logic/ponglocallogic.js';

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
sessionStorage.setItem("gameOver", "false");
let ballSpeed = { x: 0.2, z: 0.2 };
let paddleSpeed = 0.2;

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

    audioLoader.load( '/frontend/js/game/sounds/obi-wan-hello-there.mp3', function ( buffer ) {
        sound = new THREE.Audio( listener );
        sound.setBuffer( buffer );
        sound.setVolume( 0.1 );
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
    console.log("Initializing game...");
    //Camera
        camera.position.set(0, 30, 20);
        controls.update();
        camera.lookAt(0, 0, 0);
    
        console.log(scene);
    
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
        console.log("isConfigReady set to true");
    }

    window.Game = function(config) {
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
            console.log("Model loaded:", gltf);
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
            console.log("isModelLoaded set to true");
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
    //countdownDisplay.id = 'countdownDisplay';
    console.log("isModelLoaded:", isModelLoaded, "isConfigReady:", isConfigReady);
    
    let countdownInterval = setInterval(() => {
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
    }, 1000)
    let vitesse;
    if(config['Vitesse du jeu'] == 'Progressive') {
        vitesse = true;
    }
    else {
        vitesse = false;
    }
    let checkReadyInterval = setInterval(() => {
        if (isModelLoaded && isConfigReady) {
            console.log("Both isModelLoaded and isConfigReady are true. Starting animation.");
            animate(vitesse);
            sound.play();
            clearInterval(checkReadyInterval); // Clear the interval once conditions are met
        }
    }, 300); 
}

function animate(vitesse) {
	if (sessionStorage.getItem("gameOver") == "false") {
		requestAnimationFrame(() => animate(vitesse));
		controls.update();
		if (ball && paddle1 && paddle2 ) {
			if(go) {
				ball.position.x += ballSpeed.x;
				ball.position.z += ballSpeed.z;
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
				setTimeout(() => {
					const boardTwo = document.getElementById('board_two');
				if (boardTwo && boardTwo.contains(renderer.domElement)) {
					boardTwo.removeChild(renderer.domElement);
					console.log("Game stopped and board_two cleared.");
					sessionStorage.setItem("gameOver", "true");
					setTimeout(() => {
						listenerPongLocal();
					}, 3000);
    			}
			    }, 3000);
			}
			//gestion des paddles
			if (paddle1 && paddle2) {
				if (keys['o'] && paddle2.position.z - 2 - paddleSpeed > topWall.position.z + 0.5) {
					paddle2.position.z -= paddleSpeed;
				} 
				if (keys['l'] && paddle2.position.z + 2 + paddleSpeed < bottomWall.position.z - 0.5) {
					paddle2.position.z += paddleSpeed;
				} 
				if (keys['a'] && paddle1.position.z - 2 - paddleSpeed > topWall.position.z + 0.5) {
					paddle1.position.z -= paddleSpeed;
				} 
				if (keys['q'] && paddle1.position.z + 2 + paddleSpeed < bottomWall.position.z - 0.5) {
					paddle1.position.z += paddleSpeed;
				}
			}
		}

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
const configMenu = document.getElementById('config-menu');
const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');

function showQuestion() {
	if (sessionStorage.getItem("gameOver") == "false"){
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
	// if (sessionStorage.getItem("gameOver") == "true")
	// 	stopGame();
}

function selectOption(option) {
	const configMenu = document.getElementById('config-menu');
    const currentQuestion = questions[currentQuestionIndex];
    configuration[currentQuestion.question] = option;
    
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
		// if (document.getElementById('board_two'))
		// 	document.getElementById('board_two').removeChild(renderer.domElemen);
        configMenu.style.display = 'none';
        // Start the game with the selected configuration
        //console.log('Configuration:', configuration);
		document.getElementById('board_two').appendChild(renderer.domElement);
        window.Game(configuration);
    }
}

showQuestion();

