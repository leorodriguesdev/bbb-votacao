const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const voteRoutes = require('./routes/voteRoutes');

const initializeWebSocket = require('./websocket');
const app = express();
const { wss, server } = initializeWebSocket(app);

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    req.wss = wss;
    next();
});
app.use(voteRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

mongoose.connect('mongodb://localhost:27017/bbbVoting', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to MongoDB!");
});

server.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
