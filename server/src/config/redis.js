import redis from "redis";
import RedisSMQ from "rsmq";

const host = process.env.REDIS_HOST_ADDRESS;
const port = process.env.REDIS_PORT;
const client = redis.createClient({ 
  ...(process.env.NODE_ENV === "production" && {
    password: process.env.REDIS_PASSWORD 
  }),
  host, 
  port 
});

client.on("connect", () => {
  console.log(`Redis connection ready at http://${host}:${port}`);
});

client.on("error", () => {
  console.log("Redis connection error: ", error);
});

export const redisSMQ = new RedisSMQ({ client, ns: "rsmq" });

export default redis;
