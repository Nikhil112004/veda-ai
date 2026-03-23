import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generatePaper } from "./utils/gemini";
import { assignmentQueue } from "./utils/queue";
import { results } from "./store";
import { createServer } from "http";
import { initSocket } from "./socket";
import { getIO } from "./socket";
import IORedis from "ioredis";
import multer from "multer";
import { connectDB } from "./db";
import { Assignment } from "./models/Assignment";

const upload = multer({ dest: "uploads/" });

dotenv.config({ override: true });

connectDB();

const connection = new IORedis({
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASSWORD!,
  tls: {},
  maxRetriesPerRequest: null,
}) as any;

const redis = connection;
const sub = connection.duplicate();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());

app.post("/assignments", upload.single("file"), async (req, res) => {
  try {
    const assignment = await Assignment.create({
      ...req.body,
      status: "processing",
    });

    const job = await assignmentQueue.add("generate-paper", {
      ...req.body,
      assignmentId: assignment._id,
    });
    console.log("file:", req.file);
    console.log("body:", req.body);
    res.json({
      status: "processing",
      jobId: job.id,
      assignmentId: assignment._id,
    });
  } catch (err) {
    console.log("queue error:", err);

    res.status(500).json({
      status: "error",
      message: "failed to create job",
    });
  }
});

app.get("/assignments/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ status: "not_found" });
    }

    if (assignment.status !== "completed") {
      return res.json({
        status: assignment.status,
        result: assignment.result,
      });
    }

    return res.json({
      status: "completed",
      result: assignment.result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error" });
  }
});
app.delete("/assignments/:id", async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id);
  res.json({ status: "deleted" });
});
const httpServer = createServer(app);

initSocket(httpServer);

sub.subscribe("job-completed");

sub.on("message", (channel: string, message: string) => {
  if (channel === "job-completed") {
    const data = JSON.parse(message);

    const io = getIO();
    io.emit("job-completed", data);
  }
});

app.get("/assignments", async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });

    res.json({
      status: "success",
      data: assignments,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error" });
  }
});

httpServer.listen(5000, () => {
  console.log("Server running on port 5000");
});
