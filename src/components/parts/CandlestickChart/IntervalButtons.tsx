import { Button } from "@/components/ui/button";

export interface Interval {
    title: string,
    timeFrame: string,
    timeOffset: number,
    isDefault?: boolean
}

interface IntervalButtonsProps {
    intervals: Interval[],
    pickedAt: number,
    onIntervalClick: (timeFrame: string) => void,
}

const IntervalButtons: React.FC<IntervalButtonsProps> = ({ intervals, pickedAt, onIntervalClick }) => (
    <div className="border-b-2">
        {intervals.map((interval, index) => (
            <Button key={interval.timeFrame} variant={index === pickedAt ? "outline" : "ghost"} className="rounded-sm" onClick={() => onIntervalClick(interval.timeFrame)}>
                {interval.title}
            </Button>
        ))}
    </div >
);

export default IntervalButtons