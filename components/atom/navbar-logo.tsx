import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/assets/icons/Logo";

interface NavbarLogoProps {
  className?: string;
}

const NavbarLogo = ({ className }: NavbarLogoProps) => {
  return (
    <Link href={"/"} className={cn("flex items-center", className)}>
      <Logo />
    </Link>
  );
};

export default NavbarLogo;
