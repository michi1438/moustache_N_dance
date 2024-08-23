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
    if (players.length < 2) {
        players.push(ws);
        ws.send(JSON.stringify({ type: 'player', player: players.length, gameID }));

        ws.on('message', (message) => {
            const data = JSON.parse(message);
            if (data.type === 'config') {
                playerConfigs[players.indexOf(ws)] = data.config;
                console.log('Received configuration:', playerConfigs);
                console.log('nbr de configs:', playerConfigs.length);
                if (playerConfigs.length === 2 && playerConfigs[0] && playerConfigs[1]) {
                    //broadcast(ws, { type: 'start', playerConfigs });
                    //comparer les objects pour voir si les configurations sont les mêmes
                    console.log('Ya 2 configs:', playerConfigs);
                    if (JSON.stringify(playerConfigs[0]) === JSON.stringify(playerConfigs[1])) {
                        console.log('player0 and player1 configs:', playerConfigs[0], playerConfigs[1]);
                        broadcast(null, { type: 'start', config: playerConfigs[0] });
                        playerConfigs = [];
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