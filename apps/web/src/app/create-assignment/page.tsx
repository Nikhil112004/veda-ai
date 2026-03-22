"use client";

import { useState } from "react";
import {
  Upload,
  Calendar,
  ChevronDown,
  X,
  Plus,
  Minus,
  Mic,
} from "lucide-react";
import { useRouter } from "next/navigation";

type QuestionType = {
  id: string;
  type: string;
  numQuestions: number;
  marks: number;
};

export default function CreateAssignment() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([
    { id: "1", type: "Multiple Choice Questions", numQuestions: 4, marks: 1 },
    { id: "2", type: "Short Questions", numQuestions: 3, marks: 2 },
    {
      id: "3",
      type: "Diagram/Graph-Based Questions",
      numQuestions: 5,
      marks: 5,
    },
    { id: "4", type: "Numerical Problems", numQuestions: 5, marks: 5 },
  ]);

  const totalQuestions = questionTypes.reduce(
    (sum, qt) => sum + qt.numQuestions,
    0,
  );
  const totalMarks = questionTypes.reduce(
    (sum, qt) => sum + qt.numQuestions * qt.marks,
    0,
  );

  const updateQuestionType = (
    id: string,
    field: "numQuestions" | "marks",
    value: number,
  ) => {
    setQuestionTypes(
      questionTypes.map((qt) =>
        qt.id === id ? { ...qt, [field]: Math.max(0, value) } : qt,
      ),
    );
  };

  const removeQuestionType = (id: string) => {
    setQuestionTypes(questionTypes.filter((qt) => qt.id !== id));
  };

  const addQuestionType = () => {
    setQuestionTypes([
      ...questionTypes,
      {
        id: Date.now().toString(),
        type: "New Question Type",
        numQuestions: 1,
        marks: 1,
      },
    ]);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("file", file!);

      formData.append("questionTypes", JSON.stringify(questionTypes));
      formData.append("totalQuestions", String(totalQuestions));
      formData.append("totalMarks", String(totalMarks));

      formData.append("instructions", "Generate full paper");
      formData.append("questionType", "Mixed");
      formData.append("numberOfQuestions", String(totalQuestions));
      formData.append("marks", String(totalMarks));

      const res = await fetch("http://localhost:5000/assignments", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("response:", data);
      router.push(`/assignment-processing/${data.assignmentId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full bg-[#ECECEC] overflow-auto">
      <div className="max-w-[1200px] mx-auto px-[16px] sm:px-[24px] lg:px-[32px] py-[20px] sm:py-[32px]">

        <div className="mb-[32px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <div className="w-[8px] h-[8px] bg-[#4CAF50] rounded-full" />
            <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] font-semibold text-[#011625]">
              Create Assignment
            </h1>
          </div>
          <p className="text-[13px] sm:text-[14px] text-[#757575]">
            Set up a new assignment for your students
          </p>
        </div>


        <div className="mb-[32px]">
          <div className="h-[4px] bg-white rounded-full overflow-hidden">
            <div className="h-full w-[50%] bg-[#2A2A2A]" />
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-[16px] sm:p-[24px] lg:p-[32px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
          <h2 className="text-[20px] font-semibold text-[#011625] mb-[8px]">
            Assignment Details
          </h2>
          <p className="text-[14px] text-[#757575] mb-[32px]">
            Basic information about your assignment
          </p>

   
          <div className="mb-[24px]">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              id="fileUpload"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) {
                  setFile(selected);
                  console.log("Selected file:", selected);
                }
              }}
            />
            <div className="border-2 border-dashed border-[#D5D5D5] rounded-[12px] p-[24px] sm:p-[48px] text-center bg-[#FAFAFA] hover:border-[#FF4D00] hover:bg-[#FFF9F5] transition-colors cursor-pointer">
              <Upload className="w-[32px] h-[32px] text-[#757575] mx-auto mb-[16px]" />
              <p className="text-[14px] text-[#011625] mb-[4px]">
                Choose a file or drag & drop it here
              </p>
              <p className="text-[12px] text-[#999999] mb-[16px]">
                JPEG, PNG, upto 10MB
              </p>
              <label
                htmlFor="fileUpload"
                className="h-[40px] px-[24px] bg-white border border-[#D5D5D5] rounded-[8px] text-[14px] text-[#011625] hover:bg-[#F5F5F5] transition-colors cursor-pointer flex items-center justify-center"
              >
                Browse Files
              </label>
            </div>
            <p className="text-[12px] text-[#999999] mt-[8px] text-center">
              Upload images of your preferred document/image
            </p>
          </div>

        
          <div className="mb-[32px]">
            <label className="block text-[14px] font-medium text-[#011625] mb-[8px]">
              Due Date
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Choose a chapter"
                className="w-full h-[48px] px-[16px] bg-white border border-[#D5D5D5] rounded-[8px] text-[14px] text-[#011625] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-opacity-20"
              />
              <Calendar className="absolute right-[16px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#757575]" />
            </div>
          </div>

          <div className="mb-[24px]">
            <div className="flex items-center justify-between mb-[16px]">
              <label className="text-[14px] font-medium text-[#011625]">
                Question Type
              </label>
              <div className="hidden sm:flex gap-[32px]">
                <span className="text-[14px] font-medium text-[#011625]  pr-[42px]">
                  No. of Questions
                </span>
                <span className="text-[14px] font-medium text-[#011625]  pr-[12px]">
                  Marks
                </span>
              </div>
            </div>

            <div className="space-y-[12px]">
              {questionTypes.map((qt) => (
                <div key={qt.id} className="flex items-center gap-[8px] w-full">
          
                  <div className="flex items-center justify-between px-[12px] h-[44px] w-full sm:min-w-[180px] border border-[#E5E5E5] rounded-[10px] bg-white">
                    <span className="text-[13px] sm:text-[14px] text-[#303030] truncate">
                      {qt.type}
                    </span>

                    <ChevronDown className="w-[16px] h-[16px] text-[#757575] ml-[6px]" />
                  </div>

                 
                  <button
                    onClick={() => removeQuestionType(qt.id)}
                    className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-[#F5F5F5]"
                  >
                    <X className="w-[16px] h-[16px] text-[#757575]" />
                  </button>


                  <div className="flex-1 flex min-w-[120px] items-center justify-between px-[12px] h-[44px] border border-[#E5E5E5] rounded-[10px]">
                    <button
                      onClick={() =>
                        updateQuestionType(
                          qt.id,
                          "numQuestions",
                          qt.numQuestions - 1,
                        )
                      }
                    >
                      <Minus className="w-[14px]" />
                    </button>

                    <span className="text-[14px] font-medium">
                      {qt.numQuestions}
                    </span>

                    <button
                      onClick={() =>
                        updateQuestionType(
                          qt.id,
                          "numQuestions",
                          qt.numQuestions + 1,
                        )
                      }
                    >
                      <Plus className="w-[14px]" />
                    </button>
                  </div>


                  <div className="flex-1 flex min-w-[120px] items-center justify-between px-[12px] h-[44px] border border-[#E5E5E5] rounded-[10px]">
                    <button
                      onClick={() =>
                        updateQuestionType(qt.id, "marks", qt.marks - 1)
                      }
                    >
                      <Minus className="w-[14px]" />
                    </button>

                    <span className="text-[14px] font-medium">{qt.marks}</span>

                    <button
                      onClick={() =>
                        updateQuestionType(qt.id, "marks", qt.marks + 1)
                      }
                    >
                      <Plus className="w-[14px]" />
                    </button>
                  </div>
                </div>
              ))}

  

              <button
                onClick={addQuestionType}
                className="flex items-center gap-[6px] text-[13px] sm:text-[14px] font-medium text-white bg-[#2A2A2A] rounded-full px-[14px] sm:px-[16px] h-[40px] sm:h-[48px]"
              >
                <Plus className="w-[16px] h-[16px]" />
                <span>Add Question Type</span>
              </button>
            </div>

    
            <div className="flex flex-col sm:flex-row sm:justify-end gap-[8px] sm:gap-[24px] mt-[16px] text-[14px]">
              <div>
                <span className="font-medium text-[#757575]">
                  Total Questions:{" "}
                </span>
                <span className="font-semibold text-[#011625]">
                  {totalQuestions}
                </span>
              </div>
              <div>
                <span className="font-medium text-[#757575]">
                  Total Marks:{" "}
                </span>
                <span className="font-semibold text-[#011625]">
                  {totalMarks}
                </span>
              </div>
            </div>
          </div>


          <div className="mb-[32px]">
            <label className="block text-[14px] font-medium text-[#011625] mb-[8px]">
              Additional Information (For better output)
            </label>
            <div className="relative">
              <textarea
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                className="w-full h-[120px] px-[16px] py-[12px] bg-white border border-[#D5D5D5] rounded-[8px] text-[14px] text-[#011625] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-opacity-20 resize-none"
              />
              <button className="absolute bottom-[12px] right-[12px] w-[32px] h-[32px] rounded-[8px] hover:bg-[#F5F5F5] flex items-center justify-center transition-colors">
                <Mic className="w-[18px] h-[18px] text-[#757575]" />
              </button>
            </div>
          </div>
          <div className="mt-[24px] flex gap-[12px]">
            <button
              onClick={() => router.push("/assignments")}
              className="flex-1 h-[48px] rounded-full bg-white border border-[#E5E5E5] text-[14px] font-medium text-[#303030] flex items-center justify-center gap-[8px] shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Previous
            </button>

            <button
              onClick={handleSubmit}
              className="flex-1 h-[48px] rounded-full bg-[#2A2A2A] text-white text-[14px] font-medium flex items-center justify-center gap-[8px] shadow-md"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
