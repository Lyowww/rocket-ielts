import { PenIcon, MessagingIcon } from "@/assets/icons";
import { ReadingIcon } from "@/assets/icons/ReadingIcon";
import { Button } from "@/components/atom";
import { ScoreMap } from "../score-map";
import { AgCharts } from "ag-charts-react";
import { SpeakingIcon } from "@/assets/icons/SpeakingIcon";
import { ListeningIcon } from "@/assets/icons/ListeningIcon";

type RecentActivitiesProps = {
    selectedTab: number;
};

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

const overallScore = 7.0;
const maxScore = 9.0;
const getData = () => {
    return [
        { Quarter: "2016 Q1", Max: 45000, Actual: 140000 },
        { Quarter: "2016 Q2", Max: 56000, Actual: 120000 },
        { Quarter: "2016 Q3", Max: 62000, Actual: 94000 },
        { Quarter: "2016 Q4", Max: 75000, Actual: 54000 },
    ];
};
const options = {
    data: getData(),
    series: [
        { type: "line", xKey: "Quarter", yKey: "Max" },
        { type: "line", xKey: "Quarter", yKey: "Actual" },
    ],
};
export const RecentActivities = ({ selectedTab }: RecentActivitiesProps) => {
    const shouldShowEmptyRoadblock = true
    return (
        <div className="w-full h-[345px] mt-[40px] gap-4 flex">
            <div className="w-2/3 gap-4 h-full bg-[#F6F6FB] rounded-[12px] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col items-start justify-start overflow-hidden">
                {tabs[selectedTab].icon ? (
                    <div className="transition-all duration-300 ease-in-out inline-flex items-center justify-center p-3 rounded-[12px] bg-[#F6F6FB] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-[#23085A] shrink-0">
                        {tabs[selectedTab].icon}
                    </div>
                ) : (
                    <p className="transition-all duration-300 ease-in-out text-[28px] font-semibold text-start text-[#23085A] shrink-0">
                        {tabs[selectedTab].title}
                    </p>
                )}
                <div className="w-full flex-1 min-h-0 overflow-hidden">
                    {selectedTab === 0 ? (
                        <div className="w-full h-full">
                            <ScoreMap currentScore={overallScore} maxScore={maxScore} />
                        </div>
                    ) : (
                        <div className="w-full h-full">
                            <AgCharts className="w-full h-full"
                                options={options as any}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="w-1/3 h-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#F7F7F8] rounded-[12px] p-6">
                <div className="flex items-center w-full justify-between">
                    <h2 className="text-[20px] text-[#23085A] font-semibold">Current Roadblock</h2>
                    <div className="inline-flex items-center justify-center p-2 rounded-[12px] bg-[#E8E8E8] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] text-[#23085A] shrink-0">
                        <ReadingIcon className="w-[20px] h-[22px] text-[#23085A]" />
                    </div>
                </div>
                {shouldShowEmptyRoadblock ? (
                    <div className="w-full h-[169px] mt-4 flex items-center justify-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#E8E8E8] rounded-[12px] p-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="text-[#23085A]"><MessagingIcon /></div>
                            <p className="text-[16px] text-[#141522] font-semibold mt-2">No current roadblock</p>
                            <p className="text-[12px] text-[#666666] mt-1">Your next challenge will appear here</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-[16px] mt-4 text-[#575353] font-regular">Based on your previous test, this is your main roadblock to reaching your destination.</p>
                        <div className="w-full h-[169px] flex flex-col items-start justify-end shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#E8E8E8] rounded-[12px] p-4">
                            <h4 className="text-[14px] text-[#23085A] text-left font-regular">Skimming and scanning - Linking words</h4>
                            <Button className="px-[25px] py-[12px] mt-[10px] w-full">Continue Practicing</Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
