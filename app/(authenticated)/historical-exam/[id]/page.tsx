"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { examService } from "@/services/exam.service";
import { HistoricalExam } from "@/types/historical-exam";
import { toast } from "sonner";
import { Button } from "@/components/atom/button";
import { MapIcon } from "@/assets/icons/MapIcon";
import { ReadingIcon } from "@/assets/icons/ReadingIcon";
import { ListeningIcon } from "@/assets/icons/ListeningIcon";
import { SpeakingIcon } from "@/assets/icons/SpeakingIcon";
import { PenIcon } from "@/assets/icons";
import Loader from "@/components/molecules/loader";
import { PrivateRouteEnum } from "@/enum/routes.enum";
import { useChatStore } from "@/store/chat.store";
import { useQuestionOrImageStore } from "@/store/questionOrImage.store";
import { baseApi } from "@/api/api";
import { EndpointEnum } from "@/enum/endpoints.enum";
import { mapExamTypeToBackend } from "@/utils/helpFunctions";

const HistoricalExamDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  // Handle params.id which could be string, string[], or undefined
  const examIdParam = params?.id;
  const examId = Array.isArray(examIdParam) ? examIdParam[0] : examIdParam;
  const [exam, setExam] = useState<HistoricalExam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContinuing, setIsContinuing] = useState(false);
  const { setChatQuestion, setPrevPayload, setGeneratedQuestion, resetIsFirstAnswerOfChallenge, setIsFirstAnswerOfChallenge } = useChatStore();
  const { setExamType, setTaskNumber, setQuestionChoice, setQuestion, setImage, setUploadResponse } = useQuestionOrImageStore();

  useEffect(() => {
    if (!examId) {
      toast.error("Exam ID is missing");
      router.push(PrivateRouteEnum.dashboard);
      return;
    }

    const numericId = Number(examId);
    if (isNaN(numericId)) {
      toast.error("Invalid exam ID");
      router.push(PrivateRouteEnum.dashboard);
      return;
    }
    
    const fetchExam = async () => {
      try {
        setIsLoading(true);
        const examData = await examService.getHistoricalExamById(numericId);
        setExam(examData);
      } catch (error: any) {
        toast.error(error?.detail || error?.message || "Failed to load exam details");
        router.push(PrivateRouteEnum.dashboard);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
  }, [examId, router]);

  const handleContinuePractice = async () => {
    if (!examId) return;

    try {
      setIsContinuing(true);
      
      // Fetch challenge data for this exam
      const challengesResponse = await baseApi.get(EndpointEnum.challenges);
      const challenges = challengesResponse.data;
      
      // Find the challenge that matches this exam
      // The challenge data has practice_id that should match the exam id
      const challenge = Array.isArray(challenges) 
        ? challenges.find((c: any) => {
            // Match by practice_id (string) to exam id (number)
            const practiceIdMatch = c.practice_id && String(c.practice_id) === String(examId);
            // Or match by id if practice_id is not available
            const idMatch = c.id && String(c.id) === String(examId);
            return practiceIdMatch || idMatch;
          })
        : null;

      if (!challenge) {
        toast.error("No active challenge found for this exam. Please start a new practice session.");
        setIsContinuing(false);
        return;
      }

      // Check if exam is already completed (has final_answer)
      // If exam is completed, we shouldn't allow continuing
      if (exam?.final_answer) {
        toast.info("This exam has been completed. Please start a new practice session.");
        setIsContinuing(false);
        return;
      }

      // Restore chat state from challenge data
      const chatQuestionData: any = {
        challenge: challenge.challenge || "",
        generated_exercise: challenge.exercise_question || "",
        current_feedback: challenge.current_feedback || "NA",
        motivational_text: challenge.motivational_text || "",
        challenge_completion: challenge.completion === 1 ? 1 : 0,
        practice_completion: challenge.completion === 1 ? 1 : 0,
        wrong_answer: 0,
      };

      setChatQuestion(chatQuestionData);

      // Determine exam type from skill
      const skillToExamType: Record<string, string> = {
        writing: "writing",
        reading: "reading",
        listening: "listening",
        speaking: "speaking",
      };
      const skillLower = (exam?.skill || "writing").toLowerCase();
      const examType = mapExamTypeToBackend(skillToExamType[skillLower] || "writing");

      // Restore previous payload with challenge data
      setPrevPayload({
        exam_type: examType as any,
        task_number: "1", // Default task number
        answer_text: challenge.user_input || "",
        image_path: "",
        imageAndText: "0",
        manualQues: challenge.exercise_question || "",
        challenge_detection: "1",
        primary_feedback: "0",
        mode: challenge.mode?.toString() || "1",
        first_round: challenge.first_round?.toString() || "0",
        user_input: challenge.user_input || "",
        answer_file_base64: false,
        answer_file_type: undefined,
        left_without_completing: challenge.left_without_completing?.toString() || "0",
        completion: challenge.completion?.toString() || "0",
        challenge_round: challenge.next_challenge || 1,
      });

      // Set question store
      setExamType(examType as any);
      setTaskNumber(1);
      setQuestionChoice(1);
      setQuestion(challenge.exercise_question || "");
      setImage(undefined);
      setUploadResponse(undefined);

      // Set first answer counter based on challenge data
      // If first_round is 0, this is not the first round, so set counter > 1
      // If first_round is 1, this is the first round, so set counter to 1
      if (challenge.first_round === 0) {
        setIsFirstAnswerOfChallenge(2); // Not first round, so next answer will be treated as not first
      } else {
        resetIsFirstAnswerOfChallenge(); // First round, reset to 1
      }

      // Navigate to practice chat
      router.push(PrivateRouteEnum.chat);
    } catch (error: any) {
      toast.error(error?.detail || error?.message || "Failed to continue practice");
      setIsContinuing(false);
    }
  };

  const getSkillIcon = (skill: string | null | undefined) => {
    const normalizedSkill = (skill ?? "").toLowerCase();
    if (normalizedSkill === "reading") {
      return <ReadingIcon className="w-6 text-[#23085A]" />;
    }
    if (normalizedSkill === "writing") {
      return <PenIcon className="w-5 h-5 text-[#23085A]" />;
    }
    if (normalizedSkill === "listening") {
      return <ListeningIcon className="w-6 text-[#23085A]" />;
    }
    if (normalizedSkill === "speaking") {
      return <SpeakingIcon className="w-6 h-6 text-[#23085A]" />;
    }
    return null;
  };

  const getScoreDisplay = (score: HistoricalExam["score"]) => {
    const parsedScore = typeof score === "number" ? score : Number.parseFloat(score);
    if (Number.isFinite(parsedScore)) {
      return parsedScore.toFixed(1);
    }
    if (typeof score === "string") {
      return score;
    }
    return "--";
  };

  const handleOpenLink = (url?: string | null, fallbackMessage?: string) => {
    if (!url) {
      toast.error(fallbackMessage ?? "Link not available yet.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader size={60} color="text-primary" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600 mb-4">Exam not found</p>
          <Button
            onClick={() => router.push(PrivateRouteEnum.dashboard)}
            className="bg-[#23085A] text-white"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const hasFinalAnswer = Boolean(exam.final_answer);
  const hasReport = Boolean(exam.full_report_url);
  const isCompleted = hasFinalAnswer;
  const scoreDisplay = getScoreDisplay(exam.score);
  const skillIcon = getSkillIcon(exam.skill);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Format datetime for display
  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Parse and check if final_answer is a challenge structure
  const parseFinalAnswer = (finalAnswer: string | null | undefined) => {
    if (!finalAnswer) return null;
    
    // If it's already an object, check directly
    if (typeof finalAnswer === 'object' && finalAnswer !== null) {
      if ('challenge' in finalAnswer || 'generated_exercise' in finalAnswer || 'motivational_text' in finalAnswer) {
        return {
          isChallenge: true,
          data: finalAnswer,
        };
      }
      return {
        isChallenge: false,
        data: JSON.stringify(finalAnswer, null, 2),
      };
    }
    
    // If it's a string, try to parse as JSON
    if (typeof finalAnswer === 'string') {
      try {
        const parsed = JSON.parse(finalAnswer);
        
        // Check if it has the challenge structure
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          ('challenge' in parsed || 'generated_exercise' in parsed || 'motivational_text' in parsed)
        ) {
          return {
            isChallenge: true,
            data: parsed,
          };
        }
      } catch {
        // Not JSON, treat as plain text
      }
    }
    
    return {
      isChallenge: false,
      data: finalAnswer,
    };
  };

  const finalAnswerParsed = parseFinalAnswer(exam.final_answer);

  return (
    <div className="w-full min-h-screen bg-[#F0F0F0] p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <Button
          onClick={() => router.push(PrivateRouteEnum.dashboard)}
          variant="ghost"
          className="mb-6 text-[#23085A] hover:text-[#1a0643] flex items-center gap-2"
        >
          <span>←</span> Back to Dashboard
        </Button>

        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-[#F4EFFF] shadow-[0px_8px_24px_rgba(35,8,90,0.08)] p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 rounded-full bg-[#F4EFFF] px-4 py-2 text-[#23085A]">
                  {skillIcon}
                  <span className="text-sm font-semibold capitalize">{exam.skill ?? "N/A"}</span>
                </div>
                <span className="text-sm text-slate-500">ID: {exam.id}</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#23085A] mb-2">
                {exam.topic}
              </h1>
              <p className="text-base text-slate-600">
                <span className="font-medium">Date:</span> {formatDate(exam.date)}
              </p>
            </div>
            <div className="rounded-2xl border border-[#F4EFFF] bg-gradient-to-br from-[#EFECF5] to-[#F4EFFF] px-6 py-5 min-w-[140px] text-center">
              <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-2">Score</p>
              <p className="text-4xl md:text-5xl font-bold text-[#23085A]">{scoreDisplay ?? "--"}</p>
              <p className="text-xs text-slate-500 mt-1">Band result</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isCompleted 
                ? "bg-green-100 text-green-700" 
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {isCompleted ? "✓ Completed" : "⏳ In Progress"}
            </div>
          </div>
        </div>

        {/* Exam Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Exam Information Card */}
          <div className="bg-white rounded-2xl border border-[#F4EFFF] shadow-[0px_4px_12px_rgba(35,8,90,0.08)] p-6">
            <h2 className="text-lg font-bold text-[#23085A] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#23085A] rounded"></span>
              Exam Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Topic</p>
                <p className="text-base font-medium text-slate-800">{exam.topic}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Skill</p>
                <div className="flex items-center gap-2">
                  {skillIcon}
                  <p className="text-base font-medium text-slate-800 capitalize">{exam.skill}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Date Taken</p>
                <p className="text-base font-medium text-slate-800">{formatDate(exam.date)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Score</p>
                <p className="text-2xl font-bold text-[#23085A]">{scoreDisplay ?? "--"}</p>
              </div>
            </div>
          </div>

          {/* Timestamps Card */}
          <div className="bg-white rounded-2xl border border-[#F4EFFF] shadow-[0px_4px_12px_rgba(35,8,90,0.08)] p-6">
            <h2 className="text-lg font-bold text-[#23085A] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#23085A] rounded"></span>
              Timestamps
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Created At</p>
                <p className="text-sm font-medium text-slate-800">{formatDateTime(exam.created_at)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-slate-800">{formatDateTime(exam.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Answer / Evaluation Section */}
        {exam.final_answer && finalAnswerParsed && (
          <div className="bg-white rounded-2xl border border-[#F4EFFF] shadow-[0px_8px_24px_rgba(35,8,90,0.08)] p-6 md:p-8 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#23085A] mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-[#23085A] rounded"></span>
              {finalAnswerParsed.isChallenge ? "Challenge Details" : "Evaluation & Feedback"}
            </h2>
            
            {finalAnswerParsed.isChallenge ? (
              // Challenge structure display
              <div className="space-y-6">
                {finalAnswerParsed.data.challenge && (
                  <div className="bg-[#F3F6FF] rounded-xl border border-[#C6D4EF] p-5 md:p-6">
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-2 font-semibold">Challenge</p>
                    <p className="text-base md:text-lg font-semibold text-[#23085A]">
                      {finalAnswerParsed.data.challenge}
                    </p>
                  </div>
                )}

                {finalAnswerParsed.data.generated_exercise && (
                  <div className="bg-[#F8F9FB] rounded-xl border border-[#E0E0E0] p-5 md:p-6">
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-3 font-semibold">Exercise Question</p>
                    <p className="text-base md:text-lg leading-relaxed text-slate-800 whitespace-pre-wrap">
                      {finalAnswerParsed.data.generated_exercise}
                    </p>
                  </div>
                )}

                {finalAnswerParsed.data.current_feedback && (
                  <div className="bg-[#FFF9E6] rounded-xl border border-[#FFE082] p-5 md:p-6">
                    <p className="text-xs uppercase tracking-wide text-slate-600 mb-3 font-semibold">Current Feedback</p>
                    <p className="text-base md:text-lg leading-relaxed text-slate-800 whitespace-pre-wrap">
                      {finalAnswerParsed.data.current_feedback}
                    </p>
                  </div>
                )}

                {finalAnswerParsed.data.motivational_text && (
                  <div className="bg-gradient-to-r from-[#EFECF5] to-[#F4EFFF] rounded-xl border border-[#E0D3FF] p-5 md:p-6">
                    <p className="text-xs uppercase tracking-wide text-slate-600 mb-3 font-semibold">Motivational Message</p>
                    <p className="text-base md:text-lg leading-relaxed text-[#23085A] whitespace-pre-wrap">
                      {finalAnswerParsed.data.motivational_text}
                    </p>
                  </div>
                )}

                {/* Challenge Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Challenge Status</p>
                    <p className={`text-sm font-semibold ${
                      finalAnswerParsed.data.challenge_completion === 1 
                        ? "text-green-600" 
                        : "text-yellow-600"
                    }`}>
                      {finalAnswerParsed.data.challenge_completion === 1 ? "✓ Completed" : "⏳ In Progress"}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg border border-[#E0E0E0] p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Practice Status</p>
                    <p className={`text-sm font-semibold ${
                      finalAnswerParsed.data.practice_completion === 1 
                        ? "text-green-600" 
                        : finalAnswerParsed.data.practice_completion === -1
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}>
                      {finalAnswerParsed.data.practice_completion === 1 
                        ? "✓ Completed" 
                        : finalAnswerParsed.data.practice_completion === -1
                        ? "⏳ In Progress"
                        : "Not Started"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Plain text display
              <div className="prose prose-slate max-w-none">
                <div className="bg-[#F8F9FB] rounded-xl border border-[#E0E0E0] p-6 md:p-8">
                  <p className="text-base md:text-lg leading-relaxed text-slate-800 whitespace-pre-wrap">
                    {finalAnswerParsed.data as string}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {!isCompleted && (
            <Button
              onClick={handleContinuePractice}
              disabled={isContinuing}
              className="w-full sm:w-auto bg-[#C3002F] text-white hover:bg-[#a00025] h-[48px] text-base rounded-xl font-semibold"
            >
              {isContinuing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size={20} color="text-white" />
                  Loading...
                </span>
              ) : (
                "Continue Practice"
              )}
            </Button>
          )}

          {hasReport && (
            <Button
              onClick={() => handleOpenLink(exam.full_report_url, "Full report not available yet.")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#23085A] text-white hover:bg-[#1a0643] h-[48px] text-base rounded-xl font-semibold"
            >
              View Full Report
              <MapIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoricalExamDetailPage;

