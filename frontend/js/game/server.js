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

wss.on('connection', (ws) => {
    console.log('Total connected clients:', wss.clients.size);
    if (players.length < 20) {
        players.push(ws);
        ws.send(JSON.stringify({ type: 'player', player: players.length, gameID }));

        ws.on('message', (message) => {
            let i = 0;
            let j = 1;
            const data = JSON.parse(message);
            if (data.type === 'config') {
                playerConfigs[players.indexOf(ws)] = data.config;
                console.log('Received configuration:', playerConfigs);
                console.log('nbr de configs:', playerConfigs.length);
                if (playerConfigs.length > 1) {
                    //broadcast(ws, { type: 'start', playerConfigs });
                    //comparer les objects pour voir si les configurations sont les mêmes
                    console.log('Ya au moins 2 configs:', playerConfigs);
                    while (i < playerConfigs.length) {
                        while (j < playerConfigs.length) {
                            if (JSON.stringify(playerConfigs[i]) === JSON.stringify(playerConfigs[j])) {
                                console.log('player0 and player1 configs:', i, j, playerConfigs[i], playerConfigs[j]);
                                broadcast(null, { type: 'start', config: playerConfigs[i] });
                                playerConfigs = [];
                            }
                            j++;
                        }
                        i++;
                    }
                }
            } else {
                broadcast(ws, data);
            }
        });

        ws.on('close', () => {
            broadcast(ws, { type: 'deco', player: players.indexOf(ws) });
            players = players.filter((player) => player !== ws);
        });

        //Vérifiez si le nombre de clients connectés est égal à 2
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