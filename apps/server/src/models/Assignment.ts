import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema({
  text: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  marks: { type: Number, required: true },
});

const sectionSchema = new Schema({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [questionSchema],
});

const assignmentSchema = new Schema(
  {
    status: {
      type: String,
      default: "processing",
    },

    questionTypes: {
      type: Array,
      default: [],
    },

    totalQuestions: Number,
    totalMarks: Number,
    instructions: String,
    result: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true },
);

export const Assignment =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
