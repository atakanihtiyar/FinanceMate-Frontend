import * as d3 from "d3"
import { useRef } from "react"

export interface XTicks {
    formatter: (date: Date, index: number, lastTickDate: Date, lastTickIndex: number) => string,
    filter: (date: Date, index: number, lastTickDate: Date, lastTickIndex: number) => boolean,
}

const XAxis = ({ scale, title, innerHeight, ticks, secondaryTicks }:
    {
        scale: d3.ScaleBand<Date>, title: string, innerHeight: number,
        ticks: XTicks,
        secondaryTicks?: XTicks,
    }) => {

    const [xMin, xMax] = scale.range()
    const _ticks = d3.axisBottom(scale)
        .tickValues(scale.domain()).tickValues()!

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
                _ticks.map((date: Date, index: number) => {
                    const x = scale(date)
                    if (currTick.current.index !== lastTick.current.index) {
                        lastTick.current.date = currTick.current.date
                        lastTick.current.index = currTick.current.index
                    }
                    if (ticks.filter(date, index, lastTick.current.date, lastTick.current.index)) {
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
                                {ticks.formatter(date, index, lastTick.current.date, lastTick.current.index)}
                            </text>

                            {
                                secondaryTicks && secondaryTicks.filter(date, index, lastTick.current.date, lastTick.current.index) &&
                                <text
                                    y={25}
                                    dy="0.8em"
                                    textAnchor="middle"
                                    fill="currentColor"
                                    className="text-sm text-muted-foreground"
                                >
                                    {secondaryTicks.formatter(date, index, lastTick.current.date, lastTick.current.index)}
                                </text>
                            }
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