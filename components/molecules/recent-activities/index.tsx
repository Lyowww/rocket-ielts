import { PenIcon } from "@/assets/icons";
import { LeftArrow } from "@/assets/icons/LeftArrow";
import { ReadingIcon } from "@/assets/icons/ReadingIcon";
import { ProfilePicExample } from "@/assets/images";
import { Button } from "@/components/atom";
import Image from "next/image";

export const RecentActivities = () => {
    return (
        <div className="w-full h-full mt-[80px] flex gap-4 pr-[150px]">
            <div className="w-full h-[262px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#F7F7F8] rounded-[12px] p-6">
                <h2 className="text-[24px] text-[#23085A] font-bold italic">Challenge Tracker</h2>
                <h4 className="text-[20px] text-[#23085A] font-regular">Reading Challenge</h4>
                <div className="w-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#EFECF5] rounded-[12px] p-4">
                    <ReadingIcon className="w-[20px] h-[22px] text-[#23085A]" />
                    <h4 className="text-[14px] text-[#1F140F] mt-[7px] font-regular">Skimming and Scanning</h4>
                    <p className="text-[14px] text-[#23085A]">Linking words</p>
                    <Button className="px-[25px] py-[12px] mt-[10px]">Continue Practicing</Button>
                </div>
            </div>
            <div className="w-full h-[262px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#F7F7F8] rounded-[12px] p-6">
                <div className="flex items-center gap-2">
                    <Image src={ProfilePicExample.src} alt="recent-activities" quality={100} priority={false} width={52} height={52} className="rounded-full w-[52px] h-[52px] object-cover object-center" />
                    <div className="flex flex-col">
                        <h4 className="text-[17px] text-[#141522] font-semibold">Curious George</h4>
                        <div className="flex items-center gap-1">
                            <PenIcon className="w-[11px] h-[13px] text-[#23085A]" />
                            <p className="text-[13px] text-[#666666] italic">Writing</p>
                        </div>
                    </div>
                </div>
                <div className="text-[11px] mt-[16.85px] text-[#1A1A1B] px-[21px] py-[15px] w-full font-regular bg-[#EFECF5] rounded-[28.05px] rounded-bl-[0px]">
                    <p>Excellent attempt! Remember to focus on the most important points and use your own words </p>
                </div>
                <div className="mt-[16.85px] bg-gradient-to-r w-full h-[44.55px] from-[#23085A] to-[#651FFF] rounded-[14px] p-[2px]">
                    <div className="bg-white w-full flex items-center justify-center hover:bg-[white]/80 cursor-pointer h-full rounded-[12px] p-[2px]">
                        <p className="text-[18px] text-[#23085A] font-medium">Schedule a meeting!</p>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center mt-[10px]">
                    <div className="bg-gradient-to-r from-[#23085A] to-[#651FFF] flex items-center justify-center rounded-[9px] p-[1px]">
                        <div className="flex items-center gap-1 border border-[#F0F0F3] rounded-[8px] p-[1px] px-2 bg-white">
                            <LeftArrow className="w-[8px] h-[12px] text-[#23085A] cursor-pointer" />
                            <div className="w-[1px] h-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] rounded-full" />
                            <div className="w-[1px] h-[20px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] rounded-full" />
                            <LeftArrow className="w-[8px] h-[12px] text-[#23085A] cursor-pointer rotate-180" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-[262px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-[#F7F7F8] rounded-[12px] p-6">
                <h2 className="text-[24px] font-medium">Recent Activities</h2>
            </div>
        </div>
    );
}
