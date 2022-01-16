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

const workspaces = io.of(/^\/[0-9]{7}$/);

workspaces.on('connection', (socket) => {
    const workspace = socket.nsp;
    console.log('Client connected to workspace ', workspace.name);
    socket.broadcast.emit('signal', 'client connected ' + socket.id);
    socket.on('signal', function (data) {
        console.log('Broadcasting signal "', data, '" in workspace', workspace.name);
        socket.broadcast.emit('signal', data);  // Echo to all but the sender.
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        socket.broadcast.emit('signal', 'client disconnected')
    });

    setInterval(() => socket.emit('time', new Date().toTimeString()), 1000);

});

