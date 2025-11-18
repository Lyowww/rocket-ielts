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
import { Button } from "@/components/atom/button";
import { useAppSelector } from "@/store/rtk/hooks";
import { RootState } from "@/store/rtk/store";
import Image from "next/image";
import { useState } from "react";
import GlobalModal from "@/components/molecules/GlobalModal";

type ScoreBarProps = {
    selectedTab: number;
    onSelectTab: (id: number) => void;
};

export const ScoreBar = ({ selectedTab, onSelectTab }: ScoreBarProps) => {
    const scores = useAppSelector((s: RootState) => s.scores.data);
    const tabs = [

        {
            id: 1,
            title: "My Writing Environment",
            buttonTitle: "Writing",
            subTitle: "Keep your prep moving",
            icon: <PenIcon className={`w-[20px] h-[20px]`} />,
            score: scores?.writing_score || 0,
        },
        {
            id: 2,
            title: "My Reading Environment",
            buttonTitle: "Reading",
            subTitle: "Keep your prep moving",
            icon: <ReadingIcon className={`w-[20px] h-[20px]`} />,
            score: scores?.reading_score || 0,
        },
        {
            id: 3,
            title: "My Listening Environment",
            buttonTitle: "Listening",
            subTitle: "Keep your prep moving",
            icon: <ListeningIcon className={`w-[20px] h-[20px]`} />,
            score: scores?.listening_score || 0,
        },
        {
            id: 4,
            title: "My Speaking Environment",
            buttonTitle: "Speaking",
            subTitle: "Keep your prep moving",
            icon: <SpeakingIcon className={`w-[22px] h-[22px]`} />,
            score: scores?.speaking_score || 0,
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
        <div className="mt-[42px] h-full w-full gap-4 flex justify-center">
            <div className="w-full h-full">
                <div className={`w-full cursor-pointer h-[53px] gap-1 flex items-center justify-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out ${selectedTab === 0 ? "bg-[#23085A] text-white" : "bg-[#F6F6FB] text-black"} rounded-[10px]`} onClick={() => onSelectTab(0)}>
                    <DiagramIcon className={`transition-colors duration-300 ease-in-out ${selectedTab === 0 ? "text-white" : "text-[#23085a]"}`} />
                    <p className={`transition-colors duration-300 ease-in-out text-[${selectedTab === 0 ? "#FFFFFF" : "#23085a"}] text-[20px] font-medium`}>Overall Score: {scores?.overall_score ? scores?.overall_score.toFixed(1) : "0.0"}</p>
                </div>
                <div className="gap-4 grid grid-cols-2 mt-6">
                    {tabs.map((el) => {
                        return (
                            <button key={el.id} onClick={() => onSelectTab(el.id)} className={`transition-all duration-300 ease-in-out ${selectedTab === el.id ? "bg-[#23085A] text-white" : "bg-[#F6F6FB] text-[#23085a]"} flex flex-col items-center text-[23px] font-medium cursor-pointer text-[#1E1E1E] rounded-[12px] py-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]`}>
                                <div className="flex items-center gap-4">
                                    <div className={`transition-all duration-300 ease-in-out rounded-[12px] p-3 bg-[#F6F6FB] text-[#23085a] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]`}>{el.icon}</div>
                                    <p className={`transition-colors duration-300 ease-in-out text-[24px] ${selectedTab === el.id ? "text-white" : "text-[#23085a]"}`}>
                                        {typeof el.score === "number" ? el.score.toFixed(1) : "--"}
                                    </p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
            <div className="w-full flex flex-col items-center justify-center gap-2 h-[262px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#F7F7F8] rounded-[12px] p-6">
                <div className="flex items-center justify-center gap-2">
                    <h2 className="text-[16px] text-[#23085A] font-bold flex">Milestones </h2>
                    <AchievementIcon className="w-[11px] h-[15px] text-[#23085A]" />
                </div>
                <div className="grid grid-cols-3 gap-2 place-items-center">
                    {milestones.slice(0, 6).map((el, index) => (
                        <div key={index} className="flex items-center justify-center">
                            <MilestoneIcon title={el.title} icon={el.icon} disabled={el.disabled} className="w-[96px] h-[72px] text-[#23085A]" />
                        </div>
                    ))}
                </div>
                <div onClick={() => setIsMilestonesOpen(true)} className="text-[12px] font-medium w-[95px] h-[27px] flex items-center justify-center text-center cursor-pointer bg-[#EFECF5] rounded-[8px] px-4 py-2 border border-[#00000033]">
                    <span className="text-[#23085A] font-medium">View All</span>
                </div>
            </div>
            <div className="w-full h-[262px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#F7F7F8] rounded-[12px] p-6">
                {hasActivities ? (
                    <>
                        <div className="overflow-hidden w-full">
                            <div
                                className="flex transition-transform duration-300 ease-in-out"
                                style={{ transform: `translateX(-${currentActivityIndex * 100}%)` }}
                            >
                                {activities.map((item) => (
                                    <div key={item.id} className="min-w-full">
                                        <div className="flex items-center gap-2">
                                            <Image src={ProfilePicExample.src} alt="recent-activities" quality={100} priority={false} width={52} height={52} className="rounded-full w-[52px] h-[52px] object-cover object-center" />
                                            <div className="flex flex-col">
                                                <h4 className="text-[17px] text-[#141522] font-semibold">{item.userName}</h4>
                                                <div className="flex items-center gap-1">
                                                    {item.icon}
                                                    <p className="text-[13px] text-[#666666] italic">{item.discipline}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[11px] mt-[16.85px] text-[#1A1A1B] px-[19px] py-[12px] w-full font-regular bg-[#E8E8E8] rounded-[28.05px] rounded-bl-[0px]">
                                            <p>{item.message}</p>
                                        </div>
                                        <div className="bg-[#EFECF5] mt-[16.85px] w-full border border-[#00000033] transition-300 flex items-center justify-center hover:bg-[white]/80 cursor-pointer rounded-[8px] py-[10px]">
                                            <p className="text-[18px] text-[#23085A] font-medium">Ask For Advice</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full flex items-center justify-center mt-[10px]">
                            <div className="bg-[#23085A] flex items-center justify-center rounded-[9px] p-[1px]">
                                <div className="flex items-center gap-1 border border-[#F0F0F3] rounded-[8px] p-[1px] px-2 bg-white">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentActivityIndex((i) => Math.max(0, i - 1))}
                                        className="cursor-pointer"
                                        aria-label="Previous"
                                    >
                                        <LeftArrow className="w-[8px] h-[12px] text-[#23085A]" />
                                    </button>
                                    <div className="w-[1px] h-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] rounded-full" />
                                    <div className="w-[1px] h-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] rounded-full" />
                                    <button
                                        type="button"
                                        onClick={() => setCurrentActivityIndex((i) => Math.min(activities.length - 1, i + 1))}
                                        className="cursor-pointer"
                                        aria-label="Next"
                                    >
                                        <LeftArrow className="w-[8px] h-[12px] text-[#23085A] rotate-180" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="flex flex-col items-center text-center">
                            <div className="text-[#23085A]"><MessagingIcon /></div>
                            <p className="text-[16px] text-[#141522] font-semibold mt-2">No recent activity yet</p>
                            <p className="text-[12px] text-[#666666] mt-1">Your feedback and activity will appear here</p>
                        </div>
                    </div>
                )}
            </div>

            <GlobalModal className="w-[800px]" open={isMilestonesOpen} onOpenChange={setIsMilestonesOpen} isNeedBtn>
                <div className="w-full">
                    <div className="flex items-center justify-center mb-4 gap-2">
                        <h3 className="text-[18px] text-[#23085A] font-semibold">Milestones</h3>
                        <AchievementIcon className="w-[11px] h-[15px] text-[#23085A]" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[...milestones, ...milestones, ...milestones]
                            .sort((a, b) => (a.disabled === b.disabled ? 0 : a.disabled ? 1 : -1))
                            .map((el, index) => (
                                <MilestoneIcon
                                    key={index}
                                    title={el.title}
                                    icon={el.icon}
                                    disabled={el.disabled}
                                    className="w-[104px] h-[79px] text-[#23085A] inline-block"
                                />
                            ))}
                    </div>
                </div>
            </GlobalModal>
        </div>
    );
};