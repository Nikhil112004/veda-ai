"use client";
import BellIcon from "./icons/BellIcon";
import ArrowIcon from "./icons/ArrowIcon";
import AssignmentIcon from "./icons/AssignmentIcon";
import ChevronDown from "./icons/ChevronDown";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="h-[56px] sm:h-[64px] flex items-center justify-between px-[12px] sm:px-6 rounded-2xl bg-white border border-gray-200">
      <div className="flex items-center gap-[8px] sm:gap-3">
        <div
          onClick={() => router.back()}
          className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full bg-[#F5F5F5] flex items-center justify-center"
        >
          <ArrowIcon />
        </div>
        <h4 className="text-[14px] sm:text-[16px] font-semibold text-[#303030]">
          Assignments
        </h4>
      </div>
      <div className="flex items-center gap-[8px] sm:gap-4">
        <div className="w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] rounded-full flex items-center justify-center bg-[#F6F6F6]">
          <BellIcon />
        </div>
        <div className="flex items-center gap-[6px] sm:gap-2 px-[8px] sm:px-3 py-[4px] rounded-[10px] sm:rounded-[12px] bg-white shadow-sm">
          <img
            src="/icons/profile.svg"
            className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full object-cover"
          />

          <div className="hidden sm:flex items-center">
            <h1 className="text-[14px] sm:text-[16px] font-semibold text-[#303030]">
              Nikhil
            </h1>
            <ChevronDown className="w-4 h-4 ml-[4px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
