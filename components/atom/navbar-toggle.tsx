import { cn } from "@/lib/utils";

interface NavbarToggleProps {
  onClick: () => void;
  className?: string;
}

const NavbarToggle = ({ onClick, className }: NavbarToggleProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200",
        className
      )}
    >
      <div className="w-5 h-5 flex flex-col justify-center space-y-1">
        <div className="w-full h-0.5 bg-gray-600 rounded"></div>
        <div className="w-full h-0.5 bg-gray-600 rounded"></div>
        <div className="w-full h-0.5 bg-gray-600 rounded"></div>
      </div>
    </button>
  );
};

export default NavbarToggle;
