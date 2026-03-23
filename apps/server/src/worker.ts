import { Worker } from "bullmq";
import express from "express";
import { generatePaper } from "./utils/gemini";
import { Assignment } from "./models/Assignment";

// 🔥 Worker
new Worker(
  "assignments",
  async (job) => {
    try {
      console.log("🚀 Processing job:", job.id);

      const { assignmentId, ...payload } = job.data;

      // 🔥 AI call
      const result = await generatePaper(payload);

      // ✅ DB update
      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "completed",
        result,
      });

      console.log("✅ Completed:", assignmentId);
    } catch (err) {
      console.log("❌ Worker error:", err);

      await Assignment.findByIdAndUpdate(job.data.assignmentId, {
        status: "failed",
      });
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

// 🔥 Dummy server (keep alive)
const app = express();

app.get("/", (req, res) => {
  res.send("Worker running...");
});

app.listen(5001, () => {
  console.log("🔥 Worker server running on port 5001");
});