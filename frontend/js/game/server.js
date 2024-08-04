const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

let players = [];

wss.on('connection', (ws) => {
    console.log('Total connected clients:', wss.clients.size);
    if (players.length < 2) {
        players.push(ws);
        ws.send(JSON.stringify({ type: 'player', player: players.length }));

        ws.on('message', (message) => {
            players.forEach((player) => {
                if (player !== ws) {
                    player.send(message);
                }
            });
        });

        ws.on('close', () => {
            players = players.filter((player) => player !== ws);
        });
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Game is full' }));
        console.log(message);
        ws.close();
    }
});

console.log('WebSocket server is running on ws://localhost:3000');