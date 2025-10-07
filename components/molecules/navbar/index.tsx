"use client";

import NavbarUserProfile from "@/components/atom/navbar-user-profile";

const Navbar = () => {

  return (
    <div className="bg-[#FEFCFC] w-full h-16 sticky top-0 z-50 border-b border-[#F6F6FB]">
      <nav className="w-full h-full relative flex justify-between items-center px-4">
        <div className="flex items-center space-x-4"/>
        <div className="flex items-center space-x-4">
          <NavbarUserProfile />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;