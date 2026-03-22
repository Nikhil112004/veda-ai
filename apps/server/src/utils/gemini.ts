

import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

dotenv.config();


const questionSchema = z.object({
  text: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  marks: z.number(),
});

const sectionSchema = z.object({
  title: z.string(),
  instruction: z.string(),
  questions: z.array(questionSchema),
});

const paperSchema = z.object({
  sections: z.array(sectionSchema),
});



export async function generatePaper(data: any) {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
Generate a question paper.

- File: ${data.fileName}
- Questions: ${data.numberOfQuestions}
- Marks: ${data.marks}
- Types: ${data.questionTypes}
- Instructions: ${data.instructions}
`;

    let json;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: zodToJsonSchema(paperSchema as any),
        },
      });

      const text = (response as any).text || "{}";
      json = JSON.parse(text);

      const parsed = paperSchema.parse(json);

      return JSON.stringify(parsed);
    } catch (err) {
      console.log("⚠️ Gemini failed → using fallback");

      return JSON.stringify({
  sections: [
    {
      title: "Section A",
      instruction: "Attempt all questions",
      questions: [
        {
          text: "What is Artificial Intelligence?",
          difficulty: "easy",
          marks: 2,
        },
        {
          text: "Define Machine Learning.",
          difficulty: "easy",
          marks: 2,
        },
        {
          text: "What is the difference between AI and ML?",
          difficulty: "medium",
          marks: 4,
        },
        {
          text: "Explain supervised learning with example.",
          difficulty: "medium",
          marks: 5,
        },
        {
          text: "What is Deep Learning?",
          difficulty: "hard",
          marks: 6,
        },
      ],
    },
    {
      title: "Section B",
      instruction: "Answer briefly",
      questions: [
        {
          text: "What is Data Science?",
          difficulty: "easy",
          marks: 3,
        },
        {
          text: "Explain the role of data in AI.",
          difficulty: "medium",
          marks: 4,
        },
        {
          text: "What are neural networks?",
          difficulty: "medium",
          marks: 5,
        },
        {
          text: "Explain overfitting in machine learning.",
          difficulty: "hard",
          marks: 6,
        },
      ],
    },
    {
      title: "Section C",
      instruction: "Long answer questions",
      questions: [
        {
          text: "Explain the complete lifecycle of a Machine Learning model.",
          difficulty: "hard",
          marks: 10,
        },
        {
          text: "Discuss applications of AI in real-world scenarios.",
          difficulty: "medium",
          marks: 8,
        },
      ],
    },
  ],
});
    }
  } catch (err) {
    console.log("❌ Gemini Error:", err);

    return JSON.stringify({
      sections: [
        {
          title: "Section A",
          instruction: "Attempt all questions",
          questions: [
            {
              text: "Fallback question",
              difficulty: "medium",
              marks: 5,
            },
          ],
        },
      ],
    });
  }
}
