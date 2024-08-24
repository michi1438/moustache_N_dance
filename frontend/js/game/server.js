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
                ws.config = data.config;
                console.log('Received configuration:', playerConfigs);
                console.log('nbr de configs:', playerConfigs.length);
                if (playerConfigs.length > 1) {
                    //broadcast(ws, { type: 'start', playerConfigs });
                    //comparer les objects pour voir si les configurations sont les mêmes
                    console.log('Ya au moins 2 configs:', playerConfigs);
                    for (let i = 0; i < playerConfigs.length - 1; i++) {
                        for (let j = i + 1; j < playerConfigs.length; j++) {
                            if (JSON.stringify(playerConfigs[i]) === JSON.stringify(playerConfigs[j])) {
                                console.log('player0 and player1 configs:', i, j, playerConfigs[i], playerConfigs[j]);
                                const message = JSON.stringify({ type: 'start', config: playerConfigs[i] });
                                wss.clients.forEach(client => {
                                    if (client.readyState === WebSocket.OPEN && JSON.stringify(client.config) === JSON.stringify(playerConfigs[i])){
                                        client.send(message);
                                    }
                                });
                                // Peut-être ne pas réinitialiser tout le tableau, mais plutôt marquer ces configurations comme traitées.
                                playerConfigs.splice(j, 1);
                                playerConfigs.splice(i, 1);
                                i--; // Reculer `i` car nous venons de supprimer un élément
                                break;
                            }
                        }
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