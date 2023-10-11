const WebSocket = require('ws');
const http = require('http');

function initializeWebSocket(app) {
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');
        ws.send(JSON.stringify({ participante: "participanteA" }));
    });

    return { wss, server };
}

module.exports = initializeWebSocket;
