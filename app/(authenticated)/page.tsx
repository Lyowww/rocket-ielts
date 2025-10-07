import Dashboard from "@/components/organisms/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <div className="w-full mt-[12.08px]">
      <Dashboard />
    </div>
  );
}
