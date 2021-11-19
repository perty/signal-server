'use strict';

const express = require('express');
const cors = require('cors');
const {Server} = require("socket.io");

const PORT = process.env.PORT || 3000;
const indexHtml = '/index.html';

const app = express()
    .use(cors({origin: '*'}))
    .use((req, res) => res.sendFile(indexHtml, {root: __dirname}))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = new Server(app, {cors: {origin: '*'}});

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
