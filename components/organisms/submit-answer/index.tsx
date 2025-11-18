"use client";

import Image from "next/image";
import useSubmitAnswer from "./useSubmitAnswer";
import { Button } from "@/components/atom/button";
import { useRef, useEffect, useState, useMemo } from "react";
import { Textarea } from "@/components/atom/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/atom/alert-dialog";
import { Loader } from "@/components/molecules";

import { FileText, X } from "lucide-react";

import { toast } from "sonner";

const SubmitAnswer = () => {
  const {
    shortQuestion,
    question,
    answer,
    data,
    isPending,
    submitPending,
    showResults,
    showAlert,
    uploadResponse,
    wordCount,
    isBelowMin,
    image,
    answerImage,
    get_chat_questions_pending,
    handleFileChange,
    handleChangeAnswer,
    handleRemoveUploadedAnswers,
    handleSubmit,
    setShowAlert,
    getChatQuestionMutation,
    error,
    setError,
  } = useSubmitAnswer();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (error) {
      setShowAlert(false);
    }
  }, [error, setShowAlert]);

  const handleCloseError = () => {
    setShowAlert(false);
    if (setError) setError("");
  };
  console.log("data", data)
  console.log("uploadResponse", uploadResponse)
  console.log("question", question)

  const questionImageSrc = useMemo(() => {
    const rawQuestion = data?.question;
    if (!rawQuestion) return undefined;

    const trimmed = rawQuestion.trim();
    if (!trimmed) return undefined;

    if (trimmed.startsWith("data:image/")) {
      return trimmed;
    }

    const sanitized = trimmed.replace(/\s/g, "");
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    const looksLikeBase64 =
      sanitized.length > 100 &&
      sanitized.length % 4 === 0 &&
      base64Regex.test(sanitized);

    if (!looksLikeBase64) return undefined;
    return `data:image/png;base64,${sanitized}`;
  }, [data?.question]);

  const textQuestion = questionImageSrc
    ? undefined
    : (uploadResponse || question || data?.question);

  const isQuestionReady =
    !!(
      uploadResponse ||
      question ||
      image ||
      data?.question ||
      data?.question_path ||
      questionImageSrc
    );

  const [waitForQuestionToSubmit, setWaitForQuestionToSubmit] = useState(false);

  useEffect(() => {
    if (waitForQuestionToSubmit && !isPending && isQuestionReady) {
      handleSubmit();
      setWaitForQuestionToSubmit(false);
    }
  }, [waitForQuestionToSubmit, isPending, isQuestionReady, handleSubmit, data]);

  return (
    <div className="w-full flex lg:flex-row flex-col gap-10">
      <div className="w-full flex flex-col gap-10">
        <div className="text-[#414141] font-semibold flex flex-col gap-2">
          <h2 className="md:text-[20px] font-bold text-[18px]">
            Your Question
          </h2>
          {isPending && !isQuestionReady ? (
            <p className="mt-4 md:text-[18px] text-[16px] !font-bold">Loading ...</p>
          ) : questionImageSrc ? (
            <div className="mt-4">
              <Image
                src={questionImageSrc}
                width={800}
                height={400}
                alt="Question image"
                className="rounded"
                unoptimized
              />
            </div>
          ) : textQuestion ? (
            <div
              className="mt-4 md:text-[18px] text-[16px] !font-bold break-all max-w-[1000px]"
              dangerouslySetInnerHTML={{
                __html: textQuestion as string,
              }}
            />
          ) : null}
        </div>

        {/* {!!data?.question_path && (
          <div className="text-[#414141] font-bold text-[20px]">
            {isPending && !isQuestionReady ? (
              <p>Loading ...</p>
            ) : (
              <Image
                src={data?.question_path}
                width={800}
                height={400}
                alt="Uploaded image"
                className="rounded"
              />
            )}
          </div>
        )}
        {!!image && (
          <div className="text-[#414141] font-bold text-[20px]">
            <Image
              src={URL.createObjectURL(image)}
              width={800}
              height={400}
              alt="Uploaded image"
              className="rounded"
            />
          </div>
        )} */}
        {showResults && (
          <div className="border-[1px] bg-white border-[#C8C8C8] rounded-[4px] px-3 py-4">
            <h2 className="md:text-[20px] font-bold text-[18px]">
              Your Answer
            </h2>
            {answer ? (
              <p className="text-md mt-6 leading-[26px]">{answer}</p>
            ) : answerImage ? (
              <>
                {answerImage?.type?.startsWith("image") ? (
                  <Image
                    src={URL.createObjectURL(answerImage)}
                    width={500}
                    height={400}
                    alt="answer"
                    className="w-full h-full object-contain max-h-[700px] rounded-lg"
                  />
                ) : (
                  <div className="w-full h-[400px] rounded-lg bg-slate-200">
                    <ul className="w-full h-full flex flex-col justify-center items-center gap-2">
                      <li>
                        <FileText size={50} />
                      </li>
                      <li className="font-bold mt-4">
                        {" "}
                        File : {answerImage?.name}
                      </li>
                      <li className="font-bold"> Type : {answerImage?.type}</li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>

      <div className="w-full h-20">
        <div className="w-full flex justify-between items-start">
          <h2 className="md:text-[20px] text-[18px] text-[#414141] font-bold">
            {showResults ? "Your Score" : "Your Answer"}
          </h2>
          {!showResults && (
            <div>
              <div className="flex flex-col justify-between items-center gap-1">
                <Button
                  onClick={handleClickUpload}
                  className="bg-[#e1e1e1] hover:bg-[#e1e1e1] hover:opacity-80 text-black w-[180px] h-[50px] font-bold"
                >
                  Upload File
                </Button>
                <p className="text-[14px] font-semibold">
                  jpeg, png, txt, docx, pdf
                </p>
              </div>
              <input
                ref={fileInputRef}
                id="file-picker"
                type="file"
                accept=".jpeg,.jpg,.png,.txt,.docx,.pdf"
                hidden
                onChange={(e) => handleFileChange(e.target.files)}
              />
            </div>
          )}
        </div>
        <div className="my-6 w-full">
          {showResults ? (
            <>
              <div className="w-full  border-[1px] bg-white border-[#C8C8C8] rounded-[4px] px-3 py-4">
                <h2 className="text-[20px] text-[#B3B3B3] text-center mt-3">
                  Overall Current Writing Band
                </h2>
                <p className="text-primary text-[28px] font-bold text-center mt-1">
                  {shortQuestion?.scores?.overall_score}
                </p>
                <div className="w-full p-4 h-[400px] overflow-y-auto text-[20px] my-4 ">
                  {submitPending ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <Loader color="text-primary" />
                    </div>
                  ) : (
                    <div
                      className="mt-6 !text-[16px] !leading-[27px]"
                      dangerouslySetInnerHTML={{
                        __html: shortQuestion?.answer || "",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="w-full flex justify-center items-center mt-10">
                <Button
                  className="bg-[#d32f2f]  h-[51px] text-[18px] font-bold px-6 mb-10 capitalize"
                  onClick={getChatQuestionMutation}
                  disabled={get_chat_questions_pending}
                  isLoading={get_chat_questions_pending}
                >
                  Start practice
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              {!answerImage && (
                <div className="mt-2 text-sm flex items-center gap-2">
                  Word count :
                  <span
                    className={
                      isBelowMin
                        ? "text-red-500 font-medium"
                        : "text-green-600 font-medium"
                    }
                  >
                    {wordCount}
                  </span>
                </div>
              )}

              {answerImage ? (
                <div className="w-full min-h-[500px] relative flex flex-col items-end gap-4">
                  <Button
                    title="Delete"
                    className=" bg-zinc-400 !px-2 h-8"
                    onClick={handleRemoveUploadedAnswers}
                  >
                    <X />
                  </Button>
                  {answerImage?.type?.startsWith("image") ? (
                    <Image
                      src={URL.createObjectURL(answerImage)}
                      width={500}
                      height={400}
                      alt="answer"
                      className="w-full h-full object-contain max-h-[700px] rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-[400px] rounded-lg bg-slate-200">
                      <ul className="w-full h-full flex flex-col justify-center items-center gap-2">
                        <li>
                          <FileText size={50} />
                        </li>
                        <li className="font-bold mt-4">
                          {" "}
                          File : {answerImage?.name}
                        </li>
                        <li className="font-bold">
                          {" "}
                          Type : {answerImage?.type}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Textarea
                  placeholder="Type your answer here..."
                  className="w-full placeholder:text-lg placeholder:font-[500] bg-white min-h-[400px] max-h-[800px]"
                  value={answer}
                  onChange={(e) => handleChangeAnswer(e.target.value)}
                />
              )}
            </div>
          )}

          {/* <>
            {results?.answer && (
              <>
                <div className="w-full  border-[1px] bg-white border-[#C8C8C8] rounded-[4px] px-3 py-4 mt-10">
                  <div className="w-full p-4 h-[500px] overflow-y-auto text-[20px] my-4 ">
                    {submitPending ? (
                      <div className="w-full h-full flex justify-center items-center">
                        <Loader color="text-primary" />
                      </div>
                    ) : (
                      <div
                        className="!text-[16px] !leading-[26px]"
                        dangerouslySetInnerHTML={{ __html: results.answer }}
                      />
                    )}
                  </div>
                </div>
                <div className="w-full flex justify-center items-center mt-10">
                  <Button
                    className="bg-[#d32f2f]  h-[51px] text-[18px] font-bold px-6 mb-10 capitalize"
                    onClick={getChatQuestionMutation}
                    disabled={get_chat_questions_pending}
                    isLoading={get_chat_questions_pending}
                  >
                    Practice to improve your response
                  </Button>
                </div>
              </>
            )}
          </> */}

          <div className="w-full flex justify-end items-center">
            {!showResults && (
              <Button
                className="bg-[#d32f2f] my-6 h-[51px] text-[18px] font-bold px-6"
                disabled={!!isBelowMin && !answerImage}
                onClick={() => {
                  if (!answer.trim() && !answerImage) {
                    toast.error("Answer cannot be empty.");
                  } else {
                    setShowAlert(true);
                  }
                }}
              >
                Submit Your Answer
              </Button>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[24px] text-center font-normal max-w-[300px] mx-auto capitalize">
              Are you done with your response?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full flex !flex-col mt-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <AlertDialogCancel
                onClick={() => setShowAlert(false)}
                className="min-w-[180px] h-[50px] bg-white text-black border-[1px] border-[#E0E0E0] rounded-md"
              >
                No
              </AlertDialogCancel>

              <AlertDialogAction
                className="min-w-[180px] h-[50px] rounded-md flex justify-center items-center gap-3"
                onClick={() => {
                  if (!isQuestionReady && isPending) {
                    setWaitForQuestionToSubmit(true);
                    return;
                  }
                  handleSubmit();
                }}
              >
                Yes
                {(submitPending || (waitForQuestionToSubmit && isPending)) && (
                  <Loader size={20} />
                )}
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!error}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[24px] text-center font-normal max-w-[300px] mx-auto capitalize">
              {error}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full flex !flex-col mt-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                className="bg-[#d32f2f] min-w-[180px] h-[51px] text-[18px] font-bold px-6 mb-10 capitalize"
                onClick={() => {
                  handleCloseError();
                }}
              > Close</Button>

            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubmitAnswer;
