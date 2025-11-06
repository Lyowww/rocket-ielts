import { cn } from "@/lib/utils"

export const LeftArrow = ({ className }: { className?: string }) => {
    return (
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("block", className)}>
            <path d="M5.8228 9.76766L2.03125 5.97612L5.8228 2.18457" stroke="#23085A" strokeWidth="2.5277" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.8228 9.76766L2.03125 5.97612L5.8228 2.18457" stroke="black" strokeOpacity="0.2" strokeWidth="2.5277" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}