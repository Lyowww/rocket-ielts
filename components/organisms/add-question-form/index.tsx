"use client";
import { Textarea } from "@/components/atom/textarea";
import { FilePicker } from "@/components/molecules";
import React from "react";
import useAddQuestion from "./useAddQuestion";
import { Checkbox } from "@/components/atom/checkbox";
import Image from "next/image";
import { Button } from "@/components/atom/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/atom/alert-dialog";
import { useRouter } from "next/navigation";
import { PrivateRouteEnum } from "@/enum/routes.enum";

const AddQuestion = () => {
  const { push } = useRouter();
  const {
    file,
    text,
    isTextAndImageChecked,
    showModal,
    uploadResponse,
    isPending,
    editMode,
    handleFileChange,
    handleTextChange,
    handleTextAndImageCheckedChange,
    handleNext,
    handleGenerateQuestion,
    setEditMode,
    setUploadResponse,
  } = useAddQuestion();

  return (
    <div className="w-full flex justify-between">
      <div className="w-full lg:max-w-[600px] max-w-max  flex flex-col gap-3">
        <h2 className="text-[32px] font-bold capitalize">
          Provide your question
        </h2>
        <figure className="mt-3 w-full">
          <Textarea
            placeholder="Write Here"
            className="w-full placeholder:text-lg placeholder:font-[500] bg-white max-h-[800px]"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            disabled={!isTextAndImageChecked && !!file}
          />
        </figure>
        <span className="font-bold w-full text-center my-2">OR</span>

        <FilePicker
          title="Upload an image"
          multiple={false}
          disabled={!isTextAndImageChecked && !!text}
          accept={[
            "image/jpg",
            "image/png",
            "text/plain",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/pdf",
          ]}
          onChange={handleFileChange}
        />
        {(!!text?.trim() || !!file) && (
          <Button
            onClick={handleNext}
            isLoading={isPending}
            className="bg-[#414141] text-lg h-[50px] hover:bg-[#414141] hover:opacity-90 max-w-[180px] mt-3"
          >
            Next
          </Button>
        )}
        <div className="w-full mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms2"
              onCheckedChange={(e: boolean) =>
                handleTextAndImageCheckedChange(e)
              }
              checked={isTextAndImageChecked}
            />
            <label
              htmlFor="terms2"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I want to use both image and text for my question
            </label>
          </div>
          <p className="text-sm text-[#ff0000] mt-[10px]">
            <span className="pr-1 font-bold">Note:</span>
            If unchecked, only the selected text or image will be used. If both
            fields are filled and this option is not selected, the image will be
            used.
          </p>
          <p
            className="text-[16px] mt-[10px] cursor-pointer w-fit"
            role="button"
            onClick={handleGenerateQuestion}
          >
            OR{" "}
            <span className="text-[#3e63ed] underline capitalize">
              Create a test automatically
            </span>
          </p>
        </div>
      </div>
      <div className="w-full h-[400px] lg:flex hidden gap-6 items-center flex-1 relative pl-10 mt-10">
        <div className="">
          <Image
            src="https://res.cloudinary.com/duwsak7vc/image/upload/v1753774082/Group_1_kudxi5.png"
            width={200}
            height={400}
            alt="test"
          />
        </div>
        <div className="flex justify-end">
          <Image
            src="https://res.cloudinary.com/duwsak7vc/image/upload/v1753774083/Frame_47745_q4bilg.png"
            width={400}
            height={400}
            alt="test"
          />
        </div>
      </div>
      <AlertDialog open={showModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[30px]">
              Is This Correct?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-4 text-lg">
              {editMode ? (
                <textarea
                  className="w-full min-h-[300px] border-[1px] border-zinc-300 p-4 rounded-lg placeholder:text-lg placeholder:font-[500] overflow-y-auto bg-white"
                  value={uploadResponse}
                  onChange={(e) => setUploadResponse(e.target.value)}
                />
              ) : (
                <span
                  dangerouslySetInnerHTML={{ __html: uploadResponse || "" }}
                />
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full flex !flex-col mt-10">
            <div className="flex items-center gap-4">
              <AlertDialogAction
                className="min-w-[180px] h-[50px] rounded-none"
                onClick={() => push(PrivateRouteEnum.test)}
              >
                Yes
              </AlertDialogAction>
              <AlertDialogCancel
                onClick={() => setEditMode(true)}
                className="min-w-[180px] h-[50px] bg-[#414141] text-white rounded-none"
              >
                Edit
              </AlertDialogCancel>
            </div>

            <p
              className="text-[16px] mt-[10px] cursor-pointer w-fit"
              role="button"
              onClick={handleGenerateQuestion}
            >
              OR{" "}
              <span className="text-[#3e63ed] underline capitalize">
                Create a test automatically
              </span>
            </p>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddQuestion;
