import { testSchema } from "@/schema/test.schema";
import { authService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FileText, Headphones, Mic, PenLine } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Cookies from "js-cookie";
import { PrivateRouteEnum, PublicRoutesEnum } from "@/enum/routes.enum";
import { useRouter } from "next/navigation";
import { useQuestionOrImageStore } from "@/store/questionOrImage.store";
import { ExamCategory } from "@/types/exam";

type TestSchemaType = z.infer<typeof testSchema>;

const useKnowYourScore = () => {
  const {
    setExamType,
    setTaskNumber,
    setQuestionChoice,
    setTestType,
    setImage,
    setQuestion,
    setUploadResponse,
    setAnswerimage,
  } = useQuestionOrImageStore();
  const [selectedTab, setSelectedTab] = useState<string>("Writing");
  const { push } = useRouter();

  const tabs = [
    {
      id: 1,
      title: "Writing",
      icon: <PenLine />,
    },
    {
      id: 2,
      title: "Reading",
      icon: <FileText />,
    },

    {
      id: 3,
      title: "Listening",
      icon: <Headphones />,
    },
    {
      id: 4,
      title: "Speaking",
      icon: <Mic />,
    },
  ];

  const pathData = [
    {
      id: 1,
      title: "Academic",
    },
    {
      id: 2,
      title: "General",
    },
  ];

  const taskData = [
    {
      id: 1,
      title: "Task 1",
    },
    {
      id: 2,
      title: "Task 2",
    },
  ];

  const questionData = [
    {
      id: 1,
      title: "I have my own question",
    },
    {
      id: 2,
      title: "Create a test automatically",
    },
  ];
  const { mutate, isPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: () =>
      authService.logOut({ refresh: Cookies.get("refresh_token")! }),
    onSuccess: () => {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("sessionCode");

      window.location.href = PublicRoutesEnum.access;
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TestSchemaType>({
    mode: "onSubmit",
    resolver: zodResolver(testSchema),
    defaultValues: {
      path: "",
      task: "",
      question: "",
    },
  });

  const handleFormSubmit = (data: TestSchemaType) => {
    const updatedData = {
      ...data,
      category: selectedTab,
    };
    setExamType(updatedData.category.toLowerCase() as ExamCategory);
    setTaskNumber(
      updatedData.question === "Create a test automatically" ? 2 : 1
    );
    setQuestionChoice(updatedData.task === "Task 1" ? 1 : 2);
    setTestType(updatedData.category);
    setImage(undefined);
    setAnswerimage(undefined);
    setQuestion(undefined);

    if (updatedData.question === "Create a test automatically") {
      setImage(undefined);
      setUploadResponse(undefined);
      push(PrivateRouteEnum.test);
    } else {
      push(PrivateRouteEnum.uploadQues);
    }
  };

  const handleChangeTab = useCallback((item: string) => {
    setSelectedTab(item);
  }, []);

  const handleLogOut = async () => {
    if (!isPending) {
      mutate();
    }
  };

  return {
    control,
    tabs,
    selectedTab,
    errors,
    pathData,
    taskData,
    questionData,

    handleSubmit,
    handleChangeTab,
    handleFormSubmit,
    handleLogOut,
  };
};

export default useKnowYourScore;
