"use client";
import useChat from "./_services/useChat";
// import { IconSide } from "@/assets/icons";
import { Button } from "@/components/atom/button";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/atom/sheet";
import { useState, useRef, useEffect, useCallback, useMemo, } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/atom/alert-dialog";
import Image from "next/image";
import GlobalModal from "@/components/molecules/GlobalModal";
import { useChatStore } from "@/store/chat.store";
import { useRouter } from "next/navigation";
import Loader from "@/components/molecules/loader";
import useSubmitAnswer from "../submit-answer/useSubmitAnswer";

const Chat = () => {
  const firstRound = useRef<number>(0);
  const isFirstFeedback = useRef<number>(1);
  const { isFirstAnswer } = useSubmitAnswer();
  const { resetIsFirstAnswerOfChallenge } = useChatStore();

  const {
    answer,
    handleTextChange,
    handleSend,
    handleFirstRoundSend,
    messages,
    generatedQuestion,
    showQuestion,
    setShowQuestion,
    showAnswer,
    setShowAnswer,
    isPending,
    chatPrevPayload
  } = useChat(firstRound, isFirstFeedback);

  const [showPreviousModal, setShowPreviousModal] = useState(false);
  const { chat_question } = useChatStore();

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current && messages.length > 2) {
      const scrollEl = scrollAreaRef.current;
      scrollEl.scrollTop = scrollEl.scrollHeight;
    }
  }, [messages]);
  const [showChallengeCompleteModal, setShowChallengeCompleteModal] = useState(false);
  const [showPracticeCompleteModal, setShowPracticeCompleteModal] = useState(false);
  const challengeRound = useRef<number>(1);

  useEffect(() => {
    if (typeof chat_question !== "string" && chat_question?.challenge_completion === 0 && chat_question?.practice_completion === 1) {
      setShowChallengeCompleteModal(true);
      firstRound.current = 0;
      resetIsFirstAnswerOfChallenge();
    } else {
      setShowChallengeCompleteModal(false);
    }
  }, [chat_question, resetIsFirstAnswerOfChallenge]);


  useEffect(() => {
    if (typeof chat_question !== "string" && chat_question?.practice_completion === 1 && chat_question?.challenge_completion === 1) {
      setShowPracticeCompleteModal(true);
      isFirstAnswer.current = 0;
      resetIsFirstAnswerOfChallenge();

    } else {
      setShowPracticeCompleteModal(false);
    }
  }, [chat_question, isFirstAnswer, resetIsFirstAnswerOfChallenge]);

  const router = useRouter();

  const handleNextPractice = useCallback(() => {
    challengeRound.current += 1;
    isFirstFeedback.current += 1;
    resetIsFirstAnswerOfChallenge();
    handleFirstRoundSend(challengeRound.current);

    setShowPracticeCompleteModal(false);
    setShowChallengeCompleteModal(false);
    setShowQuestion(false);
    setShowAnswer(false);
  }, [
    challengeRound,
    handleFirstRoundSend,
    resetIsFirstAnswerOfChallenge,
    setShowPracticeCompleteModal,
    setShowChallengeCompleteModal,
    setShowQuestion,
    setShowAnswer,
  ]);

  const feedbackContent = useMemo(() => {
    if (typeof chat_question !== 'object') return null;

    if (chat_question.current_feedback === "NA" || !chat_question.current_feedback) return null;

    const isWrong = chat_question.wrong_answer === 1;

    const icon = isWrong ? (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.281 14.2198C15.3507 14.2895 15.406 14.3722 15.4437 14.4632C15.4814 14.5543 15.5008 14.6519 15.5008 14.7504C15.5008 14.849 15.4814 14.9465 15.4437 15.0376C15.406 15.1286 15.3507 15.2114 15.281 15.281C15.2114 15.3507 15.1286 15.406 15.0376 15.4437C14.9465 15.4814 14.849 15.5008 14.7504 15.5008C14.6519 15.5008 14.5543 15.4814 14.4632 15.4437C14.3722 15.406 14.2895 15.3507 14.2198 15.281L8.00042 9.06073L1.78104 15.281C1.64031 15.4218 1.44944 15.5008 1.25042 15.5008C1.05139 15.5008 0.860523 15.4218 0.719792 15.281C0.579062 15.1403 0.5 14.9494 0.5 14.7504C0.5 14.5514 0.579062 14.3605 0.719792 14.2198L6.9401 8.00042L0.719792 1.78104C0.579062 1.64031 0.5 1.44944 0.5 1.25042C0.5 1.05139 0.579062 0.860523 0.719792 0.719792C0.860523 0.579062 1.05139 0.5 1.25042 0.5C1.44944 0.5 1.64031 0.579062 1.78104 0.719792L8.00042 6.9401L14.2198 0.719792C14.3605 0.579062 14.5514 0.5 14.7504 0.5C14.9494 0.5 15.1403 0.579062 15.281 0.719792C15.4218 0.860523 15.5008 1.05139 15.5008 1.25042C15.5008 1.44944 15.4218 1.64031 15.281 1.78104L9.06073 8.00042L15.281 14.2198Z"
          fill="#C7002B"
        />
      </svg>
    ) : (
      <span className="text-green-600 text-2xl">✔</span>
    );

    const label = isWrong ? 'Incorrect:' : 'Correct:';

    return (
      <>
        <div className="flex items-center gap-2">
          {icon} {label} <span className="font-normal">Feedback</span>
        </div>
        <div>{chat_question.current_feedback}</div>
      </>
    );
  }, [chat_question]);



  return (
    <>
      {isPending && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "rgba(255,255,255,0.43)" }}
        >

          <Loader size={60} color="text-primary" />
        </div>
      )}
      <div className="w-full min-h-[calc(100vh-100px)] flex flex-row justify-center items-start gap-8 bg-[#F8F9FB] pt-12">
        <div className="flex flex-col gap-6 w-[420px] min-w-[420px]">
          <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow p-6">
            <div className="text-[#6C47FF] font-semibold text-lg mb-2 flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 5C9.0111 5 8.0444 5.29325 7.22215 5.84265C6.39991 6.39206 5.75904 7.17295 5.3806 8.08659C5.00217 9.00022 4.90315 10.0055 5.09608 10.9755C5.289 11.9454 5.76521 12.8363 6.46447 13.5355C7.16373 14.2348 8.05465 14.711 9.02455 14.9039C9.99446 15.0969 10.9998 14.9978 11.9134 14.6194C12.827 14.241 13.6079 13.6001 14.1573 12.7779C14.7068 11.9556 15 10.9889 15 10C15 8.67392 14.4732 7.40215 13.5355 6.46447C12.5979 5.52679 11.3261 5 10 5ZM10 13C9.40666 13 8.82664 12.8241 8.33329 12.4944C7.83994 12.1648 7.45543 11.6962 7.22836 11.1481C7.0013 10.5999 6.94189 9.99667 7.05765 9.41473C7.1734 8.83279 7.45912 8.29824 7.87868 7.87868C8.29824 7.45912 8.83279 7.1734 9.41473 7.05765C9.99667 6.94189 10.5999 7.0013 11.1481 7.22836C11.6962 7.45543 12.1648 7.83994 12.4944 8.33329C12.8241 8.82664 13 9.40666 13 10C13 10.7957 12.6839 11.5587 12.1213 12.1213C11.5587 12.6839 10.7957 13 10 13ZM22 15C22.9889 15 23.9556 14.7068 24.7779 14.1573C25.6001 13.6079 26.241 12.827 26.6194 11.9134C26.9978 10.9998 27.0969 9.99446 26.9039 9.02455C26.711 8.05465 26.2348 7.16373 25.5355 6.46447C24.8363 5.76521 23.9454 5.289 22.9755 5.09608C22.0055 4.90315 21.0002 5.00217 20.0866 5.3806C19.173 5.75904 18.3921 6.39991 17.8427 7.22215C17.2932 8.0444 17 9.0111 17 10C17 11.3261 17.5268 12.5979 18.4645 13.5355C19.4022 14.4732 20.6739 15 22 15ZM22 7C22.5933 7 23.1734 7.17595 23.6667 7.50559C24.1601 7.83524 24.5446 8.30377 24.7716 8.85195C24.9987 9.40013 25.0581 10.0033 24.9424 10.5853C24.8266 11.1672 24.5409 11.7018 24.1213 12.1213C23.7018 12.5409 23.1672 12.8266 22.5853 12.9424C22.0033 13.0581 21.4001 12.9987 20.852 12.7716C20.3038 12.5446 19.8352 12.1601 19.5056 11.6667C19.1759 11.1734 19 10.5933 19 10C19 9.20435 19.3161 8.44129 19.8787 7.87868C20.4413 7.31607 21.2044 7 22 7ZM10 17C9.0111 17 8.0444 17.2932 7.22215 17.8427C6.39991 18.3921 5.75904 19.173 5.3806 20.0866C5.00217 21.0002 4.90315 22.0055 5.09608 22.9755C5.289 23.9454 5.76521 24.8363 6.46447 25.5355C7.16373 26.2348 8.05465 26.711 9.02455 26.9039C9.99446 27.0969 10.9998 26.9978 11.9134 26.6194C12.827 26.241 13.6079 25.6001 14.1573 24.7779C14.7068 23.9556 15 22.9889 15 22C15 20.6739 14.4732 19.4022 13.5355 18.4645C12.5979 17.5268 11.3261 17 10 17ZM10 25C9.40666 25 8.82664 24.8241 8.33329 24.4944C7.83994 24.1648 7.45543 23.6962 7.22836 23.1481C7.0013 22.5999 6.94189 21.9967 7.05765 21.4147C7.1734 20.8328 7.45912 20.2982 7.87868 19.8787C8.29824 19.4591 8.83279 19.1734 9.41473 19.0576C9.99667 18.9419 10.5999 19.0013 11.1481 19.2284C11.6962 19.4554 12.1648 19.8399 12.4944 20.3333C12.8241 20.8266 13 21.4067 13 22C13 22.7957 12.6839 23.5587 12.1213 24.1213C11.5587 24.6839 10.7957 25 10 25ZM22 17C21.0111 17 20.0444 17.2932 19.2222 17.8427C18.3999 18.3921 17.759 19.173 17.3806 20.0866C17.0022 21.0002 16.9031 22.0055 17.0961 22.9755C17.289 23.9454 17.7652 24.8363 18.4645 25.5355C19.1637 26.2348 20.0546 26.711 21.0245 26.9039C21.9945 27.0969 22.9998 26.9978 23.9134 26.6194C24.8271 26.241 25.6079 25.6001 26.1574 24.7779C26.7068 23.9556 27 22.9889 27 22C27 20.6739 26.4732 19.4022 25.5355 18.4645C24.5979 17.5268 23.3261 17 22 17ZM22 25C21.4067 25 20.8266 24.8241 20.3333 24.4944C19.8399 24.1648 19.4554 23.6962 19.2284 23.1481C19.0013 22.5999 18.9419 21.9967 19.0576 21.4147C19.1734 20.8328 19.4591 20.2982 19.8787 19.8787C20.2982 19.4591 20.8328 19.1734 21.4147 19.0576C21.9967 18.9419 22.5999 19.0013 23.1481 19.2284C23.6962 19.4554 24.1648 19.8399 24.4944 20.3333C24.8241 20.8266 25 21.4067 25 22C25 22.7957 24.6839 23.5587 24.1213 24.1213C23.5587 24.6839 22.7957 25 22 25Z" fill="#B20027" />
              </svg>

              You Are Here To Solve The Following Challenge:
            </div>
            <div className="bg-[#F3F6FF] p-3 rounded-lg text-[#23085A] border-b border-b-[#9a9a9a] border-b-2">
              {typeof chat_question !== 'string' && (
                <div>
                  {chat_question?.challenge && <div><b>Challenge:</b> {chat_question?.challenge}</div>}

                </div>
              )}
            </div >
          </div>
          <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow p-6 flex-1 flex flex-col justify-between">
            <div className="text-[#23085A]">
              {typeof chat_question !== 'string' && chat_question?.motivational_text && chat_question.motivational_text !== "NA" && <div><b>Motivation:</b> {chat_question.motivational_text}</div>}            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-[650px] min-w-[650px] relative">
          <button
            className="text-[#2B3ADD] underline text-base font-medium w-fit  cursor-pointer mb-2 ml-2 hover:text-[#1a237e]"
            onClick={() => setShowPreviousModal(true)}
            style={{ alignSelf: 'flex-start', color: !chatPrevPayload || !chatPrevPayload.manualQues  || chatPrevPayload.manualQues === "PRACTICE COMPLETED!" ? "gray" : "" }}
            disabled={!chatPrevPayload || !chatPrevPayload.manualQues || chatPrevPayload.manualQues === "PRACTICE COMPLETED!"}
          >
            See Previous Exercise
          </button>
          { typeof chat_question !== 'string' && chat_question?.current_feedback !== "NA" && chat_question?.current_feedback !== "PRACTICE COMPLETED!" && chat_question?.current_feedback !== "" ? <div className="bg-[#f8f8f8] rounded-2xl overflow-y border border-[#E0E0E0] shadow p-6 flex flex-col gap-2">
            {feedbackContent} 
          </div> : ""}
          <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow p-6 flex flex-col gap-4 flex-1">
            <div className="font-bold text-2xl text-[#23085A] mb-1">
              {typeof chat_question !== 'string' && chat_question?.generated_exercise && chat_question.generated_exercise !== "NA" && chat_question.generated_exercise !== "PRACTICE COMPLETED!" && <div><b>Question:</b> {chat_question.generated_exercise}</div>}

            </div>
            <div className="mb-1 text-lg font-semibold text-[#23085A]">Your Answer:</div>
            <textarea
              className="w-full min-h-[120px] border border-[#C6D4EF] rounded-lg p-4 text-base text-[#23085A] bg-[#F8F9FB] resize-none"
              placeholder="Type your answer here..."
              value={typeof answer === 'string' ? answer : ''}
              onChange={(e) => handleTextChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(challengeRound.current);
                }
              }}
            />
          </div>

          <div className="flex justify-end">

            <Button className="w-[180px] h-[56px] bg-[#C3002F] text-white text-lg rounded-xl shadow-none mt-3" onClick={() => { handleSend(challengeRound.current); }}>Submit</Button>
          </div>

        </div>
      </div>

      <GlobalModal open={showPreviousModal} onOpenChange={setShowPreviousModal} title={undefined} isNeedBtn>
        <div className="flex flex-col items-center justify-center text-start p-8 min-w-[600px] max-h-[70vh] overflow-y-auto">
          <div className="w-full bg-white rounded-2xl border border-[#E0E0E0] shadow p-6 flex flex-col gap-4 mt-2">
            <div className="mb-1 text-lg font-semibold text-[#23085A]">Previous Exercise Question: {chatPrevPayload?.manualQues !== "PRACTICE COMPLETED!" && chatPrevPayload?.manualQues}</div>
            <div className="bg-[#F8F9FB] border border-[#C6D4EF] rounded-lg p-4 text-base text-[#23085A]">
              {chatPrevPayload  ? chatPrevPayload.user_input : 'No previous question found.'}
            </div>
          </div>
        </div>
      </GlobalModal>

      <GlobalModal
        open={showPracticeCompleteModal}
        onOpenChange={setShowPracticeCompleteModal}
      >
        <div className="flex flex-col items-center justify-center text-center p-8 min-w-[600px] max-h-[70vh] overflow-y-auto">
          <div className="text-2xl font-bold text-center mb-2 flex items-center gap-2">
            Practice Complete!

          </div>
          <div className="text-center text-lg mb-6 text-[#444]">
            You&apos;re one step closer to IELTS success. Let&apos;s <br /> tackle the next one!
          </div>

          <Image src={'https://res.cloudinary.com/duwsak7vc/image/upload/v1753451300/practice_zqrwkd.png'} alt="challenge-complete" width={238} height={241} />
          <div className="flex gap-4 mt-4">
            <Button
              className="w-[200px] h-[56px] bg-[#F3F1FF] text-[#23085A] text-lg rounded-xl border border-[#E0E0E0]"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px' }}
              onClick={() => { router.push('/'); setShowPracticeCompleteModal(false); }}
            >
              Take a New Test
            </Button>

          </div>
        </div>
      </GlobalModal>

      <GlobalModal open={showChallengeCompleteModal}
        onOpenChange={setShowChallengeCompleteModal}
      >
        <div className="flex flex-col items-center justify-center text-center p-8 min-w-[600px] max-h-[70vh] overflow-y-auto">
          <div className="text-2xl font-bold text-center mb-2 flex items-center gap-2">
            Challenge Complete!
            <span role="img" aria-label="celebrate">
              <svg width="32" height="31" viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.1329 1.47052C12.4358 1.16491 13.4203 0.153796 13.7465 0.000835746C14.5785 -0.0431258 14.1647 1.65892 14.2455 2.34836C14.5617 2.56902 16.5456 3.46933 15.7249 4.01518C15.4323 4.20986 14.3916 4.45873 13.9801 4.63107C13.881 5.0115 13.6033 6.28766 13.3332 6.51832C12.9272 6.86491 12.6079 6.26648 12.4148 6.00164C12.1672 5.66187 11.9226 5.31923 11.6673 4.98521C11.2566 4.72282 8.39299 5.96673 9.84117 4.01401C10.0826 3.68839 10.3257 3.36437 10.5501 3.02684C10.393 2.5538 9.52503 1.0738 10.0574 0.824822C10.4153 0.657385 11.6818 1.31223 12.1329 1.47052ZM13.3745 1.47052C12.1657 2.59712 12.4186 2.46077 11.0253 1.94866C11.7344 3.5614 11.4963 2.97585 10.7752 4.2005C11.2221 4.12375 11.701 4.00538 12.1329 4.2005C12.4229 4.49056 12.6712 4.86673 12.9085 5.20182L12.9204 5.16999C13.4776 3.6605 12.9704 4.02486 14.5691 3.52617C12.7673 2.51953 13.5741 2.80501 13.3745 1.47052Z" fill="#C7002B" />
                <path d="M17.1409 12.1896C16.5629 12.2104 16.1822 11.2498 16.0426 10.796C15.5126 9.07266 16.2831 7.6843 17.7385 6.82338C19.6631 5.68475 19.6664 2.79105 17.7973 1.55566C17.4891 1.35192 16.8227 1.16597 17.1273 0.660993C17.2019 0.537305 17.2863 0.489404 17.4221 0.452148C18.3196 0.543691 19.3163 1.78494 19.6699 2.53878C20.4024 4.10032 20.0399 5.98524 18.7573 7.14133C18.0119 7.813 17.2735 7.81353 16.8773 8.93311C16.6228 9.65225 16.7128 10.4586 17.1018 11.1121C17.3015 11.4479 17.8438 11.9362 17.1409 12.1896Z" fill="#C7002B" />
                <path d="M4.89276 5.57183C3.0155 5.74672 2.69596 3.11403 4.48635 2.83344C6.24609 2.67399 6.65324 5.18597 4.89276 5.57183ZM4.57492 3.66924C3.87984 3.88543 4.06792 4.82363 4.76407 4.72954C5.41529 4.48706 5.27447 3.6421 4.57492 3.66924Z" fill="#C7002B" />
                <path d="M5.90332 7.0759C5.95452 6.86716 6.00795 6.73986 6.19721 6.62149C6.64705 6.56316 6.8065 7.00075 7.01322 7.31976L7.59866 8.21645C8.30151 9.27813 9.01938 10.3362 9.69456 11.4153C9.87881 11.7097 9.85028 11.932 9.53627 12.1117C8.9323 12.1852 8.3674 10.9373 8.05435 10.4543L6.77724 8.48842C6.54977 8.13417 6.0202 7.43515 5.90332 7.0759Z" fill="#C7002B" />
                <path d="M20.4603 15.1205C20.2101 15.3547 19.043 16.453 18.9463 15.4707C18.8953 14.9534 20.9003 14.3369 20.5628 12.2413C20.5124 11.9276 20.4026 11.6277 20.3611 11.3106C20.0507 8.93818 21.8243 7.09361 24.1005 6.80355C24.4223 6.76736 26.583 6.8126 26.0194 7.59071C25.7622 7.9457 25.1025 7.66841 24.7388 7.63243C22.7414 7.43519 20.8611 9.2456 21.2008 11.2788C21.4935 13.0313 21.6958 13.4653 20.4603 15.1205Z" fill="#C7002B" />
                <path d="M12.1997 13.9482C11.7852 13.9193 11.7232 13.6853 11.7464 13.3345C11.7869 12.7226 12.2794 8.30243 12.3487 8.16672C12.4105 8.04548 12.5278 8.00982 12.6497 7.97373C12.8724 7.96979 12.9911 8.08188 13.1029 8.26901C13.1085 8.49637 13.0735 8.73077 13.0506 8.95696L12.9036 10.2853C12.7893 11.3488 12.7162 12.4302 12.5598 13.4874C12.5233 13.7346 12.4544 13.8683 12.1997 13.9482Z" fill="#C7002B" />
                <path d="M28.293 10.0364C28.7107 9.66761 29.4939 8.98945 29.959 8.73175C30.6977 8.64394 30.4724 9.38649 30.4135 9.82813L30.2495 11.0678C30.6303 11.2972 31.4893 11.7866 31.8032 12.0767C32.6439 12.8535 30.5362 13.1377 30.097 13.2831C29.983 13.6832 29.7583 15.198 29.4875 15.4181C29.043 15.7791 28.1639 14.2322 27.9602 13.9478L27.8108 13.7343C27.3212 13.737 25.7385 13.9236 25.6504 13.4104C25.5886 13.05 26.5112 12.0852 26.7568 11.7454C26.6709 11.4541 25.4153 9.11463 26.4546 9.31155C26.892 9.39436 27.8156 9.86208 28.293 10.0364ZM29.4987 10.1219C28.3361 11.1354 28.5072 11.0304 27.1391 10.4558C27.9873 12.3082 27.6897 11.5257 26.9075 12.9142C27.3162 12.9116 27.9243 12.8489 28.2929 13.0449C28.5474 13.3278 28.8733 13.7384 29.0424 14.0744C29.4358 12.5037 29.0311 12.7823 30.6223 12.285C30.3154 12.0958 29.4971 11.6779 29.4189 11.3478C29.3445 11.033 29.5836 10.2877 29.4987 10.1219Z" fill="#C7002B" />
                <path d="M1.48884 10.728C1.62712 10.3788 1.90856 9.61885 2.20703 9.43034C2.82665 9.36743 2.99077 10.148 3.23134 10.5863C3.59485 10.6654 4.70007 10.5665 4.73732 11.1179C4.75989 11.4516 4.05469 12.0012 3.84063 12.2626L3.82211 12.2854C3.89684 12.6054 4.14527 13.3866 4.03297 13.6758C3.82477 14.2119 2.88923 13.5458 2.57906 13.4116C2.54478 13.4104 2.51093 13.4107 2.47665 13.4116C2.07961 13.5641 1.31683 14.2836 1.03028 13.8631C0.85135 13.6006 0.983562 12.7832 1.03551 12.4645C0.170539 11.4729 -0.977154 11.115 1.48884 10.728ZM2.36148 10.7909C2.26301 11.0217 2.16818 11.2533 2.07749 11.4873C1.84235 11.515 1.61371 11.5602 1.3823 11.609C1.55931 11.7642 1.73398 11.9076 1.85757 12.1119C1.87236 12.3245 1.86779 12.5299 1.85757 12.7424C2.01276 12.6404 2.27952 12.3997 2.47644 12.4647C2.67571 12.5494 2.8638 12.6444 3.05635 12.7424L2.93361 12.0083C3.09562 11.838 3.25497 11.6677 3.40581 11.4873C3.16992 11.4526 2.91862 11.4325 2.6887 11.3727C2.58246 11.2071 2.49985 10.9195 2.36148 10.7909Z" fill="#C7002B" />
                <path d="M13.4642 16.1648L13.4766 16.1497C14.0405 15.4584 14.814 14.2605 15.7363 14.1668C16.6475 14.1389 17.4396 14.897 17.3777 15.8259C17.3309 16.5299 16.4584 17.4537 15.9179 17.9317C17.0157 18.7581 18.1943 20.1404 18.9851 21.2669C19.9678 22.6667 19.3972 22.5196 18.1144 23.2204L11.732 26.7087C10.153 27.5691 8.57457 28.4326 6.97993 29.264C6.61429 29.4523 4.26634 31.0877 4.59132 29.5931C4.64454 29.3484 4.72298 29.1035 4.78504 28.86L8.13761 15.4124C8.39723 14.4006 8.27397 14.1176 9.46903 14.4273C10.889 14.7955 12.2046 15.4229 13.4642 16.1648ZM15.7363 15.0045C15.3087 15.173 14.5049 16.2061 14.1684 16.6119C14.4805 16.8264 14.7852 17.0466 15.0842 17.2788C15.1461 17.3294 15.2095 17.379 15.2694 17.4323C15.6334 16.9929 16.5792 16.1588 16.5314 15.6455C16.4923 15.2258 16.1397 14.973 15.7363 15.0045ZM9.05826 15.2191C8.90221 15.9101 8.6972 16.5881 8.54083 17.2789C9.50203 20.6282 12.13 22.9706 15.5949 23.5758C16.1234 23.3886 16.653 23.0662 17.1412 22.7892C17.5927 22.5466 18.0485 22.3103 18.496 22.0608C16.6503 19.0433 12.6281 15.9687 9.05826 15.2191ZM8.17264 18.7845C7.90536 19.7355 7.70066 20.7064 7.46733 21.6661C8.03851 23.2778 10.1325 25.4786 11.9322 25.6455C12.357 25.4421 12.7897 25.2126 13.198 24.9779C13.6512 24.7217 14.1017 24.4466 14.5696 24.2185C12.2297 23.6082 9.93961 21.9357 8.70922 19.8432C8.6197 19.6911 8.1967 18.8107 8.17264 18.7845ZM7.12799 22.9597L6.31635 26.2512C6.08313 27.1769 5.83629 28.0999 5.62575 29.0313C5.96382 28.864 6.29134 28.6746 6.62366 28.4964L8.03405 27.7503L9.82998 26.7763C10.1665 26.5954 10.5279 26.4287 10.8403 26.2083C9.59473 25.6721 8.56818 24.8976 7.72887 23.8309C7.57995 23.6415 7.23784 23.0504 7.12799 22.9597Z" fill="#C7002B" />
                <path d="M20.4601 18.931C20.13 18.9918 19.8169 18.7302 19.9522 18.3758C20.0658 18.0788 20.8514 17.5169 21.1092 17.2976L22.6004 16.0228C23.0711 15.6252 24.1261 14.5804 24.6253 14.3662C24.9259 14.3366 25.2499 14.5347 25.1319 14.8821C25.0355 15.166 24.2142 15.7367 23.9748 15.9376L21.1668 18.3555C20.9634 18.5309 20.693 18.8182 20.4601 18.931Z" fill="#C7002B" />
                <path d="M27.8112 20.6282C26.045 20.8416 25.7427 17.934 27.6054 17.9316C27.7929 17.7259 28.3797 18.0255 28.5398 18.1457C29.5604 18.9117 29.0902 20.4688 27.8112 20.6282ZM27.6055 18.6914C26.9049 18.9425 27.0414 19.8709 27.8113 19.7938C28.4711 19.5579 28.34 18.6322 27.6055 18.6914Z" fill="#C7002B" />
              </svg>
            </span>
          </div>
          <div className="text-center text-lg mb-6 text-[#444]">
            You&apos;re one step closer to IELTS success.<br /> Let’s tackle the next one!
          </div>
          <Image src={'https://res.cloudinary.com/duwsak7vc/image/upload/v1753451204/challenge_vrvrfa.png'} alt="challenge-complete" width={258} height={261} />


          <div className="flex gap-4 mt-10">
            <Button
              className="w-[200px] h-[56px] bg-[#F3F1FF] text-[#23085A] text-lg rounded-xl border border-[#E0E0E0]"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px' }}
              onClick={() => { router.push('/'); setShowPracticeCompleteModal(false); }}
            >
              Take a New Test
            </Button>
            <Button
              className="w-[200px] h-[56px] bg-[#C3002F] text-white text-lg rounded-xl"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px' }}
              onClick={() => { handleNextPractice(); setShowPracticeCompleteModal(false); }}
            >
              Next Challenge
            </Button>

          </div>
        </div>
      </GlobalModal>

      <div className="lg:hidden block">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant={"ghost"}
              className="!p-2 !m-0 !h-fit absolute -top-6 right-6"
            >
              {/* <IconSide /> */}
            </Button>
          </SheetTrigger>
          <SheetContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe alias
            officia quibusdam voluptas molestiae ratione delectus possimus fuga
            repellat? At.
          </SheetContent>
        </Sheet>
      </div>
      <AlertDialog open={showQuestion}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center justify-center text-center">
            <AlertDialogTitle className="text-[30px] flex  justify-between">
              Your Question{" "}
              <span
                role="button"
                onClick={() => setShowQuestion(false)}
                className="cursor-pointer"
              >
                <X />
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-4 text-lg">
              {generatedQuestion?.file && (
                <Image
                  src={
                    typeof generatedQuestion.file === "string"
                      ? generatedQuestion.file
                      : URL.createObjectURL(generatedQuestion.file)
                  }
                  width={600}
                  height={500}
                  className="object-cover mb-4"
                  alt="question"
                />
              )}
              {generatedQuestion?.text && (
                <div className="w-full h-[300px] overflow-y-auto">
                  <p className="text-[16px] text-gray-800">
                    {generatedQuestion?.text}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showAnswer}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center justify-center text-center">
            <AlertDialogTitle className="text-[30px] flex  justify-between">
              Your Answer{" "}
              <span
                role="button"
                onClick={() => setShowAnswer(false)}
                className="cursor-pointer"
              >
                <X />
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-4 text-lg">
              {generatedQuestion?.answerFile && (
                <Image
                  src={URL.createObjectURL(
                    generatedQuestion.answerFile as File
                  )}
                  width={600}
                  height={500}
                  className="object-cover mb-4"
                  alt="question"
                />
              )}
              {generatedQuestion?.answer && (
                <div className="w-full h-[300px] overflow-y-auto">
                  <div className="text-[16px] text-gray-800">
                    {generatedQuestion?.answer}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Chat;
