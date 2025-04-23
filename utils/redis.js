// utils/redis.js
const redis = require("redis");

const redisClient = redis.createClient();

redisClient.on("connect", () => {
  console.log("Redis connected burr");
});

redisClient.on("error", (err) => {
  console.log("Redis connection error", err);
});

// Attempt to connect
redisClient
  .connect()
  .catch((err) => console.error("Error during initial Redis connection:", err));

module.exports = { redisClient };
