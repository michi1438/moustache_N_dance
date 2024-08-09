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

wss.on('connection', (ws) => {
    console.log('Total connected clients:', wss.clients.size);
    if (players.length < 2) {
        players.push(ws);
        ws.send(JSON.stringify({ type: 'player', player: players.length, gameID }));

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

server.listen(3000, () => {
    console.log('WebSocket server is running on wss://localhost:3000');
});