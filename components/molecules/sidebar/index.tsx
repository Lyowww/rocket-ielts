"use client";

import { useSidebarStore } from "@/store/sidebar.store";
import { cn } from "@/lib/utils";
import SidebarNavigation from "../sidebar-navigation";
import SidebarActions from "../sidebar-actions";
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
        <div className={cn("flex items-start justify-end", isOpen ? "px-4 pt-6" : "px-3 pt-6")}>
          <button
            type="button"
            aria-label="Toggle sidebar width"
            className={cn(
              "p-2 rounded-full text-[#23085A] transition-colors duration-200 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#23085A]/40"
            )}
            onClick={toggleSidebar}
          >
            <CloseSideBarIcon className={cn(!isOpen && "rotate-180")} />
          </button>
        </div>

        <div className="flex flex-col gap-[40px] overflow-y-auto pb-6 scrollbar-23085A">
          <SidebarNavigation isOpen={isOpen} />
          <SidebarActions isOpen={isOpen} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
