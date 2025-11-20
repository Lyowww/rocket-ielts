"use client";

import { useSidebarStore } from "@/store/sidebar.store";
import { cn } from "@/lib/utils";
import SidebarNavigation from "../sidebar-navigation";
import SidebarActions from "../sidebar-actions";
import { Logo } from "@/assets/icons/Logo";
import { CloseSideBarIcon } from "@/assets/icons/CloseSideBarIcon";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-[#F6F6FB] border-[3px] border-[#E2E2E5] border-r-0 transition-all duration-300 ease-in-out",
        isOpen ? "w-[279px]" : "w-[112px]",
        className
      )}
    >
      <div className="flex h-full flex-col gap-[12px]">
        <div className={cn("flex items-start justify-between", isOpen ? "" : "items-center justify-center")}>
          <div
            className={cn(
              "p-[31px] pt-18 cursor-pointer transition-all duration-200",
              !isOpen && "group"
            )}
            onClick={() => {
              toggleSidebar();
            }}
          >
            <CloseSideBarIcon className="" />
          </div>
        </div>

        <div className="flex flex-col gap-[73px]">
          <SidebarNavigation isOpen={isOpen} />
          <SidebarActions isOpen={isOpen} />
        </div>
      </div>
    </aside >
  );
};

export default Sidebar;
