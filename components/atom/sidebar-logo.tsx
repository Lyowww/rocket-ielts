import { cn } from "@/lib/utils";

interface SidebarLogoProps {
  isOpen: boolean;
  className?: string;
}

const SidebarLogo = ({ isOpen, className }: SidebarLogoProps) => {
  return (
    <div className={cn("flex h-16 items-center justify-center border-b border-gray-200 px-4", className)}>
      <div className="flex items-center space-x-2">
        <span className={cn(
          "font-bold text-lg transition-all duration-300",
          isOpen ? "text-purple-600" : "text-purple-600"
        )}>
          IELTS
        </span>
        {isOpen && (
          <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm font-medium">
            Testing
          </span>
        )}
      </div>
    </div>
  );
};

export default SidebarLogo;
