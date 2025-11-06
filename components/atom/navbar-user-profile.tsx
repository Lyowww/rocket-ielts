"use client";
import { ArrowDown } from "@/assets/icons/ArrowDown";
import { LogOutIcon } from "@/assets/icons/LogOutIcon";
import { DefaultAvatar } from "@/assets/images";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/rtk/hooks";
import { RootState } from "@/store/rtk/store";
import { useState } from "react";
import Cookies from "js-cookie";
import { authService } from "@/services/auth.service";
import { PublicRoutesEnum } from "@/enum/routes.enum";

interface NavbarUserProfileProps {
  className?: string;
}

const NavbarUserProfile = ({ className }: NavbarUserProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAppSelector((s: RootState) => s.userProfile.data);
  const handleLogout = async () => {
    const refresh = Cookies.get("refresh_token");
    try {
      if (refresh) {
        await authService.logOut({ refresh });
      }
    } finally {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("sessionCode");
      window.location.href = PublicRoutesEnum.access;
    }
  };
  return (
    <div className={cn("flex items-center relative gap-2", className)}>
      <div className="flex items-center justify-center gap-2 cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
        }}>
        <div className="w-13 h-13 relative bg-gray-300 rounded-full flex items-center justify-center w-">
          <img src={user?.avatar || DefaultAvatar.src} alt="Profile Picture" className="rounded-full w-13 h-13 w-full h-full" />
        </div>
        <p className="text-[16px] text-[#23085A] font-medium">{user?.user_name}</p>

        <div className="flex items-center justify-center w-[25px] h-[25px]">
          <ArrowDown className={cn("cursor-pointer transition-transform duration-300", isOpen ? "rotate-180 " : "")} />
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-13 rounded-sm shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] right-0 bg-white">
          <div
            className="flex gap-2 cursor-pointer items-center justify-center px-12 py-3 hover:bg-gray-100 hover:text-[#23085A] text-black"
            onClick={handleLogout}
          >
            <LogOutIcon className="w-5 h-5" />
            <p className="text-[16px] text-[#23085A] font-medium">Logout</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarUserProfile;
