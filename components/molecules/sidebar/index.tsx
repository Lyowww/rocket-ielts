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
      <div className="flex h-full flex-col gap-[55px]">
        <div className={cn("flex items-start justify-between", isOpen ? "" : "items-center justify-center")}>
          <div 
            className={cn(
              "p-[31px] cursor-pointer transition-all duration-200",
              !isOpen && "group"
            )}
            onClick={() => {
              if (!isOpen) {
                toggleSidebar();
              }
            }}
          >
            {isOpen ? (
              <Logo className="w-full h-full" />
            ) : (
              <div className="relative">
                <Logo className="w-[77px] h-[43.89px] group-hover:opacity-0 transition-opacity duration-200" />
                <CloseSideBarIcon className="absolute w-[50px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            )}
          </div>
          {isOpen && (
            <div
              className="p-[31px] px-[12px] cursor-pointer"
              onClick={() => {
                toggleSidebar();
              }}
            >
              <CloseSideBarIcon />
            </div>
          )}
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
