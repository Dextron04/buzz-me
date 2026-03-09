const express = require('express');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'buzzme-server', timestamp: new Date().toISOString() });
});

server.listen(PORT, () => {
    console.log(`🚀 BuzzMe server running on port ${PORT}`);
});

module.exports = { app, server };
