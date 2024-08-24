const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

// Charger les certificats SSL
const server = https.createServer({
    cert: fs.readFileSync('/etc/nginx/ssl/inception.crt'),
    key: fs.readFileSync('/etc/nginx/ssl/inception.key')
});

const wss = new WebSocket.Server({ server });

let players = [];
let gameID = uuidv4();
let playerConfigs = [];
let processedConfigs = []; // Liste des configurations déjà traitées

wss.on('connection', (ws) => {
    console.log('Total connected clients:', wss.clients.size);
    if (players.length < 20) {
        players.push(ws);
        ws.send(JSON.stringify({ type: 'player', player: players.length, gameID }));

        ws.on('message', (message) => {
            const data = JSON.parse(message);
            if (data.type === 'config') {
                const playerIndex = players.indexOf(ws);
                playerConfigs[playerIndex] = data.config;
                ws.config = data.config;

                console.log('Received configuration:', playerConfigs);
                console.log('Nbr de configs:', playerConfigs.filter(config => config).length);

                // Vérifiez si cette configuration a déjà été traitée
                if (processedConfigs.includes(JSON.stringify(data.config))) {
                    return; // Ne rien faire si cette configuration a déjà été traitée
                }

                // Chercher des configurations correspondantes
                const matchingPlayers = [];
                playerConfigs.forEach((config, index) => {
                    if (config && JSON.stringify(config) === JSON.stringify(data.config)) {
                        matchingPlayers.push(index);
                    }
                });

                if (matchingPlayers.length > 1) {
                    //players[playerIndex].send(JSON.stringify({ type: 'player', playerNumber: 2 }));
                    const startMessage = JSON.stringify({ type: 'start', config: data.config });

                    wss.clients.forEach(client => {
                        if (
                            client.readyState === WebSocket.OPEN &&
                            JSON.stringify(client.config) === JSON.stringify(data.config)
                        ) {
                            client.send(startMessage);
                        }
                    });

                    // Marquer cette configuration comme traitée
                    processedConfigs.push(JSON.stringify(data.config));
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
        if (wss.clients.size === 2) {
            const message = JSON.stringify({ type: 'clientCount', count: wss.clients.size });
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Game is full' }));
        ws.close();
    }
});

function broadcast(sender, message) {
    const data = JSON.stringify(message);
    wss.clients.forEach(client => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

server.listen(3000, () => {
    console.log('WebSocket server is running on wss://localhost:3000');
});
