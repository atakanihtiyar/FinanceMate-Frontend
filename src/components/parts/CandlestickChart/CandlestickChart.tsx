import React, { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { XAxis, YAxis } from "./CandlestickAxes"
import Candlesticks, { Bar, getAvailableBars } from "./Candlesticks"
import { Button } from "@/components/ui/button"

interface Interval {
    title: string,
    timeFrame: string,
}

interface CandlestickChartProps {
    data: Bar[],
    intervals: Interval[],
    onIntervalBtnClicked: (timeFrame: string) => void,
    yAxisFormatter: (value: number | { valueOf(): number }) => string,
    tooltipDateFormatter: (date: Date) => string
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, intervals, onIntervalBtnClicked, yAxisFormatter, tooltipDateFormatter }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity)
    const [tooltipBar, setTooltipBar] = useState<Bar | null>(null)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
    const [tooltipTextColor, setTooltipTextColor] = useState<string>("")

    const availableBarsRef = useRef<Bar[]>([])
    const xScaleRef = useRef<d3.ScaleBand<Date>>(d3.scaleBand<Date>())
    const yScaleRef = useRef<d3.ScaleLinear<number, number>>(d3.scaleLinear())

    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current
                setDimensions({ width: clientWidth, height: clientHeight })
            }
        }
        updateDimensions()
        window.addEventListener("resize", updateDimensions)
        return () => window.removeEventListener("resize", updateDimensions)
    }, [])

    if (data.length === 0) return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

    const { width, height } = dimensions
    const margin = { top: 50, right: 30, bottom: 30, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    let xScale = d3.scaleBand<Date>()
        .domain(data.map((bar) => bar.date))
        .range([0, innerWidth])
        .paddingInner(0.35)

    let yScale = d3.scaleLinear()
        .domain([d3.min(data, (bar) => bar.low * 0.98)!, d3.max(data, (bar) => bar.high * 1.02)!])
        .range([innerHeight, 0])

    const availableBars = getAvailableBars(data, xScale, yScale, zoomTransform)
    if (availableBars) {
        availableBarsRef.current = availableBars

        const offset = availableBars[1].date.getTime() - availableBars[0].date.getTime()
        xScale = xScale.domain([
            new Date(availableBars[0].date.getTime() - offset),
            ...availableBars.map((bar: Bar) => bar.date),
            new Date(availableBars[availableBars.length - 1].date.getTime() + offset)
        ])

        yScale = yScale.domain([
            d3.min(availableBars, (bar: Bar) => bar.low * 0.98) as number,
            d3.max(availableBars, (bar: Bar) => bar.high * 1.02) as number
        ])

        xScaleRef.current = xScale
        yScaleRef.current = yScale
    }

    const handleMouseDown = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        event.preventDefault()
        setIsDragging(true)
        setDragStart({ x: event.clientX, y: event.clientY })
    }

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        event.preventDefault()
        if (!isDragging) return

        let offsetX = (event.clientX - dragStart.x) / zoomTransform.k
        let offsetY = (event.clientY - dragStart.y) / zoomTransform.k

        const newTransform = zoomTransform.translate(offsetX, offsetY)
        setZoomTransform(newTransform)
        setDragStart({ x: event.clientX, y: event.clientY })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseEnterCandle = (bar: Bar) => {
        setTooltipBar(bar)
        const diff = bar.close - bar.open
        setTooltipTextColor(diff > 0 ? "text-[--success]" : diff < 0 ? "text-destructive" : "text-foreground")
    }

    const handleMouseExitCandle = () => {
        setTooltipBar(null)
    }

    const handleMouseHoverCandle = (mousePosition: { x: number, y: number }) => {
        setTooltipPosition(mousePosition)
    }

    const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
        event.preventDefault()
        const scaleFactor = event.deltaY < 0 ? 1.1 : event.deltaY > 0 ? 0.9 : 0
        if (scaleFactor === 0) return
        const transform = zoomTransform.scale(scaleFactor)
        if (transform.k < 1 || transform.k > 30) return
        setZoomTransform(transform)
    }

    return (
        <div ref={containerRef} className="w-full h-full">
            <div className="border-b-2">
                {intervals.map((btn) => (
                    <Button key={btn.timeFrame} variant="ghost" className="rounded-sm"
                        onClick={() => onIntervalBtnClicked(btn.timeFrame)}>{btn.title}</Button>
                ))}
            </div>
            <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="bg-transparent"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <g transform={`translate(${margin.left},${margin.top})`}>
                    <XAxis scale={xScaleRef.current} title="Date" innerHeight={innerHeight} />
                    <YAxis scale={yScaleRef.current} title="Dollars" innerWidth={innerWidth}
                        innerHeight={innerHeight} formatter={yAxisFormatter} />
                    <Candlesticks data={availableBarsRef.current} xScale={xScaleRef.current}
                        yScale={yScaleRef.current}
                        onMouseEnterCandle={handleMouseEnterCandle}
                        onMouseExitCandle={handleMouseExitCandle}
                        onMouseHoverCandle={handleMouseHoverCandle}
                    />
                </g>
            </svg>
            {tooltipBar && !isDragging && (
                <div ref={tooltipRef} style={{ top: tooltipPosition.y, left: tooltipPosition.x }} className="absolute bg-background border border-foreground p-2 m-5">
                    <div><span className="text-muted-foreground">Date: </span><span>{tooltipDateFormatter(tooltipBar.date)}</span></div>
                    <div><span className="text-muted-foreground">Open: </span><span className={tooltipTextColor}>{d3.format("$~f")(tooltipBar.open)}</span></div>
                    <div><span className="text-muted-foreground">High: </span><span className={tooltipTextColor}>{d3.format("$~f")(tooltipBar.high)}</span></div>
                    <div><span className="text-muted-foreground">Low: </span><span className={tooltipTextColor}>{d3.format("$~f")(tooltipBar.low)}</span></div>
                    <div><span className="text-muted-foreground">Close: </span><span className={tooltipTextColor}>{d3.format("$~f")(tooltipBar.close)}</span></div>
                </div>
            )}
        </div>
    )
}

export default CandlestickChart
