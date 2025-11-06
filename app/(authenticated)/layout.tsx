"use client";

import { Navbar, Sidebar } from "@/components/molecules";
import React, { ReactNode } from "react";
import { useSidebarStore } from "@/store/sidebar.store";
import { cn } from "@/lib/utils";
import ReduxProvider from "@/components/organisms/redux-provider";

const Layout = ({ children }: { children: ReactNode }) => {
  const { isOpen } = useSidebarStore();

  return (
    <div className="w-full h-full min-h-screen bg-[#F0F0F0]">
      <ReduxProvider>
        <Sidebar />
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          isOpen ? "ml-[279px]" : "ml-[112px]"
        )}>
          <Navbar />
          <main className="p-6 pt-[90px]">
            {children}
          </main>
        </div>
      </ReduxProvider>
    </div>
  );
};

export default Layout;
