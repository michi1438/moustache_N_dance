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
let winners = [];
let playersID = [];
let tabSize;
let tournoiSize;
let configTournoi = {};
let gamePromises = [];
// let playerNumber = 1;

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
            }
            else if (data.type === 'winner') {
                const gameID = data.gameID;
            // Résoudre la promesse correspondante
            const gamePromise = gamePromises.find(p => p.gameID === gameID);
            if (gamePromise) {
                gamePromise.resolve();
                gamePromises = gamePromises.filter(p => p.gameID !== gameID);
            }
                
                playersID.push(data.winner);
            }
            else if (data.type === 'tournoi') {
                tournamentLogic(data, winners || []);
            }
            else if (data.type === 'Rejoindre') {
                tournamentLogic(data, winners || []);
            }
            else {
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

async function tournamentLogic(data, winners) {
    if (data.type === 'Rejoindre') {
        gameEvents.emit('playerJoined', data.playerID);
    } else if(data.type === 'tournoi'){
        tournoiSize = data.config['Taille du tournoi'];
        //tabSize = playersID.length;
        configTournoi = {
            'Vitesse du jeu': data.config['Vitesse du jeu'],
            'Map': data.config['Map']
        };

        console.log('premier element contenu dans config', data.config['Taille du tournoi']);
        if(tournoiSize != tabSize){
            //crée un tableau de playersID de la taille de data.config['Taille du tournoi']
            //ajouter le playerID (dans le premier element du tableau) contenu dans data.playerID 
            gameEvents.emit('playerJoined', data.playerID);
        }
    }
    tabSize = playersID.length;
    //si le tableau est égale à data.config['Taille du tournoi'] lance les parties entre playersID[0] et playersID[1] jusqu'à la fin du tableau
    if (tabSize == tournoiSize) {
        let i = 0;
        while(i < tabSize) {
            console.log('Lancement des games')
            gameID = uuidv4();
            players[[i]].gameID = gameID;
            players[[i+1]].gameID = gameID;
            players[[i]].send(JSON.stringify({ type: 'startT', gameID: gameID, playerNumber: 1, config: configTournoi}));
            players[[i+1]].send(JSON.stringify({ type: 'startT', gameID: gameID, playerNumber: 2, config: configTournoi}));

            // Créez une promesse pour chaque partie
            const gamePromise = new Promise((resolve) => {
                gamePromises.push({ gameID, resolve });
            });
            gamePromises.push(gamePromise);

            i += 2;
        }
        await Promise.all(gamePromises);
    }
    //playersID = [];
    console.log('playersID apres promise', playersID);    
    
    //vide le tableau playersID, divise sa taille par 2 et ajoute le playerID des winners dans le tableau
    if(playersID.length == tabSize / 2){
        console.log('salut');   
        tabSize = tabSize / 2;
    }
    //si le tableau est égale à 1, le playerID est le winner
    // if (playersID.length == 1) {
    //     winners[0] = playersID[0];
    // }
    //si le tableau est supérieur à 1, relance la fonction tournamentLogic
    else if (tabSize > 1 && tabSize == tournoiSize) {
        console.log('relance de la fonction');
        tournamentLogic(data, winners);
    }


}

server.listen(3000, () => {
    console.log('WebSocket server is running on wss://localhost:3000');
});




// Exemple de gestionnaire d'événements pour la fin des parties
gameEvents.on('gameOver', (gameID) => {
    console.log(`Game ${gameID} is over`);
    // Ajoutez votre logique pour gérer la fin des parties ici
});

gameEvents.on('playerJoined', (playerID) => {
    if (!playersID.includes(playerID)) {
        playersID.push(playerID);
        tabSize = playersID.length;
        console.log('TABLEAU playersID', playersID);
        console.log('TABLEAU tabSize', tabSize);
    }
});
