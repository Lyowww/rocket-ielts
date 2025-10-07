import { cn } from "@/lib/utils"

export const LeftArrow = ({ className }: { className?: string }) => {
    return (
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("block", className)}>
            <path d="M5.8228 9.76766L2.03125 5.97612L5.8228 2.18457" stroke="url(#paint0_linear_1184_8852)" strokeWidth="2.5277" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.8228 9.76766L2.03125 5.97612L5.8228 2.18457" stroke="black" strokeOpacity="0.2" strokeWidth="2.5277" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
                <linearGradient id="paint0_linear_1184_8852" x1="9.91414" y1="10.6194" x2="0.160943" y2="0.548436" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF4081" />
                    <stop offset="0.290236" stopColor="#23085A" />
                    <stop offset="0.532266" stopColor="#651FFF" />
                    <stop offset="1" stopColor="#84FFFF" />
                </linearGradient>
            </defs>
        </svg>

    )
}