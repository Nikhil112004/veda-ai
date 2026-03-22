import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function Button({
  children,
  leftIcon,
  rightIcon,
  className = "",
  onClick
}: ButtonProps) {
  return (
    <button
      className={`w-[277px] h-[46px] flex items-center justify-center gap-1 px-[24px] py-[12px] bg-[#181818] text-white rounded-full border border-white/50 ${className}`}
      onClick={onClick}
    >
      {leftIcon && <span className="w-5 h-5 flex items-center justify-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="w-5 h-5 flex items-center justify-center">{rightIcon}</span>}
    </button>
  );
}