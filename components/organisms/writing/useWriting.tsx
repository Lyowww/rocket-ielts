"use client";
import { useWritingStore } from "@/store/writing.store";
import { useCallback, useEffect } from "react";

const useWriting = () => {
  const {
    step,
    setStep,
    setPath,
    file,
    customQuestion,

    setTaskNumber,
    setQuestionType,
    questionType,
    setFile,
    setQustomQuestion,
  } = useWritingStore();

  const handleChangeStep = useCallback((cur: number) => {
    setStep(cur);
  }, []);

  const handleChoosePath = (path: "ac" | "ge") => {
    setPath(path);
    handleChangeStep(2);
  };

  const handleChooseTask = (task: number) => {
    setTaskNumber(task);
    handleChangeStep(3);
  };

  const handleChooseQuestionType = (question: "own" | "choose") => {
    setQuestionType(question);
    handleChangeStep(4);
  };

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleQuestiontextChange = useCallback((txt: string) => {
    setQustomQuestion(txt);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "white";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return {
    step,
    questionType,
    customQuestion,
    file,

    handleChangeStep,
    handleChoosePath,
    handleChooseTask,
    handleChooseQuestionType,
    handleFileChange,
    handleQuestiontextChange,
  };
};

export default useWriting;
