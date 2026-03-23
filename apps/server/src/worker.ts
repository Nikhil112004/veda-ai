import { Worker } from "bullmq";
import express from "express";
import { connectDB } from "./db";
import { generatePaper } from "./utils/gemini";
import { Assignment } from "./models/Assignment";

connectDB(); // ✅ add this

new Worker(
  "assignments",
  async (job) => {
    try {
      console.log("🚀 Processing job:", job.id);

      const { assignmentId, ...payload } = job.data;

      const result = await generatePaper(payload);

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "completed",
        result,
      });

      console.log("✅ Completed:", assignmentId);
    } catch (err) {
      console.log("❌ Worker error:", err);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      tls: {},
    },
  }
);

// dummy server
const app = express();
app.get("/", (_, res) => res.send("Worker running"));
app.listen(5001);