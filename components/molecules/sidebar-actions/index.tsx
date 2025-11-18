"use client";

import { useRouter } from "next/navigation";
import { PrivateRouteEnum } from "@/enum/routes.enum";
import { NewTestIcon } from "@/assets/icons/NewTestIcon";
import SidebarActionButton from "@/components/atom/sidebar-action-button";
import { cn } from "@/lib/utils";
import { useQuestionOrImageStore } from "@/store/questionOrImage.store";

interface SidebarActionsProps {
  isOpen: boolean;
  className?: string;
}

const SidebarActions = ({ isOpen, className }: SidebarActionsProps) => {
  const router = useRouter();
  const {
    setExamType,
    setTaskNumber,
    setQuestionChoice,
    setQuestion,
    setImage,
    setUploadResponse,
    setAnswerimage,
  } = useQuestionOrImageStore();

  const handleTakeNewTest = () => {
    setExamType("writing");
    setTaskNumber(2);
    setQuestionChoice(1);
    setQuestion(undefined);
    setImage(undefined);
    setUploadResponse(undefined);
    setAnswerimage(undefined);
    router.push(PrivateRouteEnum.knowYourScore);
  };
  return (
    <div className={`px-[18px] space-y-4 ${className || ""}`}>
      <SidebarActionButton
        icon={<NewTestIcon />}
        isOpen={isOpen}
        className={cn("bg-[#C7002B] flex items-center justify-center hover:bg-[#C7002B]/80  cursor-pointer shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]", isOpen ? "px-[19.5px] py-[16px]" : "py-3")}
        onClick={handleTakeNewTest}
      >
        Take a New Test
      </SidebarActionButton>

      {/* <div className="p-[2px] bg-[#23085A] rounded-[7px]">
        <SidebarActionButton
          icon={<PlayIcon />}
          isOpen={isOpen}
          className={cn("text-[#23085A] flex items-center justify-center bg-[#F6F6FB] hover:bg-[#F6F6FB]/80 cursor-pointer shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]", isOpen ? "px-[19.5px] py-[16px]" : "py-2")}
          onClick={() => {
            console.log("Continue Recent Practice clicked");
          }}
        >
          Continue Recent Practice
        </SidebarActionButton>
      </div> */}
    </div>
  );
};

export default SidebarActions;
