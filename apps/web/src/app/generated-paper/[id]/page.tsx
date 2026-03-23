"use client";

import { Download } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Question = {
  text?: string;
  question?: string;
  difficulty?: string;
  marks?: number;
};

type Section = {
  title: string;
  instruction?: string;
  questions: Question[];
};

type Paper = {
  sections: Section[];
};

export default function GeneratedPaper() {
  const params = useParams();
  const id = params?.id as string;

  const [paper, setPaper] = useState<Paper | null>(null);

  useEffect(() => {
    const fetchPaper = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}`);
      const data = await res.json();

      console.log("FRONT DATA:", data); // debug

      if (data?.data?.sections?.length > 0) {
        setPaper(data.data);
      } else {
        const stored = localStorage.getItem("paper");
        if (stored) {
          setPaper(JSON.parse(stored));
        }
      }
    };

    if (id) {
      fetchPaper();
    }
  }, [id]);

  const handleDownload = async () => {
    const element = document.getElementById("paper");
    if (!element) return;

    const cloned = element.cloneNode(true) as HTMLElement;

    cloned.style.background = "#ffffff";
    cloned.style.color = "#000000";

    const all = cloned.querySelectorAll("*");
    all.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.background = "#ffffff";
      htmlEl.style.color = "#000000";
      htmlEl.style.boxShadow = "none";
      htmlEl.style.filter = "none";
    });

    document.body.appendChild(cloned);

    const canvas = await html2canvas(cloned, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    document.body.removeChild(cloned);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("assignment.pdf");
  };

  return (
    <div className="min-h-screen bg-[#ECECEC]">
      <div className="max-w-[900px] mx-auto px-[16px] sm:px-[24px] lg:px-[32px] py-[20px] sm:py-[32px]">
        <div className="bg-[#2A2A2A] rounded-[16px] p-[20px] sm:p-[28px] mb-[20px] sm:mb-[32px] text-white">
          <p className="text-[14px] sm:text-[18px] leading-[22px] sm:leading-[28px] mb-[12px] sm:mb-[16px]">
            Your AI-generated question paper is ready.
          </p>

          <button
            onClick={handleDownload}
            className="h-[36px] sm:h-[40px] px-[16px] sm:px-[24px] bg-white text-[#2A2A2A] rounded-[8px] text-[13px] sm:text-[14px] font-medium flex items-center gap-[6px] sm:gap-[8px]"
          >
            <Download className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" />
            Download PDF
          </button>
        </div>

        <div
          id="paper"
          className="bg-white rounded-[16px] p-[20px] sm:p-[32px] lg:p-[48px] shadow"
        >
          <div className="text-center mb-[20px] sm:mb-[32px] pb-[16px] sm:pb-[24px] border-b">
            <h1 className="text-[18px] sm:text-[22px] lg:text-[24px] font-bold">
              Question Paper
            </h1>
          </div>

          <p className="text-[13px] sm:text-[14px] mb-[16px] sm:mb-[24px] text-center">
            All questions are compulsory unless stated otherwise.
          </p>

          <div className="mb-[20px] sm:mb-[32px] space-y-[8px] sm:space-y-[10px] text-[13px] sm:text-[14px]">
            <div className="flex gap-[6px] sm:gap-[8px]">
              <span className="font-medium">Name:</span>
              <div className="flex-1 border-b" />
            </div>

            <div className="flex gap-[6px] sm:gap-[8px]">
              <span className="font-medium">Roll Number:</span>
              <div className="flex-1 border-b" />
            </div>

            <div className="flex flex-wrap gap-[6px] sm:gap-[8px]">
              <span className="font-medium">Class:</span>
              <div className="flex-1 border-b min-w-[100px]" />

              <span className="font-medium ml-2 sm:ml-4">Section:</span>
              <div className="flex-1 border-b min-w-[100px]" />
            </div>
          </div>

          {paper?.sections?.map((section, sIndex) => (
            <div key={sIndex} className="mb-[24px] sm:mb-[32px]">
              <h2 className="text-[15px] sm:text-[17px] lg:text-[18px] font-semibold text-center mb-[8px] sm:mb-[12px]">
                {section.title}
              </h2>

              {section.instruction && (
                <p className="text-[12px] sm:text-[13px] italic text-gray-500 mb-[12px] sm:mb-[16px] text-center">
                  {section.instruction}
                </p>
              )}

              <div className="space-y-[12px] sm:space-y-[16px]">
                {section.questions?.map((q, qIndex) => (
                  <div key={qIndex} className="flex gap-[8px] sm:gap-[12px]">
                    <span className="font-medium text-[13px] sm:text-[14px]">
                      {qIndex + 1}.
                    </span>

                    <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-[4px] sm:gap-[8px]">
                      <span className="text-[13px] sm:text-[14px] leading-[20px]">
                        {q.text || q.question || "No question provided."}
                      </span>

                      <div className="flex items-center gap-[6px] sm:gap-[8px] sm:justify-end">
                        {q.difficulty && (
                          <span
                            className={`text-[10px] sm:text-[11px] px-[6px] py-[2px] rounded-full font-medium ${
                              q.difficulty === "easy"
                                ? "bg-green-100 text-green-700"
                                : q.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        )}

                        {q.marks && (
                          <span className="text-[11px] sm:text-[12px] font-semibold whitespace-nowrap">
                            {q.marks} Marks
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center border-t pt-[12px] sm:pt-[16px]">
            <p className="text-[13px] sm:text-[14px] font-semibold">
              End of Question Paper
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
