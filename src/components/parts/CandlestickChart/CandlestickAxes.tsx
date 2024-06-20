import * as d3 from "d3"
import { useRef } from "react"

const formatMillisecond = d3.utcFormat(".%L"),
    formatSecond = d3.utcFormat(":%S"),
    formatMinute = d3.utcFormat("%H:%M"),
    formatHour = d3.utcFormat("%H:%M"),
    formatDay = d3.utcFormat("%a %d"),
    formatWeek = d3.utcFormat("%b %d"),
    formatMonth = d3.utcFormat("%B"),
    formatYear = d3.utcFormat("%Y")

function multiFormat(date: Date, lastTickDate: Date) {
    return (
        lastTickDate.getUTCFullYear() !== date.getUTCFullYear() ? formatYear
            : lastTickDate.getUTCMonth() !== date.getUTCMonth() ? formatMonth
                : lastTickDate.getUTCDate() - date.getUTCDate() >= 7 ? formatWeek
                    : lastTickDate.getUTCDate() !== date.getUTCDate() ? formatDay
                        : lastTickDate.getUTCHours() !== date.getUTCHours() ? formatHour
                            : lastTickDate.getUTCMinutes() !== date.getUTCMinutes() ? formatMinute
                                : lastTickDate.getUTCSeconds() !== date.getUTCSeconds() ? formatSecond
                                    : formatMillisecond)(date)
}

function getTickFormat(tickCountGap: number, tickTimeGap: number) {
    const isTimeGapReached = (date: Date, lastTickDate: Date) => (date.getTime() - lastTickDate.getTime()) > tickTimeGap
    const isCountGapReached = (index: number, lastTickIndex: number) => index - lastTickIndex > tickCountGap

    interface FilterProps {
        date: Date,
        index: number,
        lastTickDate: Date,
        lastTickIndex: number,
    }

    return {
        formatter: multiFormat,
        filter: ({ date, index, lastTickDate, lastTickIndex }: FilterProps) =>
            isTimeGapReached(date, lastTickDate) &&
            isCountGapReached(index, lastTickIndex)
    }
}


const XAxis = ({ scale, title, innerHeight }: { scale: d3.ScaleBand<Date> | d3.ScaleTime<number, number, never>, title: string, innerHeight: number }) => {

    const [xMin, xMax] = scale.range()
    const _ticks = scale.domain()

    const tickCount = 10
    const tickCountGap = Math.ceil(_ticks.length / tickCount)
    const timeDiff = new Date(_ticks[_ticks.length - 1].getTime() - _ticks[0].getTime())
    const tickTimeGap = Math.ceil(timeDiff.getTime() / tickCount)

    const { formatter, filter } = getTickFormat(tickCountGap, tickTimeGap)

    const startDate = _ticks[0]
    const currTick = useRef({ date: startDate, index: 0 })
    const lastTick = useRef({ date: new Date(startDate.getTime() - tickTimeGap), index: 0 })
    currTick.current = { date: startDate, index: 0 }
    lastTick.current = { date: new Date(startDate.getTime() - tickTimeGap), index: 0 }

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
                                {formatter(date, lastTick.current.date)}
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