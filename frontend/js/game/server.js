const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 3000 });

let players = [];
let gameID = uuidv4();

wss.on('connection', (ws) => {
    console.log('Total connected clients:', wss.clients.size);
    if (players.length < 2) {
        players.push(ws);
        ws.send(JSON.stringify({ type: 'player', player: players.length, gameID })); // Send gameID to client

        ws.on('message', (message) => {
            const data = JSON.parse(message);
            switch (data.type) {
                case 'join':
                    ws.gameID = data.gameID;
                    break;
                // Handle other message types
            }
        });

        ws.on('close', () => {
            players = players.filter((player) => player !== ws);
        });
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Game is full' }));
        ws.close();
    }
});

console.log('WebSocket server is running on ws://localhost:3000');