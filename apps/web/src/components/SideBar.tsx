"use client"

import HomeIcon from "@/components/icons/HomeIcon";
import SettingIcon from "@/components/icons/SettingIcon";
import MyGroupIcon from "@/components/icons/MyGroupIcon";
import AssignmentIcon from "@/components/icons/AssignmentIcon";
import AiIcon from "@/components/icons/AiIcon";

import LibIcon from "@/components/icons/LibIcon";
import Button from "./Button";
import { useRouter } from "next/navigation";

export default function SideBar() {
    const router = useRouter();
  return (  
    <div className="w-[304px] shrink-0sticky mt-3 ml-3 top-3 h-screen p-6 bg-white rounded-2xl flex flex-col justify-between">
      <div className="w-[251px] h-[418px] flex flex-col gap-[56px]">
         <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] rounded-[15px]  flex items-center justify-center text-white font-bold">
            <img className="w-[40px] h-[40px] rounded-[15px]  flex items-center justify-center" alt="Logo" src="/icons/logo.svg" />
          </div>
          <h1 className="text-[20px] font-semibold text-[#303030] tracking-[-0.04em] leading-none">
            VedaAI
          </h1>
        </div>
        <div className="p-[4px] rounded-full bg-gradient-to-r from-[#FF7950] to-[#C0350A] w-full max-w-[251px] h-[42px] flex items-center justify-between">
          <Button onClick={() => router.push("/create-assignment")} className="flex items-center justify-center w-full gap-2 px-[24px] py-[12px] rounded-full bg-[#181818] text-white text-[16px] font-medium leading-none tracking-[-0.04em] whitespace-nowrap shadow-[0px_32px_48px_rgba(0,0,0,0.2),0px_16px_48px_rgba(0,0,0,0.12)]">
            ✨ Create Assignment
          </Button>
        </div>
        <div className="w-[251px] flex flex-col gap-2 text-[#5E5E5E]/80">
          <div onClick={() => router.push("/")} className="cursor-pointer w-full h-[40px] flex items-center gap-2 px-[12px] py-[9px] rounded-[8px]">
            <HomeIcon />
            <h4 className="w-[202px] h-[22px] text-[16px] font-normal leading-[140%] tracking-[-0.04em]">
              Home
            </h4>
          </div>
          <div onClick={() => router.push("/my-groups")} className="cursor-pointer w-full h-[40px] flex items-center gap-2 px-[12px] py-[9px] rounded-[8px]">
            <MyGroupIcon />
            <h4 className="w-[202px] h-[22px] text-[16px] font-normal leading-[140%] tracking-[-0.04em]">
              My Groups
            </h4>
          </div>
          <div onClick={() => router.push("/assignments")} className="cursor-pointer  w-full h-[40px] flex items-center gap-2 px-[12px] py-[9px] rounded-[8px]">
            <AssignmentIcon />
            <h4 className="w-[202px] h-[22px] text-[16px] font-normal leading-[140%] tracking-[-0.04em]">
              Assignments
            </h4>
          </div>
          <div onClick={() => router.push("/ai-toolkit")} className="cursor-pointer  w-full h-[40px] flex items-center gap-2 px-[12px] py-[9px] rounded-[8px]">
            <AiIcon />
            <h4 className="w-[202px] h-[22px] text-[16px] font-normal leading-[140%] tracking-[-0.04em]">
              AI Teacher's Toolkit
            </h4>
          </div>
          <div onClick={() => router.push("/my-library")} className="cursor-pointer  w-full h-[40px] flex items-center gap-2 px-[12px] py-[9px] rounded-[8px]">
            <LibIcon />
            <h4 className="w-[202px] h-[22px] text-[16px] font-normal leading-[140%] tracking-[-0.04em]">
              My Library
            </h4>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[256px] flex flex-col gap-2">
        <div onClick={() => router.push("/setting")} className="cursor-pointer w-full h-[40px] flex items-center gap-2 px-[12px] py-[9px] rounded-[8px]">
          <SettingIcon />
          <h4 className="w-[202px] h-[22px] text-[16px] font-normal leading-[140%] tracking-[-0.04em]  text-[#5E5E5E]/80">
            Settings
          </h4>
        </div>
        <div className="w-full max-w-[256px] p-3 bg-[#F0F0F0] rounded-[16px] flex flex-col gap-4">
          <div className="w-full max-w-[256px] p-3 bg-[#F0F0F0] rounded-[16px] flex flex-col gap-4 items-start">
            <div className="w-full max-w-[232px] h-[56px] flex items-center gap-2">
              <img
                src={"/icons/Avatar.svg"}
                 
                className="w-[59px] h-[56px] rounded-full object-cover"
              ></img>
              <div className="w-full max-w-[165px] h-[44px] flex flex-col">
                <h4 className="w-full max-w-[165px] h-[44px] flex flex-col">
                  Delhi Public School
                </h4>
                <h5 className="text-[14px] font-normal leading-[140%] tracking-[-0.04em] text-[#5E5E5E]">
                  Bokaro Steel City
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
