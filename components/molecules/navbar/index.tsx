"use client";

import { Logo } from "@/assets/icons/Logo";
import NavbarUserProfile from "@/components/atom/navbar-user-profile";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const listMenu = [
    {
      id: 1,
      name: "Know Your Score",
      href: "/know-your-score",
    },
    {
      id: 2,
      name: "Make it better",
      href: "/make-it-better",
    },
    {
      id: 3,
      name: "Invite Friends",
      href: "/invite-friends",
    },
    {
      id: 4,
      name: "Who we are",
      href: "/who-we-are",
    }

  ]
  const [selectedMenu, setSelectedMenu] = useState(listMenu[0].name);
  const handleSelectMenu = (menu: string) => {
    setSelectedMenu(menu);
  }
  return (
    <div className="bg-transparent w-full h-16 px-6 py-[40px]">
      <nav className="w-full h-[81px] bg-[#E8E8E8] rounded-[10px] relative flex justify-between items-center px-4">
        <div className="flex items-center space-x-4">
          <Logo />
        </div>
        <div className="flex items-center space-x-[60px]">
          {listMenu.map((menu) => (
            <Link href={menu.href} key={menu.id} onClick={() => handleSelectMenu(menu.name)}>
              <p className={cn(selectedMenu === menu.name ? "text-[#23085A] font-medium" : "text-[#575353] font-medium")}>{menu.name}</p>
            </Link>
          ))}
        </div>
        <div className="flex items-center">
          <NavbarUserProfile />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;