"use client";

import { PenIcon, MessagingIcon } from "@/assets/icons";
import { ReadingIcon } from "@/assets/icons/ReadingIcon";
import { Button } from "@/components/atom";
import { ScoreMap } from "../score-map";
import { SpeakingIcon } from "@/assets/icons/SpeakingIcon";
import { ListeningIcon } from "@/assets/icons/ListeningIcon";
import { useAppSelector } from "@/store/rtk/hooks";
import { RootState } from "@/store/rtk/store";

type RecentActivitiesProps = {
    selectedTab: number;
};

const tabs = [
    {
        id: 0,
        title: "Your Journey",
        subTitle: "Track your journey to IELTS success",
    },
    {
        id: 1,
        title: "My Writing Environment",
        buttonTitle: "Writing",
        subTitle: "Keep your prep moving",
        icon: <PenIcon className={`w-[20px] h-[20px]`} />,
        score: 7.0,
    },
    {
        id: 2,
        title: "My Reading Environment",
        buttonTitle: "Reading",
        subTitle: "Keep your prep moving",
        icon: <ReadingIcon className={`w-[20px] h-[20px]`} />,
        score: 7.0,
    },
    {
        id: 3,
        title: "My Listening Environment",
        buttonTitle: "Listening",
        subTitle: "Keep your prep moving",
        icon: <ListeningIcon className={`w-[20px] h-[20px]`} />,
        score: 7.0,
    },
    {
        id: 4,
        title: "My Speaking Environment",
        buttonTitle: "Speaking",
        subTitle: "Keep your prep moving",
        icon: <SpeakingIcon className={`w-[22px] h-[22px]`} />,
        score: 7.0,
    }
]

const overallScore = 7.0;
const maxScore = 9.0;
export const RecentActivities = ({ selectedTab }: RecentActivitiesProps) => {
    const activeTab = tabs[selectedTab] ?? tabs[0];
    const challengesState = useAppSelector((s: RootState) => s.challenges);
    type ChallengeEntry = {
        challenge?: string | null;
        current_feedback?: string | null;
        motivational_text?: string | null;
        exercise_question?: string | null;
    };
    const challengeEntries: ChallengeEntry[] = Array.isArray(challengesState.data)
        ? challengesState.data
        : challengesState.data
            ? [challengesState.data]
            : [];
    const activeChallenge =
        challengeEntries.find(
            challenge =>
                (challenge.challenge && challenge.challenge.trim().length > 0) ||
                (challenge.current_feedback && challenge.current_feedback.trim().length > 0) ||
                (challenge.motivational_text && challenge.motivational_text.trim().length > 0)
        ) ?? challengeEntries[0];

    const hasRoadblock = Boolean(activeChallenge);
    const currentScore = activeTab.score ?? overallScore;
    const scores = useAppSelector((s: RootState) => s.scores.data);
    const roadblockDescription =
        activeChallenge?.current_feedback?.trim() ||
        activeChallenge?.motivational_text?.trim() ||
        "Based on your previous test, this is your main roadblock to reaching your destination.";
    const roadblockTitle =
        activeChallenge?.challenge?.trim() ||
        activeChallenge?.exercise_question?.trim() ||
        "Keep practicing to unlock your next milestone";
    const RoadblockIcon = activeTab.icon ?? <ReadingIcon className="w-[20px] h-[22px] text-[#23085A]" />;
    console.log("scores", scores);
    return (
        <div className="mt-10 flex w-full flex-col gap-4 lg:flex-row">
            <div className="flex w-full flex-1 flex-col gap-4 rounded-[12px] bg-[#F6F6FB] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                {activeTab.icon ? (
                    <div className="transition-all w-fit duration-300 ease-in-out inline-flex items-center justify-center p-3 rounded-[12px] bg-[#F6F6FB] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-[#23085A] shrink-0">
                        {activeTab.icon}
                    </div>
                ) : (
                    <p className="transition-all duration-300 ease-in-out text-[16px] sm:text-[20px]  font-semibold text-start text-[#23085A] shrink-0">
                        {activeTab.title}
                    </p>
                )}
                {/* <div className="w-full flex-1 min-h-[220px] overflow-hidden flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-sm text-[#999]">[Placeholder for user progress chart]</p>
                    </div>
                            />
                        </AgChartView>
                    </div>
                </div> */}
            </div>
            <div className="w-full rounded-[12px] bg-[#F7F7F8] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] lg:w-1/3">
                <div className="flex items-center w-full justify-between">
                    <h2 className="text-[20px] text-[#23085A] font-semibold">Current Roadblock</h2>
                    <div className="inline-flex items-center justify-center p-2 rounded-[12px] bg-[#E8E8E8] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-[#23085A] shrink-0">{RoadblockIcon}</div>
                </div>
                {!hasRoadblock ? (
                    <div className="w-full h-[169px] mt-4 flex items-center justify-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#E8E8E8] rounded-[12px] p-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="text-[#23085A]"><MessagingIcon /></div>
                            <p className="text-[16px] text-[#141522] font-semibold mt-2">No current roadblock</p>
                            <p className="text-[12px] text-[#666666] mt-1">Your next challenge will appear here</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-[16px] mt-4 text-[#575353] font-regular">{roadblockDescription}</p>
                        <div className="w-full h-[169px] flex flex-col items-start justify-end shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#E8E8E8] rounded-[12px] p-4">
                            <h4 className="text-[14px] text-[#23085A] text-left font-regular">{roadblockTitle}</h4>
                            <Button className="px-[25px] py-[12px] mt-[10px] w-full">Continue Practicing</Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
