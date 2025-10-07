import { PreviousExams } from "@/components/molecules/previous-exams";
import { RecentActivities } from "@/components/molecules/recent-activities";
import { ScoreBar } from "@/components/molecules/score-bar";

const Dashboard = () => {
    return (
        <div className="w-full flex flex-col">
            <h2 className="text-[36px] font-semibold text-[#090909]">Home</h2>
            <p className="text-[#575353] text-[24px] font-medium">Your IELTS journey at a glance.</p>
            <div className="w-full">
                <ScoreBar />
                <RecentActivities />
            </div>
            <PreviousExams/>
        </div>
    );
};

export default Dashboard;