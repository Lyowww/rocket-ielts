import { Writing } from "@/components/organisms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
};

const WritingPage = () => {
  return (
    <div className="w-full h-full bg-[#f8f8f8] mt-20 rounded-[10px] p-10">
      <Writing />
    </div>
  );
};

export default WritingPage;
