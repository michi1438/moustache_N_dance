const EventEmitter = require('events');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const { config } = require('process');

// Charger les certificats SSL
const server = https.createServer({
    cert: fs.readFileSync('/etc/nginx/ssl/inception.crt'),
    key: fs.readFileSync('/etc/nginx/ssl/inception.key')
});

const gameEvents = new EventEmitter();
const wss = new WebSocket.Server({ server });

let players = [];
let gameID;
let playerConfigs = [];
let playersID = [];
let tabSize;
let tournoiSize;
let configTournoi = {};
let gamePromises = [];
let position = [];
let gamePromise;


wss.on('connection', (ws) => {
    console.log('Total connected clients:', wss.clients.size);

    if (players.length < 50) {
        players.push(ws);
        
        ws.on('message', (message) => {
            const data = JSON.parse(message);
            //console.log('Received message:', data);
            //console.log('data.type:', data.type);
            if (data.type === 'config') {
                const playerIndex = players.indexOf(ws);
                playerConfigs[playerIndex] = data.config;
                ws.config = data.config;
        
                console.log('Received configuration:', playerConfigs);
                console.log('Nbr de configs:', playerConfigs.filter(config => config).length);
        
                // Chercher des configurations correspondantes
                const matchingPlayers = [];
                playerConfigs.forEach((config, index) => {
                    if (config && JSON.stringify(config) === JSON.stringify(data.config)) {
                        matchingPlayers.push(index);
                    }
                });
                console.log('Matching players:', matchingPlayers[0], matchingPlayers[1]);
                if (matchingPlayers.length == 2) {
                    gameID = uuidv4();
                    players[matchingPlayers[0]].gameID = gameID;
                    players[matchingPlayers[1]].gameID = gameID;
                    players[matchingPlayers[0]].send(JSON.stringify({ type: 'start', gameID: gameID, playerNumber: 1, config: playerConfigs[matchingPlayers[0]]}));
                    players[matchingPlayers[1]].send(JSON.stringify({ type: 'start', gameID: gameID, playerNumber: 2, config: playerConfigs[matchingPlayers[1]]}));
                    playerConfigs[matchingPlayers[0]] = null;
                    playerConfigs[matchingPlayers[1]] = null;
                }
            } else if (data.type === 'winner') {
                console.log('Winner:', data.winner);
                gameID = data.gameID;
                // Résoudre la promesse correspondante
                playersID.push(data.winner);
                gamePromise = gamePromises.find(p => p.gameID === gameID);
                if (gamePromise) {
                    gamePromise.resolve();
                    gamePromises = gamePromises.filter(p => p.gameID !== gameID);
                }
            } else if (data.type === 'positionTournament') {
                position.push(data.playerID);
            } else if (data.type === 'tournoi') {
                tournamentConnection(data);
            } else if (data.type === 'Rejoindre') {
                tournamentConnection(data);
            } else {
                broadcast(ws, data);
            }
        });
    

        ws.on('close', () => {
            broadcast(ws, { type: 'deco', player: players.indexOf(ws) });
            const playerIndex = players.indexOf(ws);
            players.splice(playerIndex, 1);
            playerConfigs.splice(playerIndex, 1);
        });

        // Vérifiez si le nombre de clients connectés est égal à 2
        // if (wss.clients.size === 2) {
        //     const message = JSON.stringify({ type: 'clientCount', count: wss.clients.size });
        //     wss.clients.forEach(client => {
        //         if (client.readyState === WebSocket.OPEN) {
        //             client.send(message);
        //         }
        //     });
        // }
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Server is full' }));
        ws.close();
    }
});

function broadcast(sender, message) {
    const data = JSON.stringify(message);
    wss.clients.forEach(client => {
        if (client !== sender && client.readyState === WebSocket.OPEN && client.gameID === sender.gameID) {
            client.send(data);
        }
    });
}

async function tournamentConnection(data) {
    if (data.type === 'Rejoindre') {
        gameEvents.emit('playerJoined', data.playerID);
        console.log('tabSize du début', tabSize);
    } else if(data.type === 'tournoi') {

        tournoiSize = data.config['Taille du tournoi'];
        console.log('tournoisize', tournoiSize);
        tabSize = tournoiSize;
        //tabSize = playersID.length;
        configTournoi = {
            'Vitesse du jeu': data.config['Vitesse du jeu'],
            'Map': data.config['Map']
        };
        //crée un tableau de playersID de la taille de data.config['Taille du tournoi']
        //ajouter le playerID (dans le premier element du tableau) contenu dans data.playerID 
        gameEvents.emit('playerJoined', data.playerID);
        await waitForPlayers();
        await tournamentLogic(data);
    } 
}

async function tournamentLogic(data) {
    console.log('LOGIC TOURNAMENT');
    await waitForPlayers();
    //si le tableau est égale à data.config['Taille du tournoi'] lance les parties entre playersID[0] et playersID[1] jusqu'à la fin du tableau
    if (tabSize == playersID.length) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        await startGames();
        playersID = [];
        try {
            await Promise.all(gamePromises);
        } catch (error) {
            console.error('Erreur lors de l\'attente des jeux:', error);
        }
        console.log('tabsize et playersIDlength', tabSize, playersID.length);
        if(playersID.length == tabSize / 2){
            console.log('salut');   
            tabSize = tabSize / 2;
        }
    }
    //playersID = [];
    console.log('playersID apres promise', playersID);    
    
    //vide le tableau playersID, divise sa taille par 2 et ajoute le playerID des winners dans le tableau
    //si le tableau est égale à 1, le playerID est le winner
    //si le tableau est supérieur à 1, relance la fonction tournamentLogic
    console.log('tabsize et playersIDlength et position', tabSize, playersID.length, position);
    if (tabSize > 1 && tabSize == playersID.length) {
        console.log('relance de la fonction');
        tournamentLogic(data);
    }
    else {
        console.log('playersID[0]', playersID[0]);
        position.push(playersID[0]);
        console.log('fin du tournoi');
        console.log('position', position[0]);
        console.log('position', position[1]);
        console.log('position', position[2]);
        console.log('position', position[3]);
        //envoyer un message au vainqueur pour lui dire que le tournoi est fini
        setTimeout(() => {
            players[0].send(JSON.stringify({ type: 'fintournoi'}));
        }, 2000);
        playersID = [];


    }
}

async function waitForPlayers() {
    while (playersID.length < tabSize) {
        console.log(`En attente de joueurs... Actuellement ${playersID.length}/${tabSize}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde avant de vérifier à nouveau
    }
}

async function startGames() {
    let i = 0;
    while(i < tabSize) {
        console.log('Lancement des games')
        gameID = uuidv4();
        players[[i]].gameID = gameID;
        players[[i+1]].gameID = gameID;
        players[[i]].send(JSON.stringify({ type: 'startT', gameID: gameID, playerNumber: 1, config: configTournoi}));
        players[[i+1]].send(JSON.stringify({ type: 'startT', gameID: gameID, playerNumber: 2, config: configTournoi}));
        // Créez une promesse pour chaque partie
        gamePromise = new Promise((resolve) => {
            gamePromises.push({ gameID, resolve });
        });
        gamePromises.push(gamePromise);
        
        i += 2;
    }
}

// Exemple de gestionnaire d'événements pour la fin des parties
gameEvents.on('gameOver', (gameID) => {
    console.log(`Game ${gameID} is over`);
    // Ajoutez votre logique pour gérer la fin des parties ici
});

gameEvents.on('playerJoined', (playerID) => {
    if (!playersID.includes(playerID)) {
        playersID.push(playerID);
        console.log('TABLEAU playersID', playersID);
        console.log('TABLEAU tabSize', tabSize);
    }
});


server.listen(3000, () => {
    console.log('WebSocket server is running on wss://localhost:3000');
});
