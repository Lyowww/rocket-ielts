"use client";
import { PenIcon, MessagingIcon } from "@/assets/icons";
import { AchievementIcon } from "@/assets/icons/AchievementIcon";
import { BookIcon } from "@/assets/icons/BookIcon";
import { DiagramIcon } from "@/assets/icons/DiagramIcon";
import { LeftArrow } from "@/assets/icons/LeftArrow";
import { ListeningIcon } from "@/assets/icons/ListeningIcon";
import { MilestoneIcon } from "@/assets/icons/MilestoneIcon";
import { ReadingIcon } from "@/assets/icons/ReadingIcon";
import { SpeakingIcon } from "@/assets/icons/SpeakingIcon";
import { ProfilePicExample } from "@/assets/images";
import { useAppSelector } from "@/store/rtk/hooks";
import { RootState } from "@/store/rtk/store";
import Image from "next/image";
import { useState } from "react";
import GlobalModal from "@/components/molecules/GlobalModal";
import { cn } from "@/lib/utils";

type ScoreBarProps = {
    selectedTab: number;
    onSelectTab: (id: number) => void;
};

export const ScoreBar = ({ selectedTab, onSelectTab }: ScoreBarProps) => {
    const scores = useAppSelector((s: RootState) => s.scores.data);
    console.log("scores", scores)
    const tabs = [

        {
            id: 1,
            title: "My Writing Environment",
            buttonTitle: "Writing",
            subTitle: "Keep your prep moving",
            icon: <PenIcon className={`w-[20px] h-[20px]`} />,
            score: scores?.writing || 0,
        },
        {
            id: 2,
            title: "My Reading Environment",
            buttonTitle: "Reading",
            subTitle: "Keep your prep moving",
            icon: <ReadingIcon className={`w-[20px] h-[20px]`} />,
            score: scores?.reading || 0,
        },
        {
            id: 3,
            title: "My Listening Environment",
            buttonTitle: "Listening",
            subTitle: "Keep your prep moving",
            icon: <ListeningIcon className={`w-[20px] h-[20px]`} />,
            score: scores?.listening || 0,
        },
        {
            id: 4,
            title: "My Speaking Environment",
            buttonTitle: "Speaking",
            subTitle: "Keep your prep moving",
            icon: <SpeakingIcon className={`w-[22px] h-[22px]`} />,
            score: scores?.speaking || 0,
        }
    ]
    const activities = [
        {
            id: 0,
            userName: "Curious George",
            discipline: "Writing",
            icon: <PenIcon className="w-[11px] h-[13px] text-[#23085A]" />,
            message:
                "Excellent attempt! Remember to focus on the most important points and use your own words",
        },
        {
            id: 1,
            userName: "Curious George",
            discipline: "Writing",
            icon: <PenIcon className="w-[11px] h-[13px] text-[#23085A]" />,
            message:
                "Great progress! Try varying your sentence structures and linking ideas more clearly.",
        },
        {
            id: 2,
            userName: "Curious George",
            discipline: "Writing",
            icon: <PenIcon className="w-[11px] h-[13px] text-[#23085A]" />,
            message:
                "Nice work! Pay attention to task response and develop your examples further.",
        },
    ]

    const milestones = [
        {
            id: 0,
            title: "Complex Sentences",
            icon: <BookIcon className="w-[14px] h-[12px] text-[#23085A]" />,
            disabled: true,
        },
        {
            id: 1,
            title: "Complex Sentences",
            icon: <BookIcon className="w-[14px] h-[12px] text-[#23085A]" />,
            disabled: true,
        },
        {
            id: 2,
            title: "Complex Sentences",
            icon: <BookIcon className="w-[14px] h-[12px] text-[#23085A]" />,
            disabled: true,
        },
        {
            id: 3,
            title: "Complex Sentences",
            icon: <BookIcon className="w-[14px] h-[12px] text-[#23085A]" />,
            disabled: true,
        },
        {
            id: 4,
            title: "Complex Sentences",
            icon: <BookIcon className="w-[14px] h-[12px] text-[#23085A]" />,
            disabled: true,
        },
        {
            id: 5,
            title: "Complex Sentences",
            icon: <BookIcon className="w-[14px] h-[12px] text-[#23085A]" />,
            disabled: true,
        },
    ]
    const [currentActivityIndex, setCurrentActivityIndex] = useState<number>(0);
    const [isMilestonesOpen, setIsMilestonesOpen] = useState<boolean>(false)
    const shouldShowEmptyActivities = true
    const hasActivities = !shouldShowEmptyActivities && activities.length > 0

    return (
        <>
            <div className="mt-10 flex w-full flex-col gap-6 xl:flex-row">
                <div className="flex-1 space-y-6 w-full h-full flex flex-col">
                    <button
                        type="button"
                        className={cn(
                            "flex w-full items-center justify-center gap-3 rounded-[10px] px-4 py-4 text-base sm:text-lg font-semibold shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-300",
                            selectedTab === 0 ? "bg-[#23085A] text-white" : "bg-[#F6F6FB] text-[#23085A]"
                        )}
                        onClick={() => onSelectTab(0)}
                    >
                        <DiagramIcon className={selectedTab === 0 ? "text-white" : "text-[#23085A]"} />
                        <span>Overall Score: {scores?.overall_score ? scores?.overall_score.toFixed(1) : "0.0"}</span>
                    </button>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 w-full h-full">
                        {tabs.map((el) => (
                            <button
                                key={el.id}
                                onClick={() => onSelectTab(el.id)}
                                className={cn(
                                    "flex flex-col shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] gap-4 rounded-[12px] px-5 py-6.5 items-center justify-center text-left transition-all duration-300",
                                    selectedTab === el.id ? "bg-[#23085A] text-white" : "bg-[#F6F6FB] text-[#23085A]"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="rounded-[12px] bg-white p-3 text-[#23085A] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                                        {el.icon}
                                    </div>
                                    <p className="text-3xl font-semibold">
                                        {typeof el.score === "number" ? el.score.toFixed(1) : "--"}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex w-full flex-col xl:flex-row gap-4 xl:w-2/3">
                    <div className="w-full flex flex-col gap-4 rounded-[12px] bg-[#F7F7F8] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                        <div className="flex items-center justify-center gap-2">
                            <h2 className="text-base font-bold text-[#23085A]">Milestones</h2>
                            <AchievementIcon className="h-[15px] w-[11px] text-[#23085A]" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 place-items-center">
                            {milestones.slice(0, 6).map((el, index) => (
                                <MilestoneIcon key={index} title={el.title} icon={el.icon} disabled={el.disabled} className="h-[72px] w-[96px] text-[#23085A]" />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsMilestonesOpen(true)}
                            className="mx-auto flex h-[32px] w-[110px] items-center justify-center rounded-[8px] border border-[#00000033] bg-[#EFECF5] text-xs font-medium text-[#23085A] transition hover:opacity-80"
                        >
                            View All
                        </button>
                    </div>

                    <div className="w-full rounded-[12px] bg-[#F7F7F8] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                        {hasActivities ? (
                            <>
                                <div className="overflow-hidden">
                                    <div
                                        className="flex transition-transform duration-300 ease-in-out"
                                        style={{ transform: `translateX(-${currentActivityIndex * 100}%)` }}
                                    >
                                        {activities.map((item) => (
                                            <div key={item.id} className="min-w-full">
                                                <div className="flex items-center gap-3">
                                                    <Image src={ProfilePicExample.src} alt="recent-activities" quality={100} priority={false} width={52} height={52} className="h-[52px] w-[52px] rounded-full object-cover" />
                                                    <div className="flex flex-col">
                                                        <h4 className="text-base font-semibold text-[#141522]">{item.userName}</h4>
                                                        <div className="flex items-center gap-1 text-sm text-[#666666]">
                                                            {item.icon}
                                                            <p className="italic">{item.discipline}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 rounded-[28px] rounded-bl-none bg-[#E8E8E8] px-5 py-3 text-xs text-[#1A1A1B]">
                                                    <p>{item.message}</p>
                                                </div>
                                                <button className="mt-4 w-full rounded-[8px] border border-[#00000033] bg-[#EFECF5] py-2 text-base font-medium text-[#23085A] transition hover:bg-white/80">
                                                    Ask For Advice
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-center">
                                    <div className="rounded-[9px] bg-[#23085A] p-1">
                                        <div className="flex items-center gap-1 rounded-[8px] border border-[#F0F0F3] bg-white px-2 py-1">
                                            <button
                                                type="button"
                                                onClick={() => setCurrentActivityIndex((i) => Math.max(0, i - 1))}
                                                className="p-1"
                                                aria-label="Previous"
                                            >
                                                <LeftArrow className="h-3 w-2 text-[#23085A]" />
                                            </button>
                                            <div className="h-[20px] w-[1px] rounded-full shadow" />
                                            <div className="h-[20px] w-[1px] rounded-full shadow" />
                                            <button
                                                type="button"
                                                onClick={() => setCurrentActivityIndex((i) => Math.min(activities.length - 1, i + 1))}
                                                className="p-1"
                                                aria-label="Next"
                                            >
                                                <LeftArrow className="h-3 w-2 rotate-180 text-[#23085A]" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-center">
                                <div className="text-[#23085A]">
                                    <MessagingIcon />
                                </div>
                                <p className="mt-2 text-base font-semibold text-[#141522]">No recent activity yet</p>
                                <p className="mt-1 text-xs text-[#666666]">Your feedback and activity will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <GlobalModal className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-20" open={isMilestonesOpen} onOpenChange={setIsMilestonesOpen} isNeedBtn>
                <div className="w-full">
                    <div className="mb-4 sm:mb-6 flex items-center justify-center gap-2">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#23085A]">Milestones</h3>
                        <AchievementIcon className="h-[12px] w-[9px] sm:h-[15px] sm:w-[11px] text-[#23085A]" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
                        {[...milestones, ...milestones, ...milestones]
                            .sort((a, b) => (a.disabled === b.disabled ? 0 : a.disabled ? 1 : -1))
                            .map((el, index) => (
                                <MilestoneIcon
                                    key={index}
                                    title={el.title}
                                    icon={el.icon}
                                    disabled={el.disabled}
                                    className="inline-block h-[60px] w-[80px] sm:h-[65px] sm:w-[85px] md:h-[70px] md:w-[92px] lg:h-[75px] lg:w-[98px] xl:h-[79px] xl:w-[104px] text-[#23085A]"
                                />
                            ))}
                    </div>
                </div>
            </GlobalModal>
        </>
    );
};