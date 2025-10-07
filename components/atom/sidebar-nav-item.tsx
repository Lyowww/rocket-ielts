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
}

const SidebarNavItem = ({
  name,
  href,
  icon,
  isActive,
  isOpen,
  className
}: SidebarNavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center text-[#23085A] space-x-3 rounded-lg px-[31px] py-4 text-sm font-medium transition-all duration-200 hover:bg-purple-50",
        isActive
          ? "bg-[#7166F908]"
          : "",
        !isOpen && "justify-center",
        className
      )}
    >
      <div className="flex h-[23.79px] items-center justify-center">
        {typeof icon === "string" ? (
          <div className="flex h-5 w-5 items-center justify-center text-gray-600">
            <span className="text-sm font-edium">{icon.charAt(0).toUpperCase()}</span>
          </div>
        ) : (
          <>
            <div className={cn("absolute z-0", isActive ? "text-white block" : "hidden")}>
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
        <LineSelectedSideBar className="absolute right-0" />
      )}
    </Link>
  );
};

export default SidebarNavItem;
