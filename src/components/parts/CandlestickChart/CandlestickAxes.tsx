import * as d3 from "d3"

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


const XAxis = ({ dates, intervalTimeOffset, xMin, xMax, title, innerHeight }:
    {
        dates: Date[], intervalTimeOffset: number,
        xMin: number, xMax: number, xPaddingInner: number,
        title: string, innerWidth: number, innerHeight: number
    }) => {

    if (!dates || dates.length === 0) return
    const xMinDateTime = dates[0].getTime() - intervalTimeOffset
    const xMaxDateTime = dates[dates.length - 1].getTime() + intervalTimeOffset
    const scale = d3.scaleBand<Date>()
        .domain(dates)
        .range([xMin, xMax])

    const tickDensity = 100
    const tickCount = (xMax - xMin) / tickDensity
    const countGap = Math.ceil(dates.length / tickCount)
    const timeDiff = xMinDateTime - xMaxDateTime
    const timeGap = Math.ceil(timeDiff / tickCount)

    const { formatter, filter } = getTickFormat(countGap, timeGap)

    let currTick = { date: new Date(xMinDateTime), index: 0 }
    let lastTick = { date: new Date(xMinDateTime), index: 0 }

    return (
        <g transform={`translate(${0},${innerHeight})`} >
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
                dates.map((date: Date, index: number) => {
                    if (currTick.index !== lastTick.index) {
                        lastTick = currTick
                    }

                    if (filter({ date, index, lastTickDate: lastTick.date, lastTickIndex: lastTick.index }) || index === 0) {
                        currTick = { date, index }

                        return <g key={date.toUTCString()} transform={`translate(${scale(date)! + scale.bandwidth() / 2},0)`}>
                            <line y1={0} y2={8} stroke="currentColor" ></line>
                            <line y1={0} y2={-innerHeight} stroke="currentColor" strokeOpacity={0.1}></line>
                            <text
                                y={10}
                                dy="0.8em"
                                textAnchor="middle"
                                fill="currentColor"
                                className="text-sm text-muted-foreground"
                            >
                                {formatter(date, lastTick.date)}
                            </text>
                        </g>
                    }
                })
            }
        </g >
    )
}

const YAxis = ({ scale, title, innerWidth, innerHeight, formatter }:
    {
        scale: d3.ScaleLinear<number, number, never>, title: string, innerWidth: number, innerHeight: number
        formatter: (value: number | { valueOf(): number }) => string
    }) => {

    const [yMax, yMin] = scale.range()
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