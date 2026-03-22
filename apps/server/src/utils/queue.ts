import { Queue } from "bullmq";

export const assignmentQueue = new Queue("assignments", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});
