"use client";

import { PrivateRouteEnum } from "@/enum/routes.enum";
import { questionService } from "@/services/question.service";
import { useQuestionOrImageStore } from "@/store/questionOrImage.store";
import { fileToBase64, mapExamTypeToBackend } from "@/utils/helpFunctions";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useLayoutEffect, useState } from "react";
import { toast } from "sonner";
import { CircleAlert, X } from "lucide-react";

const useAddQuestion = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isTextAndImageChecked, setIsTextAndImageChecked] =
    useState<boolean>(false);
  const { push } = useRouter();

  const {
    image,
    question,
    examType,
    taskNumber,
    setQuestion,
    setImage,
    setUploadResponse,
    uploadResponse,
    setTaskNumber,
  } = useQuestionOrImageStore();

  const { mutate, isPending } = useMutation({
    mutationKey: ["upload-question"],
    mutationFn: (data: UploadQuestionPayload) =>
      questionService.uploadQuestion(data),
    onSuccess: (data) => {
      if (data?.results?.startsWith("I'm unable")) {
        setImage(undefined);
        toast.custom(
          (t) => (
            <div className="relative md:w-[600px] w-full bg-white border rounded-lg  p-4 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => toast.dismiss(t)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="text-[20px] font-bold flex items-center gap-2 text-red-500">
                <CircleAlert color="red" size={20} />
                Unable to view the image
              </div>
              <div className=" text-[14px] mt-4">{data?.results}</div>
            </div>
          ),
          {
            duration: 10000,
            position: "top-center",
          }
        );
      } else {
        setUploadResponse(data?.results);
        setShowModal(true);
      }
    },
    onError: (error: { error: string }) => {
      toast.error(error?.error);
    },
  });

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const handleTextChange = useCallback((txt: string) => {
    setQuestion(txt);
  }, []);

  const handleTextAndImageCheckedChange = useCallback((checked: boolean) => {
    setIsTextAndImageChecked(checked);
  }, []);

  const handleGenerateQuestion = () => {
    setTaskNumber(2);
    setImage(undefined);
    setUploadResponse(undefined);
    push(PrivateRouteEnum.test);
  };

  const handleNext = async () => {
    const bas64Image = image ? await fileToBase64(image) : undefined;

    setTaskNumber(1);
    if (!isTextAndImageChecked && !!question && !!image) {
      setQuestion("");
    }

    if (question && !bas64Image) {
      push(PrivateRouteEnum.test);
    } else {
      mutate({
        exam_type: mapExamTypeToBackend(examType) as any,
        task_number: String(taskNumber),
        file_base64: bas64Image,
        file_type: image?.type as string,
        question_explanation: (question as string) || undefined,
      });
    }
  };

  useLayoutEffect(() => {
    if (!examType || !taskNumber) {
      push("/");
    }
  }, [examType, taskNumber]);

  return {
    file: image,
    text: question,
    isTextAndImageChecked,
    showModal,
    uploadResponse,
    isPending,
    editMode,

    setEditMode,
    handleFileChange,
    handleTextChange,
    handleTextAndImageCheckedChange,
    handleNext,
    setShowModal,
    handleGenerateQuestion,
    setUploadResponse,
  };
};

export default useAddQuestion;
