"use client";

import { Logo } from "@/assets/icons/Logo";
import NavbarUserProfile from "@/components/atom/navbar-user-profile";
import NavbarToggle from "@/components/atom/navbar-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/atom/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import SidebarNavigation from "../sidebar-navigation";
import SidebarActions from "../sidebar-actions";

const Navbar = () => {
  const listMenu = [
    {
      id: 1,
      name: "Know Your Score",
      href: "/know-your-score",
    },
    {
      id: 2,
      name: "Make It Better",
      href: "/make-it-better",
    },
    {
      id: 3,
      name: "Invite Friends",
      href: "/invite-friends",
    },
    {
      id: 4,
      name: "Who We Are",
      href: "/who-we-are",
    }

  ]
  const [selectedMenu, setSelectedMenu] = useState(listMenu[0].name);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleSelectMenu = (menu: string) => {
    setSelectedMenu(menu);
  }

  const sharedMenu = (className?: string) => (
    <div className={cn("flex items-center gap-6", className)}>
      {listMenu.map((menu) => (
        <Link href={menu.href} key={menu.id} onClick={() => handleSelectMenu(menu.name)}>
          <p className={cn(
            "text-sm sm:text-base whitespace-nowrap transition-colors duration-200",
            selectedMenu === menu.name ? "text-[#23085A] font-semibold" : "text-[#575353]"
          )}>
            {menu.name}
          </p>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <div className="bg-transparent w-full px-4 py-4 sm:px-6 sm:py-6">
        <nav className="w-full bg-[#E8E8E8] rounded-[10px] relative flex flex-wrap items-center gap-4 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <NavbarToggle
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden"
            />
            <Logo />
          </div>
          {sharedMenu("hidden lg:flex flex-1 justify-center")}
          <div className="ml-auto flex items-center gap-3">
            <NavbarUserProfile />
          </div>
        </nav>
        {sharedMenu("mt-4 flex-wrap justify-center gap-x-6 gap-y-2 lg:hidden")}
      </div>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-full max-w-sm border-none bg-[#F6F6FB] p-0">
          <SheetHeader className="border-b border-[#E2E2E5]">
            <SheetTitle className="flex items-center gap-2 text-[#23085A] px-5">
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-5 py-6">
            <SidebarNavigation isOpen className="space-y-1" />
            <div className="border-t border-[#E2E2E5] pt-4">
              <SidebarActions isOpen />
            </div>
            {/* <div className="border-t border-[#E2E2E5] pt-4">
              <NavbarUserProfile />
            </div> */}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Navbar;