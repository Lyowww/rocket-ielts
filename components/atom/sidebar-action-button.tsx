import { cn } from "@/lib/utils";

interface SidebarActionButtonProps {
  children: React.ReactNode;
  icon: string | React.ReactNode;
  isOpen: boolean;
  onClick?: () => void;
  className?: string;
}

const SidebarActionButton = ({
  children,
  icon,
  isOpen,
  onClick,
  className
}: SidebarActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center space-x-0.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700",
        className
      )}
    >
      <div className="flex h-5 w-5 items-center justify-center">
        {typeof icon === "string" ? (
          <div className="flex h-5 w-5 items-center justify-center text-gray-600">
            <span className="text-sm font-edium">{icon.charAt(0).toUpperCase()}</span>
          </div>
        ) : (
          <>
            {icon}
          </>
        )}
      </div>
      {isOpen && (
        <span className="truncate">{children}</span>
      )}
    </button>
  );
};

export default SidebarActionButton;
