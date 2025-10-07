import { create } from "zustand";

interface Writing {
  step: number;
  path: "ac" | "ge" | undefined;
  taskNumber: number | undefined;
  file: File | undefined;
  customQuestion: string | undefined;
  answer: string | undefined;
  questionType: "own" | "choose" | undefined;

  setPath: (path: "ac" | "ge") => void;
  setTaskNumber: (task: number) => void;
  setFile: (file: File) => void;
  setQustomQuestion: (ques: string) => void;
  setAnswer: (answer: string) => void;
  setStep: (step: number) => void;
  setQuestionType: (type: "own" | "choose") => void;
}

export const useWritingStore = create<Writing>((set) => ({
  step: 1,
  path: undefined,
  taskNumber: undefined,
  file: undefined,
  customQuestion: undefined,
  answer: undefined,
  questionType: undefined,

  setPath: (path) => set({ path: path }),
  setTaskNumber: (task) => set({ taskNumber: task }),
  setFile: (file) => set({ file: file }),
  setQustomQuestion: (question) => set({ customQuestion: question }),
  setAnswer: (answer) => set({ answer: answer }),
  setStep: (step) => set({ step: step }),
  setQuestionType: (type) => set({ questionType: type }),
}));
