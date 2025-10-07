"use client";
import { ArrowDown } from "@/assets/icons/ArrowDown";
import { ProfilePicExample } from "@/assets/images";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface NavbarUserProfileProps {
  userName?: string;
  className?: string;
}

const NavbarUserProfile = ({ userName = "User", className }: NavbarUserProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const listMenu = [
    {
      name: "Dashboard",
      href: "/",
    },
    {
      name: "Know Your Score",
      href: "/know-your-score",
    },
    {
      name: "Make it better",
      href: "/make-it-better",
    },
    {
      name: "Invite Friends",
      href: "/invite-friends",
    },
    {
      name: "Who we are",
      href: "/who-we-are",
    }

  ]
  return (
    <div className={cn("flex items-center", className)}>
      <div className="absolute right-4 flex items-center justify-center gap-4">
        <div className="w-13 h-13 relative bg-gray-300 rounded-full flex items-center justify-center w-">
          <img src={ProfilePicExample.src} alt="Profile Picture" className="rounded-full w-full h-full object-cover object-center" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-[#C7002B] rounded-full"></div>
        </div>
        <div className="flex items-center justify-center w-[25px] h-[25px]" onClick={() => {
          setIsOpen(!isOpen);
        }}>
          <ArrowDown className={cn("cursor-pointer transition-transform duration-300", isOpen ? "rotate-180 " : "")} />
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-16 w-[225px] p-[1px] rounded-[12px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] right-6 bg-gradient-to-b from-[#23085A] to-[#651FFF]">
          <div className="bg-[#F7F6F8] h-full w-full text-[16px] rounded-[11px] py-4">
            {listMenu.map((item) => (
              <div className="flex items-center justify-center h-[40px] hover:bg-white hover:text-[#23085A] text-black" key={item.name}>
                <Link href={item.href}>
                  {item.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarUserProfile;
