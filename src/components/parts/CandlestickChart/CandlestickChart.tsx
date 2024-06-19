import React, { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { XAxis, XTicks, YAxis } from "./CandlestickAxes"
import Candlesticks, { Bar } from "./Candlesticks"
import { Button } from "@/components/ui/button"

interface TimeFrames {
    title: string,
    interval: string,
    timeOffset: number,
    ticks: XTicks,
    secondaryTicks?: XTicks,
}

interface CandlestickChartProps {
    symbol: string,
    timeFrames: TimeFrames[]
    getData: (symbol: string, timeFrame: string) => Promise<Bar[]>,
    yAxisFormatter: (value: number | { valueOf(): number }) => string,
    tooltipDateFormatter: (date: Date) => string

}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ symbol, timeFrames, yAxisFormatter, getData, tooltipDateFormatter }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    const [data, setData] = useState<Bar[]>([])
    const [currTimeFrame, setCurrTimeFrame] = useState<TimeFrames>(timeFrames[0])

    useEffect(() => {
        getData(symbol, currTimeFrame.interval).then((bars: Bar[]) => {
            setData(bars)
        })
    }, [symbol, currTimeFrame])

    const tooltipRef = useRef<HTMLDivElement>(null)
    const [tooltipBar, setTooltipBar] = useState<Bar | null>(null)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
    const [tooltipTextColor, setTooltipTextColor] = useState<string>("")

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current
                setDimensions({ width: clientWidth, height: clientHeight })
            }
        }
        updateDimensions()
        window.addEventListener("resize", updateDimensions)

        return () => window.addEventListener("resize", updateDimensions)
    }, [])

    const { width: width, height: height } = dimensions
    const margin = { top: 50, right: 30, bottom: 30, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    if (!data || data.length === 0) return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

    const startDay = new Date(data[0].date.getTime() - currTimeFrame.timeOffset)
    const endDay = new Date(data[data.length - 1].date.getTime() + currTimeFrame.timeOffset)
    const allDates = [startDay, ...data.map((bar: Bar) => bar.date), endDay]
    const minPrice: number = d3.min(data, (bar: Bar) => bar.low * 0.98) as number
    const maxPrice: number = d3.max(data, (bar: Bar) => bar.high * 1.02) as number

    const xScale = d3.scaleBand<Date>()
        .domain(allDates)
        .range([0, innerWidth])
        .paddingInner(.35)

    const yScale = d3.scaleLinear()
        .domain([minPrice, maxPrice])
        .rangeRound([innerHeight, 0])

    return (
        <div ref={containerRef} className="w-full h-full">
            <div className="border-b-2">
                {
                    timeFrames.map((btn: TimeFrames) => {
                        return <Button key={btn.interval} variant="ghost" className="rounded-sm"
                            onClick={() => setCurrTimeFrame(btn)}>{btn.title}</Button>
                    })
                }
            </div>
            <svg viewBox={`0,0,${width},${height}`} className="bg-transparent">
                <g transform={`translate(${margin.left},${margin.bottom})`}>
                    <XAxis
                        scale={xScale}
                        title="Date"
                        innerHeight={innerHeight}
                        ticks={currTimeFrame.ticks}
                        secondaryTicks={currTimeFrame.secondaryTicks}
                    />
                    <YAxis
                        scale={yScale}
                        title="Dollars"
                        innerWidth={innerWidth}
                        innerHeight={innerHeight}
                        formatter={yAxisFormatter}
                    />
                    <Candlesticks
                        data={data}
                        xScale={xScale}
                        yScale={yScale}
                        onMouseEnterCandle={(bar: Bar) => {
                            setTooltipBar(bar)
                            const diff = bar.close - bar.open
                            setTooltipTextColor(diff > 0 ? "text-[--success]" : diff < 0 ? "text-destructive" : "text-foreground")
                        }}
                        onMouseExitCandle={() => {
                            setTooltipBar(null)
                        }}
                        onMouseHoverCandle={(mousePosition: { x: number, y: number }) => {
                            setTooltipPosition(mousePosition)
                        }}
                    />
                </g>
            </svg>
            {
                tooltipBar !== null &&
                <div ref={tooltipRef}
                    style={{ top: tooltipPosition.y, left: tooltipPosition.x }}
                    className={`absolute bg-background border-[1px] border-solid border-foreground p-2 m-5`}>
                    <div>
                        <span className="text-muted-foreground">Date: </span>
                        <span>{tooltipDateFormatter(tooltipBar.date)}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Open: </span>
                        <span className={tooltipTextColor}>{d3.format("$~f")(tooltipBar.open)}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">High: </span>
                        <span className={tooltipTextColor}>{d3.format("$~f")(tooltipBar.high)}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Low: </span>
                        <span className={tooltipTextColor}>{d3.format("$~f")(tooltipBar.low)}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Close: </span>
                        <span className={tooltipTextColor}>{d3.format("$~f")(tooltipBar.close)}</span>
                    </div>
                </div>
            }
        </div >
    )
}

export default CandlestickChart