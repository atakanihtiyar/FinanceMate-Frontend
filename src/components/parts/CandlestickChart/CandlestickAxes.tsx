import * as d3 from "d3"
import { useRef } from "react";

// Function to determine appropriate time format based on zoom level
function getTickFormat(allDates: Date[]) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const rangeInDays = (allDates[1].getTime() - allDates[0].getTime()) / MS_PER_DAY;

    // Helper functions
    const isNewDay = (date: Date, lastTickDate: Date) => date.getUTCDate() !== lastTickDate.getUTCDate()
    const isNewWeek = (date: Date, lastTickDate: Date) => Math.ceil(date.getUTCDate() / 7) !== Math.ceil(lastTickDate.getUTCDate() / 7)
    const isNewMonth = (date: Date, lastTickDate: Date) => date.getUTCMonth() !== lastTickDate.getUTCMonth()
    const isNewYear = (date: Date, lastTickDate: Date) => date.getUTCFullYear() !== lastTickDate.getUTCFullYear()

    interface FilterProps {
        date: Date,
        index: number,
        lastTickDate: Date,
        lastTickIndex: number,
    }

    const createFormatConfig = (
        formatter: (date: Date) => string,
        filter: (props: FilterProps) => boolean,
        secondaryFormatter: (date: Date) => string,
        secondaryFilter: (props: FilterProps) => boolean) => ({
            formatter,
            filter,
            secondaryFormatter,
            secondaryFilter
        });

    if (rangeInDays < 1) {  // hourly candles
        return createFormatConfig(
            d3.utcFormat("%a %d"),
            ({ date, lastTickDate }) => (date.getUTCHours() === 8 && date.getUTCMinutes() === 0) || isNewDay(date, lastTickDate),
            d3.utcFormat("%H:%M"),
            ({ date }) => date.getUTCHours() === 16 && date.getUTCMinutes() === 0
        );
    } else if (rangeInDays < 7) {  // daily candles
        return createFormatConfig(
            d3.utcFormat("%a %d"),
            ({ date, index, lastTickDate, lastTickIndex }) => date.getUTCDate() < 27 && index - lastTickIndex === 7 && isNewWeek(date, lastTickDate),
            d3.utcFormat("%b %Y"),
            ({ date, lastTickDate }) => isNewMonth(date, lastTickDate)
        );
    } else if (rangeInDays < 30) {  // weekly candles
        return createFormatConfig(
            d3.utcFormat("%b"),
            ({ date, lastTickDate }) => date.getUTCMonth() !== 0 && isNewMonth(date, lastTickDate),
            d3.utcFormat("%Y"),
            ({ date, lastTickDate }) => isNewYear(date, lastTickDate)
        );
    } else {  // monthly candles
        return createFormatConfig(
            d3.utcFormat("%b %d"),
            ({ date, lastTickDate }) => isNewYear(date, lastTickDate),
            (date) => date.getUTCMonth() % 12 === 0 ? d3.utcFormat("%b %Y")(date) : d3.utcFormat("%b")(date),
            ({ date, index, lastTickDate }) => index % 4 === 0 && isNewMonth(date, lastTickDate)
        );
    }
}


const XAxis = ({ scale, title, innerHeight }: { scale: d3.ScaleBand<Date> | d3.ScaleTime<number, number, never>, title: string, innerHeight: number }) => {

    const [xMin, xMax] = scale.range()
    const _ticks = scale.domain()
    const { formatter, filter, secondaryFormatter, secondaryFilter } = getTickFormat(scale.domain())

    const lastTick = useRef({ date: _ticks[0], index: 0 })
    const currTick = useRef({ date: _ticks[0], index: 0 })
    lastTick.current = { date: _ticks[0], index: 0 }
    currTick.current = { date: _ticks[0], index: 0 }

    return (
        <g transform={`translate(${0},${innerHeight})`}>
            <text
                x={xMax}
                textAnchor="end"
                dy={-5}
                fill="currentColor"
                className="font-semibold text-sm"
            >
                {title}
            </text>
            <line x1={xMin} x2={xMax} y1={0} y2={0} stroke="white" />
            {
                _ticks?.map((date: Date, index: number) => {
                    const x = scale(date)
                    if (currTick.current.index !== lastTick.current.index) {
                        lastTick.current.date = currTick.current.date
                        lastTick.current.index = currTick.current.index
                    }
                    if (filter({ date, index, lastTickDate: lastTick.current.date, lastTickIndex: lastTick.current.index })) {
                        currTick.current.date = date
                        currTick.current.index = index

                        return <g key={date.toUTCString()} transform={`translate(${x},0)`}>
                            <line y1={0} y2={8} stroke="currentColor" ></line>
                            <line y1={0} y2={-innerHeight} stroke="currentColor" strokeOpacity={0.1}></line>
                            <text
                                y={10}
                                dy="0.8em"
                                textAnchor="middle"
                                fill="currentColor"
                                className="text-sm text-muted-foreground"
                            >
                                {formatter(date)}
                            </text>
                        </g>
                    }
                    if (secondaryFilter({ date, index, lastTickDate: lastTick.current.date, lastTickIndex: lastTick.current.index })) {
                        currTick.current.date = date
                        currTick.current.index = index

                        return <g key={date.toUTCString()} transform={`translate(${x},0)`}>
                            <line y1={0} y2={8} stroke="currentColor" ></line>
                            <line y1={0} y2={-innerHeight} stroke="currentColor" strokeOpacity={0.1}></line>
                            <text
                                y={10}
                                dy="0.8em"
                                textAnchor="middle"
                                fill="currentColor"
                                className="text-sm text-muted-foreground"
                            >
                                {secondaryFormatter(date)}
                            </text>
                        </g>
                    }
                })
            }
        </g>
    )
}

const YAxis = ({ scale, title, innerWidth, innerHeight, formatter }:
    {
        scale: d3.ScaleLinear<number, number, never>, title: string, innerWidth: number, innerHeight: number
        formatter: (value: number | { valueOf(): number }) => string
    }) => {

    const [yMin, yMax] = scale.range()
    const ticks = scale.ticks(innerHeight / 40)

    return (
        <g transform={`translate(${0},${0})`}>
            <text
                dx={4}
                dy="0.8em"
                fill="currentColor"
                className="font-semibold text-sm"
            >
                {title}
            </text>
            <line x1={0} x2={0} y1={yMin} y2={yMax} stroke="white" />
            {
                ticks.map((value: number) => {
                    const y = scale(value)
                    return <g key={value} transform={`translate(0,${y})`}>
                        <line x1={0} x2={-8} stroke="currentColor" ></line>
                        <line x1={0} x2={innerWidth} stroke="currentColor" strokeOpacity={0.1}></line>
                        <text
                            dx={-12}
                            dy="0.34em"
                            textAnchor="end"
                            fill="currentColor"
                            className="text-sm text-muted-foreground"
                        >
                            {formatter(value)}
                        </text>
                    </g>
                })
            }
        </g>
    )
}

export { XAxis, YAxis }