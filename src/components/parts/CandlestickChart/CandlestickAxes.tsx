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
        allDateCount: number,
        date: Date,
        index: number,
        lastTickDate: Date,
        lastTickIndex: number,
    }

    return {
        formatter: multiFormat,
        filter: ({ allDateCount, date, index, lastTickDate, lastTickIndex }: FilterProps) =>
            isTimeGapReached(date, lastTickDate) &&
            (isCountGapReached(index, lastTickIndex) && allDateCount - index > 4) || index === 0 || (index === allDateCount - 1)
    }
}


const XAxis = ({ scale, intervalTimeOffset, title, innerHeight }:
    {
        scale: d3.ScaleBand<Date>, intervalTimeOffset: number,
        title: string, innerHeight: number
    }) => {

    const [xMin, xMax] = scale.range()
    const dates = scale.domain()
    const xMinDateTime = dates[0].getTime() - intervalTimeOffset
    const xMaxDateTime = dates[dates.length - 1].getTime()

    const tickDensity = 100
    const tickCount = (xMax - xMin) / tickDensity
    const countGap = Math.ceil(dates.length / tickCount)
    const timeDiff = xMinDateTime - xMaxDateTime
    const timeGap = Math.ceil(timeDiff / tickCount)

    const { formatter, filter } = getTickFormat(countGap, timeGap)

    let currTick = { date: new Date(xMinDateTime), index: -999 }
    let lastTick = { date: new Date(xMinDateTime), index: -999 }

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

                    if (filter({ allDateCount: dates.length, date, index, lastTickDate: lastTick.date, lastTickIndex: lastTick.index })) {
                        currTick = { date, index }

                        let x = scale(date)! + scale.bandwidth() / 2
                        if (index === 0)
                            x = scale(date)!
                        else if (index === dates.length - 1)
                            x = scale(date)!

                        return <g key={date.toUTCString()} transform={`translate(${x},0)`}>
                            <line y1={0} y2={8} stroke="currentColor" ></line>
                            <line y1={0} y2={-innerHeight} stroke="currentColor" strokeOpacity={0.1}></line>
                            <text
                                y={16}
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

const YAxis = ({ scale, title, innerWidth, innerHeight }:
    {
        scale: d3.ScaleLinear<number, number, never>, title: string, innerWidth: number, innerHeight: number
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
                            dx={-16}
                            dy="0.34em"
                            textAnchor="end"
                            fill="currentColor"
                            className="text-sm text-muted-foreground"
                        >
                            {d3.format("$~f")(value)}
                        </text>
                    </g>
                })
            }
        </g>
    )
}

export { XAxis, YAxis }