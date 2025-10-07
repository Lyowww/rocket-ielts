"use client";

import { Star, Upload } from "lucide-react";
import useWriting from "./useWriting";
import { Textarea } from "@/components/atom/textarea";
import { FilePicker } from "@/components/molecules";
import { Button } from "@/components/atom/button";

const Writing = () => {
  const {
    step,
    questionType,
    customQuestion,
    file,

    handleChoosePath,
    handleChooseTask,
    handleChooseQuestionType,
    handleFileChange,
    handleQuestiontextChange,
  } = useWriting();

  return (
    <div className="w-full">
      {step === 1 && (
        <div className="w-full">
          <h2 className="text-[40px] font-bold text-[#090909] text-center">
            Choose Your Path
          </h2>
          <div className="flex justify-center items-center gap-4 mt-10">
            <div
              className="w-[248px] h-[200px] bg-white rounded-lg border-[1px] border-zinc-200 text-[#414141] text-[20px] font-[500] flex flex-col justify-center items-center cursor-pointer"
              role="button"
              onClick={() => handleChoosePath("ac")}
            >
              <h2>Academic</h2>
              <p>IELTS</p>
            </div>
            <div
              className="w-[248px] h-[200px] bg-white rounded-lg border-[1px] border-zinc-200 text-[#414141] text-[20px] font-[500] flex flex-col justify-center items-center cursor-pointer"
              role="button"
              onClick={() => handleChoosePath("ge")}
            >
              <h2>General</h2>
              <p>IELTS</p>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="w-full">
          <h2 className="text-[40px] font-bold text-[#090909] text-center">
            Choose Your Task
          </h2>
          <div className="flex justify-center items-center gap-4 mt-10">
            <div
              className="w-[248px] h-[200px] bg-white rounded-lg border-[1px] border-zinc-200 text-[#414141] text-[20px] font-[500] flex flex-col justify-center items-center cursor-pointer"
              role="button"
              onClick={() => handleChooseTask(1)}
            >
              <h2>Task 1</h2>
            </div>
            <div
              className="w-[248px] h-[200px] bg-white rounded-lg border-[1px] border-zinc-200 text-[#414141] text-[20px] font-[500] flex flex-col justify-center items-center cursor-pointer"
              role="button"
              onClick={() => handleChooseTask(2)}
            >
              <h2>Task 2</h2>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="w-full">
          <h2 className="text-[40px] font-bold text-[#090909] text-center">
            Choose Your Question
          </h2>
          <div className="flex justify-center items-center gap-4 mt-10">
            <div
              className="w-[248px] h-[200px] bg-white rounded-lg border-[1px] border-zinc-200 text-[#414141] text-[20px] font-[500] flex flex-col justify-center items-center cursor-pointer"
              role="button"
              onClick={() => handleChooseQuestionType("own")}
            >
              <Upload />
              <h2 className="mt-4">I have my</h2>
              <p>own question</p>
            </div>
            <div
              className="w-[248px] h-[200px] bg-white rounded-lg border-[1px] border-zinc-200 text-[#414141] text-[20px] font-[500] flex flex-col justify-center items-center cursor-pointer"
              role="button"
              onClick={() => handleChooseQuestionType("choose")}
            >
              <Star />
              <h2 className="mt-4">Choose One</h2>
            </div>
          </div>
        </div>
      )}
      {step === 4 && questionType === "own" && (
        <div className="w-full">
          <h2 className="text-[40px] font-bold text-[#090909] text-center">
            Paste your Question or upload an image/pdf
          </h2>
          <div className="flex flex-col  gap-4 mt-10 max-w-[860px] mx-auto">
            <Textarea
              placeholder="Type your Question here..."
              className="bg-white max-h-[600px] mb-4 placeholder:text-[18px] placeholder:font-[500]"
              onChange={(e) => handleQuestiontextChange(e.target.value)}
              value={customQuestion}
            />
            <FilePicker
              title="Upload"
              multiple={false}
              accept={["image/jpg", "image/png", "application/pdf"]}
              onChange={handleFileChange}
            />
            {(!!customQuestion?.trim().length || !!file) && (
              <Button className="text-lg text-black max-w-[166px] h-[51px] bg-white hover:bg-zinc-200 border-[1px] border-zinc-100">
                Next
              </Button>
            )}
          </div>
        </div>
      )}
      {step === 4 && questionType === "choose" && (
        <div className="w-full">
          <div className="flex flex-col  gap-4 mt-4 max-w-[860px] mx-auto">
            <h2 className="text-[20px] font-bold text-[#090909]">
              <p>Your Question</p>
            </h2>
            <div>question image must be here</div>
          </div>
          <div className="flex flex-col  gap-4 mt-4 max-w-[860px] mx-auto">
            <h2 className="text-[20px] font-bold text-[#090909]">
              <p>Your Answer</p>
            </h2>
            <Textarea
              placeholder="Type your Question here..."
              className="bg-white min-h-[400px] max-h-[600px] mb-4"
              onChange={(e) => handleQuestiontextChange(e.target.value)}
              value={customQuestion}
            />

            <Button className="text-lg h-[51px] w-max font-bold bg-[#d32f2f]">
              Submit Your Answer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Writing;
