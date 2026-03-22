"use client"

import { useRouter, usePathname } from "next/navigation";
import { Home, FileText, Book, Sparkles } from "lucide-react";

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: FileText, label: "Assignments", path: "/assignments" },
    { icon: Book, label: "Library", path: "/my-library" },
    { icon: Sparkles, label: "AI Toolkit", path: "/ai-toolkit" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4">
      <div className="bg-black rounded-[20px] flex justify-around items-center h-[64px] shadow-lg">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center justify-center text-white"
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-white" : "text-white/60"
                }`}
              />
              <span
                className={`text-[10px] mt-1 ${
                  isActive ? "text-white" : "text-white/60"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}