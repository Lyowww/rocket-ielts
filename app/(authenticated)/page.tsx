import Dashboard from "@/components/organisms/dashboard";
import ReduxProvider from "@/components/organisms/redux-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <div className="w-full">
        <Dashboard />
    </div>
  );
}
