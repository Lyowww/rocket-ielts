"use client";

import { CircleBg } from "@/assets/icons/CircleBg";
import { LineSelectedSideBar } from "@/assets/icons/LineSelectedSideBar";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SidebarNavItemProps {
  name: string;
  href: string;
  icon: string | React.ReactNode;
  isActive: boolean;
  isOpen: boolean;
  className?: string;
  onSelect?: () => void;
}

const SidebarNavItem = ({
  name,
  href,
  icon,
  isActive,
  isOpen,
  className,
  onSelect
}: SidebarNavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "relative w-full flex items-center text-[#23085A] space-x-3 rounded-lg px-[31px] py-4 text-sm font-medium transition-all duration-200 hover:bg-purple-50",
        isActive
          ? "bg-[#7166F908]"
          : "",
        !isOpen && "justify-center",
        className
      )}
      onClick={onSelect}
    >
      <div className="relative flex h-[36px] w-[36px] items-center justify-center shrink-0">
        {typeof icon === "string" ? (
          <div className="flex h-5 w-5 items-center justify-center text-gray-600">
            <span className="text-sm font-edium">{icon.charAt(0).toUpperCase()}</span>
          </div>
        ) : (
          <>
            <div className={cn("absolute inset-0 z-0", isActive ? "block text-white" : "hidden")}>
              <CircleBg />
            </div>
            <div className={cn(
              "relative z-10",
              isActive ? "text-white" : ""
            )}>
              {icon}
            </div>
          </>
        )}
      </div>
      {isOpen && (
        <span className="truncate">{name}</span>
      )}
      {isActive && (
        <LineSelectedSideBar className="absolute right-0 inset-y-0 h-full w-[5px]" />
      )}
    </Link>
  );
};

export default SidebarNavItem;
