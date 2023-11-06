const Redis = require('ioredis');
const host = "127.0.0.1"
const port = 6379
const redis = new Redis({
    host: host, // Replace with your Redis server's host
    port: port
});

module.exports = redis;
