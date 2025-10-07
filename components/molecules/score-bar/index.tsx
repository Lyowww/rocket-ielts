"use client";
import { PenIcon } from "@/assets/icons";
import { DiagramIcon } from "@/assets/icons/DiagramIcon";
import { ListeningIcon } from "@/assets/icons/ListeningIcon";
import { ReadingIcon } from "@/assets/icons/ReadingIcon";
import { SpeakingIcon } from "@/assets/icons/SpeakingIcon";
import { AgCharts } from "ag-charts-react";
import { ScoreMap } from "@/components/molecules";
import { useState } from "react";

export const ScoreBar = () => {
    const overallScore = 7.0;
    const maxScore = 9.0;
    
    const tabs = [
        {
            id: 0,
            title: "Your Progress",
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
    const getData = () => {
        return [
            { Quarter: "2016 Q1", Max: 45000, Actual: 140000 },
            { Quarter: "2016 Q2", Max: 56000, Actual: 120000 },
            { Quarter: "2016 Q3", Max: 62000, Actual: 94000 },
            { Quarter: "2016 Q4", Max: 75000, Actual: 54000 },
        ];
    };
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const options = {
        data: getData(),
        series: [
            {
                type: "line",
                xKey: "Quarter",
                yKey: "Max",
                yName: "Max Score",
            },
            {
                type: "line",
                xKey: "Quarter",
                yKey: "Actual",
                yName: "Actual Score",
            },
        ],
    };

    return (
        <div className="mt-[82px] h-full w-full gap-10 flex justify-center">
            <div className="w-1/4 h-full">
                <div className={`w-full cursor-pointer h-[53px] gap-1 flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out ${selectedTab === 0 ? "bg-gradient-to-t from-[#23085A] to-[#651FFF] text-white" : "bg-[#EFECF5] text-black"} rounded-[10px]`} onClick={() => setSelectedTab(0)}>
                    <DiagramIcon className={`transition-colors duration-300 ease-in-out ${selectedTab === 0 ? "text-white" : "text-black"}`} />
                    <p className={`transition-colors duration-300 ease-in-out text-[${selectedTab === 0 ? "#FFFFFF" : "#1E1E1E"}] text-[20px] font-medium`}>Overall Score: {overallScore.toFixed(1)}</p>
                </div>
                <div className="gap-4 grid grid-cols-2 mt-6">
                    {tabs.slice(1).map((el) => {
                        return (
                            <button key={el.id} onClick={() => setSelectedTab(el.id)} className={`transition-all duration-300 ease-in-out ${selectedTab === el.id ? "bg-gradient-to-r from-[#23085A] to-[#651FFF] text-white" : "bg-[#EFECF5] text-black"} flex flex-col items-center text-[23px] font-medium cursor-pointer text-[#1E1E1E] rounded-[12px] py-[20px] shadow-lg`}>
                                <div className="flex items-center gap-4">
                                    <div className={`transition-all duration-300 ease-in-out rounded-[12px] p-3 ${selectedTab === el.id ? "bg-gradient-to-t from-[#23085A] to-[#651FFF] text-white" : "bg-[#EFECF5] text-black"} shadow-lg`}>{el.icon}</div>
                                    <p className="transition-colors duration-300 ease-in-out text-[23px] font-medium">{el.buttonTitle}</p>
                                </div>
                                <p className={`transition-colors duration-300 ease-in-out text-[20px] text-[#575353] ${selectedTab === el.id ? "text-white" : "text-[#575353]"}`}>
                                    {typeof el.score === "number" ? el.score.toFixed(1) : "--"}
                                </p>
                            </button>
                        )
                    })}
                </div>
            </div>
            <div className="w-3/4 h-full flex flex-col items-start justify-center mr-[40px]">
                <p className="transition-all duration-300 ease-in-out text-[28px] font-semibold text-start text-[#23085A]">{tabs[selectedTab].title}</p>
                <p className="transition-all duration-300 ease-in-out text-[20px] text-start text-[#575353] italic">{tabs[selectedTab].subTitle}</p>
                {selectedTab === 0 ? (
                    <div className="w-9/10 h-full mt-6">
                        <ScoreMap currentScore={overallScore} maxScore={maxScore} />
                    </div>
                ) : (
                    <AgCharts className="w-9/10 h-full mt-6"
                        options={options as any}
                    />
                )}
            </div>
        </div>
    );
};