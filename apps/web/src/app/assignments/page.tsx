"use client";

import { Search, Filter, MoreVertical } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import PlusIcon from "@/components/icons/PlusIcon";
import { useAssignmentStore } from "@/store/useAssignmentStore";

export default function Assignments() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const router = useRouter();
  const { assignments, setAssignments } = useAssignmentStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      const res = await fetch("http://localhost:5000/assignments");
      const data = await res.json();
      setAssignments(data.data);
    };

    fetchAssignments();
  }, []);

  return (
    <div className="h-full bg-[#ECECEC] p-[16px] sm:p-[24px] lg:p-[32px]">
      <div className="mt-[8px] sm:mt-[12px] mb-[24px] sm:mb-[32px]">
        <div className="flex items-center gap-[10px] mb-[4px] sm:mb-[6px]">
          <div className="w-[8px] h-[8px] bg-[#4CAF50] rounded-full" />
          <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] font-semibold text-[#011625]">
            Assignments
          </h1>
        </div>
        <p className="text-[13px] sm:text-[14px] text-[#757575]">
          Manage and create assignments for your classes.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[16px] mb-[24px]">
        <button className="h-[48px] px-[16px] bg-white rounded-[12px] flex items-center gap-[8px] text-[#757575] hover:bg-[#F5F5F5] transition-colors">
          <Filter className="w-[18px] h-[18px]" strokeWidth={1.5} />
          <span className="text-[14px]">Filter By</span>
        </button>

        <div className="flex-1 relative">
          <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#999999]" />
          <input
            type="text"
            placeholder="Search Assignment"
            className="w-full h-[48px] pl-[44px] pr-[16px] bg-white rounded-[12px] text-[14px] text-[#011625] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/20"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] sm:gap-[20px]">
        {assignments.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-[20px] p-[16px] sm:p-[20px] border border-[#EAEAEA] shadow-sm"
          >
            <div className="relative">
              <div className="flex justify-between items-start mb-[10px]">
                <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#303030]">
                  Assignment #{item._id.slice(-4)}
                </h3>

                <button
                  onClick={() =>
                    setActiveMenu(activeMenu === item._id ? null : item._id)
                  }
                  className="p-[6px] rounded-full hover:bg-[#F5F5F5]"
                >
                  <MoreVertical className="w-[18px] h-[18px] text-[#757575]" />
                </button>
              </div>

              {activeMenu === item._id && (
                <div
                  ref={menuRef}
                  className="absolute top-[36px] right-0 w-[160px] bg-white border border-[#E5E5E5] rounded-[10px] shadow-md z-50"
                >
                  <button
                    onClick={() => router.push(`/generated-paper/${item._id}`)}
                    className="w-full text-left px-[12px] py-[10px] text-[13px] hover:bg-[#F5F5F5]"
                  >
                    View Assignment
                  </button>

                  <button
                    onClick={async () => {
                      await fetch(
                        `http://localhost:5000/assignments/${item._id}`,
                        { method: "DELETE" },
                      );

                      setAssignments(
                        assignments.filter((a) => a._id !== item._id),
                      );
                    }}
                    className="w-full text-left px-[12px] py-[10px] text-[13px] text-red-500 hover:bg-[#FDECEC]"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-[4px] text-[13px] text-[#757575] mb-[12px]">
              <span>
                <span className="font-medium text-[#303030]">
                  Assigned on :
                </span>{" "}
                --
              </span>
              <span>
                <span className="font-medium text-[#303030]">Due :</span> --
              </span>
            </div>
            <div className="flex justify-between items-center mt-[8px]">
              <span
                className={`text-[11px] sm:text-[12px] px-[10px] py-[4px] rounded-full font-medium ${
                  item.status === "completed"
                    ? "bg-[#E8F5E9] text-[#2E7D32]"
                    : "bg-[#FFF3E0] text-[#EF6C00]"
                }`}
              >
                {item.status}
              </span>

              <button
                onClick={() => router.push(`/generated-paper/${item._id}`)}
                className="text-[13px] font-medium text-[#FF4D00] hover:underline whitespace-nowrap"
              >
                View Assignment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
