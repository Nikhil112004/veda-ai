"use client";
import SideBar from "@/components/SideBar";
import Navbar from "@/components/NavBar";
import Button from "@/components/Button";
import PlusIcon from "@/components/icons/PlusIcon";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-[calc(100vh-80px)] px-4 sm:px-6">
      <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 w-full max-w-[486px]">
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <img
            className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px]"
            src="/icons/illustrations.svg"
            alt="Illustration"
          />
          <div className="w-full max-w-[486px]">
            <h1 className="text-[18px] sm:text-[20px] font-bold text-center text-[#303030]">
              No assignments yet
            </h1>
            <h4 className="w-full text-[14px] sm:text-[16px] px-2 sm:px-4 text-center text-[#5E5E5E]/80">
              Create your first assignment to start collecting and grading
              student submissions. You can set up rubrics, define marking
              criteria, and let AI assist with grading.
            </h4>
          </div>
        </div>
        <Button
          className="w-full sm:w-auto"
          leftIcon={<PlusIcon />}
          onClick={() => router.push("/create-assignment")}
        >
          Create Your first Assignment
        </Button>
      </div>
    </div>
  );
}
