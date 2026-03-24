import { Worker } from "bullmq";
import express from "express";
import { connectDB } from "./db";
import { generatePaper } from "./utils/gemini";
import { Assignment } from "./models/Assignment";
import IORedis from "ioredis";

const pub = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: {},
});

connectDB();

new Worker(
  "assignments",
  async (job) => {
    try {
      console.log("🚀 Processing job:", job.id);

      const { assignmentId, ...payload } = job.data;

      const aiResponse = await generatePaper(payload);

      let result;


      if (
        typeof aiResponse === "object" &&
        aiResponse !== null &&
        "sections" in aiResponse
      ) {
        result = aiResponse;
      } else {
        console.log("⚠️ Invalid AI response → using fallback");

        result = {
          sections: [
            {
              title: "Section A",
              instruction: "Answer all questions",
              questions: [
                {
                  text: "Fallback question",
                  difficulty: "easy",
                  marks: 2,
                },
              ],
            },
          ],
        };
      }

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "completed",
        result: result,
      });


      await pub.publish(
        "job-completed",
        JSON.stringify({
          jobId: assignmentId,
          result: result,
        })
      );

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

// dummy server
const app = express();
app.get("/", (_, res) => res.send("Worker running"));
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Worker running on port ${PORT}`);
});