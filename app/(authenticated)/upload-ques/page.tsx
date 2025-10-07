import { Button } from "@/components/atom/button";
import { AddQuestion } from "@/components/organisms";
import { PenLine } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Qies",
};

const UploadQues = () => {
  return (
    <div className="w-full mt-20 pb-20">
      <h2 className="sm:text-[64px] text-[40px] font-bold">Know Your Score!</h2>
      <Button className="w-[194px] h-[50px] text-lg mt-5 cursor-auto">
        <PenLine />
        Writing
      </Button>
      <div className="w-full mt-10">
        <AddQuestion />
      </div>
    </div>
  );
};

export default UploadQues;
