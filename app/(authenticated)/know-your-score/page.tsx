import { KnowYourScore } from "@/components/organisms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Know Your Score",
};

const KnowYourScorePage = () => {
  return (
    <div className="w-full mt-20">
      <KnowYourScore />
    </div>
  );
};

export default KnowYourScorePage;


