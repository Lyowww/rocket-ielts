"use client";
import { chatService } from "@/services/chat.service";
import { useChatStore } from "@/store/chat.store";
import { mapExamTypeToBackend } from "@/utils/helpFunctions";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Message = {
  role: "system" | "user" | "evaluation";
  text: string | Record<string, any>;
};

const useChat = (firstRound: React.RefObject<number>,isFirstFeedback:React.RefObject<number>) => {
  const pathname = usePathname();
  const { push } = useRouter();

  const [answer, setAnswer] = useState("");
  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { chat_question, prev_payload, generatedQuestion, setPrevPayload, setChatQuestion, isFirstAnswerOfChallenge, incrementIsFirstAnswerOfChallenge } = useChatStore();

  const { mutate, isPending } = useMutation({
    mutationKey: ["submit-chat-answer"],
    mutationFn: (data: SubmitQuestionPayload) =>
      chatService.answerChatQuestion(data),
    onSuccess: (res, data) => {
      setMessages((prev) => [
        ...prev,
        { role: "evaluation", text: res?.answer ?? "No response" },
      ]);
      setPrevPayload({
        exam_type: mapExamTypeToBackend(data.exam_type) as any,
        task_number: data.task_number,
        answer_text: data.answer_text,
        image_path: data.image_path,
        imageAndText: data.imageAndText as "0" | "1",
        manualQues: typeof chat_question === 'object' ? chat_question.generated_exercise : chat_question,
        challenge_detection: data.challenge_detection as "0" | "1",
        primary_feedback: "0",
        mode: data.mode as "0" | "1",
        first_round: data.first_round as "0" | "1",
        user_input: data.user_input as string,
        answer_file_base64: data.answer_file_base64 as string | boolean,
        answer_file_type: data.answer_file_type,
        left_without_completing: data.left_without_completing,
        // next_challenge: data.next_challenge,
        challenge_round: data.challenge_round,
        completion: data.completion,
      });
      // --- Ensure chat_question is updated with the latest response ---
      if (res && res.answer && typeof res.answer === 'object') {
        setChatQuestion(res.answer);
      } else if (res && typeof res === 'object') {
        setChatQuestion(res);
      } else {
        setChatQuestion({});
      }
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });


  useEffect(() => {
    if (chat_question) {
      setMessages([{ role: "system", text: chat_question }]);
    }
  }, [chat_question]);

  const handleTextChange = useCallback((txt: string) => {
    setAnswer(txt);
  }, []);

  const handleSend = async (challengeRound?: number, forceSend = false) => {
    if (!answer.trim() && !forceSend) return;

    
    setMessages((prev) => [...prev, { role: "user", text: answer }]);
    firstRound.current += 1;
    isFirstFeedback.current += 1
    
    mutate({
      ...(prev_payload as SubmitQuestionPayload),
      user_input: answer,
      mode: "1",
      first_round: isFirstAnswerOfChallenge === 1 ? "1" : "0",
      challenge_round: challengeRound,
    });
    setAnswer("");
    incrementIsFirstAnswerOfChallenge();

  };

  const handleFirstRoundSend = (challengeRound?: number) => {
    handleSend(challengeRound, true);
  };

  useEffect(() => {
    if (pathname === "/practice-chat") {
      document.body.style.backgroundColor = "#F0F0F0";
      document.body.style.overflow = "auto";
    } else {
      document.body.style.backgroundColor = "";
    }
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.overflow = "auto";
    };
  }, [pathname]);

  useEffect(() => {
    if (!prev_payload || !chat_question) {
      push("/");
    }
  }, [chat_question, prev_payload, push]);

  return {
    answer,
    handleTextChange,
    handleSend,
    handleFirstRoundSend,
    messages,
    isPending,
    generatedQuestion,
    showQuestion,
    setShowQuestion,
    showAnswer,
    setShowAnswer,
    chatPrevPayload: prev_payload,
  };
};

export default useChat;
