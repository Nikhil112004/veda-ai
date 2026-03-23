import { Queue } from "bullmq";

import IORedis from "ioredis";

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: {},
  maxRetriesPerRequest: null,
});


export const assignmentQueue = new Queue("assignments", {
  connection,
});
