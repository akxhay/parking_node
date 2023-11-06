const Redis = require('ioredis');
const {expect} = require('chai');

const redis = require("../src/config/Redis")

describe('Redis Configuration', () => {
    it('should connect to the Redis server', async () => {
        try {
            await redis.ping();
            expect(true).to.be.true;
        } catch (error) {
            expect.fail('Failed to connect to Redis server');
        } finally {
            redis.quit();
        }
    });
});
