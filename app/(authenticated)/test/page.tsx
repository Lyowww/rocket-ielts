import { SubmitAnswer } from "@/components/organisms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test",
};

const Test = () => {
  return (
    <div className="w-full mt-20">
      <SubmitAnswer />
    </div>
  );
};

export default Test;
