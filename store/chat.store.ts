import { create } from "zustand";

interface Payload {
  exam_type: "ac" | "ge";
  task_number: string;
  answer_text: string;
  image_path: string;
  imageAndText: "1" | "0";
  manualQues: string;
  challenge_detection: "1" | "0";
  primary_feedback: "1" | "0";
  mode: "0" | "1";
  first_round: "1" | "0";
  user_input: string;
  answer_file_base64: string | boolean;
  answer_file_type: string | undefined;
  left_without_completing?: string;
  next_challenge?: string;
  completion?: string;
  challenge_round?: number;
}

interface GeneratedQuestion {
  file?: string | File;
  text?: string;
  answer?: string;
  answerFile?: string | File;
}
interface Chat {
  chat_question?: string | Record<string | number, any>;
  prev_payload: Payload | undefined;
  generatedQuestion: GeneratedQuestion | undefined;
  isFirstAnswerOfChallenge: number;

  setChatQuestion: (ques: string | Record<string | number, any>) => void;
  setPrevPayload: (payload: Payload | undefined) => void;
  setGeneratedQuestion: (ques: GeneratedQuestion | undefined) => void;
  setIsFirstAnswerOfChallenge: (value: number) => void;
  incrementIsFirstAnswerOfChallenge: () => void;
  resetIsFirstAnswerOfChallenge: () => void;
}

export const useChatStore = create<Chat>((set) => ({
  chat_question: "",
  prev_payload: undefined,
  generatedQuestion: undefined,
  isFirstAnswerOfChallenge: 1,

  setChatQuestion: (ques) => set({ chat_question: ques }),
  setPrevPayload: (ques) => set({ prev_payload: ques }),
  setGeneratedQuestion: (ques) => set({ generatedQuestion: ques }),
  setIsFirstAnswerOfChallenge: (value) => set({ isFirstAnswerOfChallenge: value }),
  incrementIsFirstAnswerOfChallenge: () => set((state) => ({ 
    isFirstAnswerOfChallenge: state.isFirstAnswerOfChallenge + 1 
  })),
  resetIsFirstAnswerOfChallenge: () => set({ isFirstAnswerOfChallenge: 1 }),
}));
