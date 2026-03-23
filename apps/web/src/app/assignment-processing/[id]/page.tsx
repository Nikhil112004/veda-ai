"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";

export default function AssignmentProcessing() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!id) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL!);

    socket.on("job-completed", (data) => {
      console.log("SOCKET:", data);

      if (data.jobId === id) {
        setProgress(100);

        localStorage.setItem(
          "paper",
          JSON.stringify(data.result || data.data?.result),
        );

        setTimeout(() => {
          router.push(`/generated-paper/${id}`);
        }, 500);
      }
    });
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 500);

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}`,
        );
        const data = await res.json();

        console.log("status:", data);

        if (data.status === "completed") {
          clearInterval(interval);
          clearInterval(progressInterval);

          setProgress(100);

          localStorage.setItem(
            "paper",
            JSON.stringify(data.result || data.data?.result),
          );

          setTimeout(() => {
            router.push(`/generated-paper/${id}`);
          }, 500);
        }
      } catch (err) {
        console.log("fetch error:", err);
      }
    }, 2000);
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
      socket.disconnect();
    };
  }, [id, router]);

  return (
    <div className="min-h-screen bg-[#ECECEC] flex items-center justify-center px-4 sm:px-6">
      <div className="text-center w-full max-w-[500px]">
        <div className="mb-[32px]">
          <div className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] mx-auto mb-[20px] sm:mb-[24px] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00] to-[#FF4D00] rounded-full animate-pulse opacity-20" />
            <div className="absolute inset-[6px] sm:inset-[10px] bg-white rounded-full flex items-center justify-center">
              <svg width="40" height="40" className="sm:w-[60px] sm:h-[60px]">
                <g className="animate-spin origin-center">
                  <path
                    d="..."
                    stroke="#FF4D00"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="animate-spin origin-center"
                  />
                </g>
              </svg>
            </div>
          </div>

          <h2 className="text-[20px] sm:text-[28px] font-semibold text-[#011625] mb-[8px] sm:mb-[12px]">
            Generating Your Assignment
          </h2>
          <p className="text-[14px] sm:text-[16px] text-[#757575] mb-[24px] sm:mb-[32px] leading-[22px] sm:leading-[24px]">
            Our AI is creating a customized question paper based on your
            specifications. This usually takes 30-60 seconds.
          </p>

          <div className="w-full mb-[10px] sm:mb-[12px]">
            <div className="w-full h-[8px] bg-white rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FF4D00] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="text-[14px] font-medium text-[#757575]">
            {progress}% Complete
          </p>
        </div>

        <div className="bg-white rounded-[16px] p-[16px] sm:p-[24px] shadow">
          <div className="space-y-[16px] text-left">
            <ProcessingStep
              label="Analyzing question types"
              isComplete={progress > 20}
              isActive={progress <= 20}
            />
            <ProcessingStep
              label="Generating questions"
              isComplete={progress > 50}
              isActive={progress > 20 && progress <= 50}
            />
            <ProcessingStep
              label="Creating answer key"
              isComplete={progress > 70}
              isActive={progress > 50 && progress <= 70}
            />
            <ProcessingStep
              label="Formatting document"
              isComplete={progress > 90}
              isActive={progress > 70 && progress <= 90}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type ProcessingStepProps = {
  label: string;
  isComplete: boolean;
  isActive: boolean;
};

function ProcessingStep({ label, isComplete, isActive }: ProcessingStepProps) {
  return (
    <div className="flex items-center gap-[12px]">
      <div
        className={`w-[20px] h-[20px] rounded-full flex items-center justify-center flex-shrink-0 ${
          isComplete
            ? "bg-[#4CAF50]"
            : isActive
              ? "bg-[#FF4D00] animate-pulse"
              : "bg-[#E5E5E5]"
        }`}
      >
        {isComplete && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <span
        className={`text-[13px] sm:text-[14px] ${
          isComplete || isActive
            ? "text-[#011625] font-medium"
            : "text-[#999999]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
