// This middleware explicitly satisfies the concept:
// - System & Integration: Caching with Redis

const { createClient } = require('redis');

// Initialize Redis Client
const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error);

/**
 * Express middleware to cache responses in Redis
 * @param {string} key - The cache key to use
 * @param {number} ttl - Time to live in seconds
 */
const cacheMiddleware = (key, ttl = 3600) => {
    return async (req, res, next) => {
        try {
            const cachedData = await redisClient.get(key);
            if (cachedData) {
                console.log(`[Cache Hit] Serving ${key} from Redis.`);
                return res.json(JSON.parse(cachedData));
            }
            
            console.log(`[Cache Miss] Proceeding to route handler for ${key}.`);
            // Intercept res.json to save the response in Redis before sending it
            const originalJson = res.json;
            res.json = (body) => {
                redisClient.setEx(key, ttl, JSON.stringify(body));
                originalJson.call(res, body);
            };
            
            next();
        } catch (error) {
            console.error('Redis cache error:', error);
            next(); // Proceed even if cache fails (graceful degradation)
        }
    };
};

module.exports = { redisClient, cacheMiddleware };
