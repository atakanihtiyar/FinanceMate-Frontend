import { Button } from "@/components/ui/button";
import React from "react";

export interface Interval {
    title: string,
    timeFrame: string,
    timeOffset: number,
    isDefault?: boolean
}

interface IntervalButtonsProps extends React.RefAttributes<HTMLDivElement> {
    intervals: Interval[],
    pickedAt: number,
    onIntervalClick: (timeFrame: string) => void,
}

const IntervalButtons = React.forwardRef<HTMLDivElement, IntervalButtonsProps>(({ intervals, pickedAt, onIntervalClick, ...props }, ref) => (
    <div className="w-full min-h-min border-b-2" ref={ref} {...props}>
        {intervals.map((interval, index) => (
            <Button
                key={interval.timeFrame}
                variant={index === pickedAt ? "outline" : "ghost"}
                className="rounded-sm"
                onClick={() => onIntervalClick(interval.timeFrame)}
            >
                {interval.title}
            </Button>
        ))}
    </div >
))

export default IntervalButtons