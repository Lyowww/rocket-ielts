"use client";
import { ContactUsIcon } from "@/assets/icons/ContactUsIcon";
import { DashboardIcon } from "@/assets/icons/DashboardIcon";
import { MessagingIcon } from "@/assets/icons/MessagingIcon";
import { MyProfileIcon } from "@/assets/icons/MyProfileIcon";
import { PricingPlansIcon } from "@/assets/icons/PricingPlansIcon";
import { SelectTeacherIcon } from "@/assets/icons/SelectTeacherIcon";
import SidebarNavItem from "@/components/atom/sidebar-nav-item";
import { usePathname } from "next/navigation";

interface SidebarNavigationProps {
  isOpen: boolean;
  className?: string;
  onItemSelect?: () => void;
}

const navigationItems = [
  {
    name: "My compass",
    href: "/",
    icon: DashboardIcon,
  },
  {
    name: "My profile",
    href: "/profile",
    icon: MyProfileIcon,
  },
  {
    name: "Messaging",
    href: "/messaging",
    icon: MessagingIcon,
  },
  {
    name: "Select a guide",
    href: "/teachers",
    icon: SelectTeacherIcon,
  },
  {
    name: "Pricing & plans",
    href: "/pricing",
    icon: PricingPlansIcon,
  },
  {
    name: "Contact Us",
    href: "/contact",
    icon: ContactUsIcon,
  },
];

const SidebarNavigation = ({ isOpen, className, onItemSelect }: SidebarNavigationProps) => {
  const pathname = usePathname();

  return (
    <nav className={`flex-1 space-y-1 ${className || ""}`}>
      {navigationItems.map((item) => (
        <SidebarNavItem
          key={item.name}
          name={item.name}
          href={item.href}
          icon={<item.icon />}
          isActive={pathname === item.href}
          isOpen={isOpen}
          onSelect={onItemSelect}
        />
      ))}
    </nav>
  );
};

export default SidebarNavigation;
