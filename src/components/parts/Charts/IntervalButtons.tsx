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
    <div className="w-full min-h-min inline-flex flex-row flex-wrap border-2 border-muted rounded-sm *:grow" ref={ref} {...props}>
        {intervals.map((interval, index) => (
            <Button
                key={interval.timeFrame}
                variant={index === pickedAt ? "secondary" : "outline"}
                className={"rounded-none" + (index === pickedAt ? " pointer-events-none" : "")}
                onClick={() => onIntervalClick(interval.timeFrame)}
            >
                {interval.title}
            </Button>
        ))}
    </div >
))

export default IntervalButtons