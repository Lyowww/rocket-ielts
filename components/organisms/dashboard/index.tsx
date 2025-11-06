"use client";
import { PreviousExams } from "@/components/molecules/previous-exams";
import { RecentActivities } from "@/components/molecules/recent-activities";
import { ScoreBar } from "@/components/molecules/score-bar";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/rtk/hooks";
import { RootState } from "@/store/rtk/store";
import { fetchUserProfile } from "@/store/rtk/slices/userProfile.slice";
import { fetchBadges } from "@/store/rtk/slices/badges.slice";
import { fetchScores } from "@/store/rtk/slices/scores.slice";
import { fetchChallenges } from "@/store/rtk/slices/challenges.slice";

const Dashboard = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const dispatch = useAppDispatch();
    const user = useAppSelector((s: RootState) => s.userProfile.data);
    const challenges = useAppSelector((s: RootState) => s.challenges.data);

    useEffect(() => {
        dispatch(fetchUserProfile());
        dispatch(fetchBadges());
        dispatch(fetchScores());
        dispatch(fetchChallenges());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            console.log(user);
        }
    }, [user]);

    useEffect(() => {
        if (challenges) {
            console.log("Challenges", challenges);
        }
    }, [challenges]);

    return (
        <div className="w-full flex flex-col text-[#23085A]">
            <h2 className="text-[36px] font-semibold">My compass shows the way forward</h2>
            <div className="w-full">
                <ScoreBar selectedTab={selectedTab} onSelectTab={setSelectedTab} />
                <RecentActivities selectedTab={selectedTab} />
            </div>
            <PreviousExams/>
        </div>
    );
};

export default Dashboard;