import { Worker } from "bullmq";
import { generatePaper } from "./utils/gemini";
import "dotenv/config";
import { results } from "./store";
import IORedis from "ioredis";
import { Assignment } from "./models/Assignment";

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: {},
  maxRetriesPerRequest: null,
});

const redis = connection;

const worker = new Worker(
  "assignments",
  async (job) => {
    console.log("processing job:", job.id);

    const aiResponse = await generatePaper(job.data);
    console.log("AI RAW:", aiResponse);

    let parsed;

    try {
      const cleaned = aiResponse
        ?.replace(/```json/g, "")
        ?.replace(/```/g, "")
        ?.trim();

      const raw = JSON.parse(cleaned);

      parsed = {
        sections:
          raw.sections?.map((sec: any) => ({
            title: sec.title || "Section",
            instruction: sec.instruction || "Attempt all questions",
            questions:
              sec.questions?.map((q: any) => ({
                question: q.question || q.text || "Sample question",
                marks: q.marks || 5,
                difficulty: q.difficulty || "medium",
              })) || [],
          })) || [],
      };

      if (!parsed.sections.length) {
        throw new Error("Empty sections");
      }
    } catch (err) {
      console.log("❌ PARSE ERROR:", err);

      parsed = {
        sections: [
          {
            title: "Section A",
            instruction: "Attempt all questions",
            questions: [
              {
                question: "Sample question",
                marks: 5,
                difficulty: "medium",
              },
            ],
          },
        ],
      };
    }

    await redis.set(
      `job:${job.data.assignmentId}`,
      JSON.stringify(parsed),
    );

    await Assignment.findByIdAndUpdate(
      job.data.assignmentId,
      {
        status: "completed",
        result: parsed,
      },
      { returnDocument: "after" },
    );

    await redis.publish(
      "job-completed",
      JSON.stringify({
        jobId: job.data.assignmentId,
        data: parsed,
      }),
    );

    console.log("done:", job.id);
  },
  {
    connection,
  },
);

import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Worker running...");
});

app.listen(5001, () => {
  console.log("Worker dummy server running on 5001");
});

export { results };
