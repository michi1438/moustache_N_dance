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

const wss = new WebSocket.Server({ server });

let players = [];
let gameID = 0;
let playerConfigs = [];
// let playerNumber = 1;

wss.on('connection', (ws) => {
    console.log('Total connected clients:', wss.clients.size);
    if (players.length < 50) {
        players.push(ws);

        ws.on('message', (message) => {
            const data = JSON.parse(message);
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
            else if (data.type === 'tournoi') {
                tournamentLogic(data);
            }
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
        ws.send(JSON.stringify({ type: 'error', message: 'Game is full' }));
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

function tournamentLogic(data) {
    //crée un tableau de playersID de la taille de data.config[0]
    let playersID = new Array(data.config[0]);
    //ajouter le playerID dans le tableau contenu dans data.playerID
    playersID.push(data.playerID);
    //si le tableau est égale à data.config[0] lance les parties entre playersID[0] et playersID[1] jusqu'à la fin du tableau
    if (playersID.length == data.config[0]) {
        for (let i = 0; i < playersID.length; i++) {
            for (let j = 0; j < playersID.length; j++) {
                if (i != j) {
                    gameID = uuidv4();
                    players[playersID[i]].gameID = gameID;
                    players[playersID[j]].gameID = gameID;
                    players[playersID[i]].send(JSON.stringify({ type: 'start', gameID: gameID, playerNumber: 1, config: playerConfigs[playersID[i]]}));
                    players[playersID[j]].send(JSON.stringify({ type: 'start', gameID: gameID, playerNumber: 2, config: playerConfigs[playersID[j]]}));
                    playerConfigs[playersID[i]] = null;
                    playerConfigs[playersID[j]] = null;
                }
            }
        }
    }
    //vide le tableau playersID, divise sa taille par 2 et ajoute le playerID des winners dans le tableau
    playersID = [];
    playersID.length = data.config[0] / 2;
    for (let i = 0; i < data.winners.length; i++) {
        playersID.push(data.winners[i]);
    }
    //si le tableau est égale à 1, le playerID est le winner
    if (playersID.length == 1) {
        data.winner = playersID[0];
    }
    //si le tableau est supérieur à 1, relance la fonction tournamentLogic
    else {
        tournamentLogic(data);
    }

}

server.listen(3000, () => {
    console.log('WebSocket server is running on wss://localhost:3000');
});
