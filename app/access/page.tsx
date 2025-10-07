import { AccessCodeForm } from "@/components/organisms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access",
};

export default function Access() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="max-w-[500px] w-full mx-auto flex flex-col gap-4">
        <h2 className="text-center font-extrabold text-[32px]">
          Enter Access Code
        </h2>
        <AccessCodeForm />
      </div>
    </div>
  );
}
