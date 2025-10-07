import { create } from "zustand";

type ShortQuestionData = {
  results: string;
  scores: {

    overall_score: number;
  };
  answer: string;
};

interface questionOrImageP {
  examType: "ac" | "ge" | undefined;
  taskNumber: number | undefined;
  questionChoice: number | undefined;
  question: string | undefined;
  testType: string | undefined;
  uploadResponse: string | undefined;
  answerImage: File | undefined;
  image: File | undefined;
  shortQuestion: ShortQuestionData | undefined;
  setQuestion: (txt: string | undefined) => void;
  setImage: (img: File | undefined) => void;
  setExamType: (exam: "ac" | "ge") => void;
  setTaskNumber: (task: number) => void;
  setQuestionChoice: (ques: number) => void;
  setTestType: (test: string) => void;
  setUploadResponse: (txt: string | undefined) => void;
  setAnswerimage: (img: File | undefined) => void;
  setShortQuestion: (data: ShortQuestionData) => void;
}

export const useQuestionOrImageStore = create<questionOrImageP>((set) => ({
  examType: undefined,
  taskNumber: undefined,
  questionChoice: undefined,
  question: undefined,
  testType: undefined,
  uploadResponse: undefined,
  image: undefined,
  answerImage: undefined,
  shortQuestion: undefined,
  setExamType: (exam) => set({ examType: exam }),
  setQuestion: (txt) => set({ question: txt }),
  setImage: (img) => set({ image: img }),
  setTaskNumber: (task) => set({ taskNumber: task }),
  setQuestionChoice: (ques) => set({ questionChoice: ques }),
  setTestType: (test) => set({ testType: test }),
  setUploadResponse: (txt) => set({ uploadResponse: txt }),
  setAnswerimage: (img) => set({ answerImage: img }),
  setShortQuestion: (data) => set({ shortQuestion: data }),
}));
