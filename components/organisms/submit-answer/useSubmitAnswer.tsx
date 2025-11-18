"use client";
import { PrivateRouteEnum } from "@/enum/routes.enum";
import { chatService } from "@/services/chat.service";
import { questionService } from "@/services/question.service";
import { useChatStore } from "@/store/chat.store";
import { useQuestionOrImageStore } from "@/store/questionOrImage.store";
import { fileToBase64 } from "@/utils/helpFunctions";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

const useSubmitAnswer = () => {
  const requestCountRef = useRef(0);
  const isFirstAnswer = useRef<number>(1);
  const lastFetchKeyRef = useRef<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { setChatQuestion, setPrevPayload, setGeneratedQuestion, incrementIsFirstAnswerOfChallenge } =
    useChatStore();
  const { image, question, setAnswerimage, setShortQuestion, shortQuestion, examType,
    taskNumber,
    questionChoice,
    answerImage,
    uploadResponse } =
    useQuestionOrImageStore();
  const { push } = useRouter();

  const { mutate, isPending, data } = useMutation({
    mutationKey: ["get_questions"],
    mutationFn: (data: { exam_type: string; task_number: string }) =>
      questionService.getQuestions(data),
  });


  const { mutate: chatQuestion, isPending: get_chat_questions_pending } =
    useMutation({
      mutationKey: ["get_chat_questions"],
      mutationFn: (data: SubmitQuestionPayload) =>
        chatService.getChatQuestion(data),
      onSuccess: async (ques) => {
        if (ques?.answer) {
          const base64File = image ? await fileToBase64(image) : "";
          const answerFileBase64 = answerImage
            ? await fileToBase64(answerImage)
            : false;
          setChatQuestion(ques?.answer);
          setPrevPayload({
            exam_type: examType ?? "writing",
            task_number: String(questionChoice),
            answer_text: answer,
            image_path:
              (data?.question_path as string) || (base64File as string),
            imageAndText: image && question ? "1" : "0",
            manualQues: question as string,
            challenge_detection: "1",
            primary_feedback: "1",
            challenge_round:requestCountRef.current + 1,
            mode: "0",
            first_round: "1",
            user_input: "",
            answer_file_base64: answerFileBase64,
            answer_file_type: answerImage?.type,
            left_without_completing: "0",
            completion: "1"
          });
          push(PrivateRouteEnum.chat);
        }
      },
    });

  const {
    mutate: submitAnswer,
    isPending: submitPending,
    data: results,
  } = useMutation({
    mutationKey: ["submit-answer"],
    mutationFn: (data: SubmitQuestionPayload) =>
      questionService.submitAnswer(data),
    onSuccess: (data: any) => {
      setShowAlert(false);
      setShowResults(true);
      setError("");
      if (requestCountRef.current === 1) {
      setShortQuestion({
        results: data?.results,
        scores: {
          overall_score:
            data?.overall_score?.['overall_score:'] ??
            data?.overall_score?.['overall_score'] ??
            data?.scores?.["Overall Current Writing Band"] ??
            data?.overall_score ??
            '',
        },
        answer: data?.answer,
      });

      }
    },
    onError: () => {
      setShowAlert(true);
      setError("Something went wrong");
    },
  });

  const handleChangeAnswer = useCallback((txt: string) => {
    setAnswer(txt);
  }, []);

  const wordCount = useMemo(
    () => answer.trim().split(/\s+/).filter(Boolean).length,
    [answer]
  );
  const minWords = questionChoice === 1 ? 150 : 250;

  const isBelowMin = wordCount < minWords;

  const handleFileChange = async (files: FileList | null) => {
    if (files && files.length > 0) {
      setAnswerimage(files[0]);
    }
  };

  const handleRemoveUploadedAnswers = () => {
    setAnswerimage(undefined);
  };

  const handleSubmit = async () => {
    const base64File = image ? await fileToBase64(image) : "";
    const answerFileBase64 = answerImage ? await fileToBase64(answerImage) : "";
    if (!answer.trim() && !answerFileBase64) {
      toast.error("Answer cannot be empty.");
    }
    
    const payload: SubmitQuestionPayload = {
      exam_type: examType ?? "writing",
      task_number: String(questionChoice),
      answer_text: answer,
      image_path: (data?.question_path as string) || (base64File as string),
      imageAndText: image && question ? "1" : "0",
      manualQues: question as string,
      challenge_detection: "1",
      mode:  isFirstAnswer.current === 1 ? "0" : "1",
      first_round: isFirstAnswer.current === 1 ? "1" : "0",
      left_without_completing: "0",
      completion: "1",
      user_input: questionChoice && questionChoice > 1 ? answer : "",
      challenge_round: 1,
    };
    isFirstAnswer.current += 1;
    incrementIsFirstAnswerOfChallenge();

    if (answerFileBase64) {
      payload.answer_file_base64 = answerFileBase64;
      payload.answer_file_type = answerImage?.type;
    }

    requestCountRef.current += 1;
    submitAnswer(payload);
  };


  const getChatQuestionMutation = async () => {
    const base64File = image ? await fileToBase64(image) : "";
    const answerFileBase64 = answerImage
      ? await fileToBase64(answerImage)
      : false;

    const payload: SubmitQuestionPayload = {
      exam_type: examType ?? "writing",
      task_number: String(questionChoice),
      answer_text: answer,
      image_path: (data?.question_path as string) || (base64File as string),
      imageAndText: image && question ? "1" : "0",
      manualQues: question as string,
      challenge_detection: "1",
      mode: "1",
      left_without_completing: "0",
      completion: "1",
      first_round: "1",
      user_input: "",
      challenge_round:  1,
    };

    if (answerFileBase64) {
      payload.answer_file_base64 = answerFileBase64;
      payload.answer_file_type = answerImage?.type;
    }
    setGeneratedQuestion({
      file: data?.question || image || undefined,
      text: uploadResponse,
      answer: answer,
      answerFile: answerImage,
    });
    chatQuestion(payload);
  };

  useEffect(() => {
    if (!examType || !taskNumber) return;
    if (image || question) return;
    const key = `${examType}-${questionChoice}`;
    if (lastFetchKeyRef.current === key) return;
    lastFetchKeyRef.current = key;
    mutate({
      exam_type: examType,
      task_number: String(questionChoice),
    });
  }, [examType, taskNumber, image, question, questionChoice, mutate]);

  useLayoutEffect(() => {
    if (!examType || !taskNumber) {
      push("/");
    }
  }, [examType, taskNumber, push]);

  return {
    image,
    question,
    answer,
    data,
    taskNumber,
    isPending,
    submitPending,
    results,
    showAlert,
    showResults,
    uploadResponse,
    shortQuestion,
    isFirstAnswer,
    enableLongDescription: requestCountRef.current === 2,
    wordCount,
    isBelowMin,
    answerImage,
    get_chat_questions_pending,
    setShowAlert,
    handleFileChange,
    handleChangeAnswer,
    handleSubmit,
    handleRemoveUploadedAnswers,
    getChatQuestionMutation,
    error,
    setError,
  };
};

export default useSubmitAnswer;
