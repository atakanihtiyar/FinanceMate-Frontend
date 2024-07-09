import React, { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { XAxis, YAxis } from "../Axes"
import Candlesticks, { Bar, getAvailableBars } from "./Candlesticks"
import IntervalButtons, { Interval } from "../IntervalButtons"

interface CandlestickChartProps {
    data: Bar[],
    intervals: Interval[],
    onIntervalBtnClicked: (timeFrame: string) => void,
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, intervals, onIntervalBtnClicked }) => {

    const containerRef = useRef<HTMLDivElement>(null)
    const intervalBtnContainerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity)
    const dataOnRight = useRef<boolean>(false)
    const dataOnLeft = useRef<boolean>(false)

    const [tooltipBar, setTooltipBar] = useState<Bar | null>(null)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

    const currIntervalIndexRef = useRef<number>(intervals.findIndex((interval) => interval.isDefault)!)
    const availableBarsRef = useRef<Bar[]>([])
    const xScaleRef = useRef<d3.ScaleBand<Date>>(d3.scaleBand<Date>())
    const yScaleRef = useRef<d3.ScaleLinear<number, number>>(d3.scaleLinear())

    const [isDragging, setIsDragging] = useState(false)
    const [dragPointerPos, setDragPointerPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

    const oldTouchDistanceRef = useRef<number>(0)

    const updateDimensions = () => {
        if (containerRef.current) {
            const { clientWidth: clientWidth, clientHeight: clientHeight } = containerRef.current
            if (intervalBtnContainerRef.current) {
                const { clientHeight: intervalsClientHeight } = intervalBtnContainerRef.current
                setDimensions({ width: clientWidth, height: clientHeight - intervalsClientHeight })
            }
            else {
                setDimensions({ width: clientWidth, height: clientHeight })
            }
        }
    }

    useEffect(() => {
        updateDimensions()
    }, [data])

    useEffect(() => {
        updateDimensions()
        window.addEventListener("resize", updateDimensions)
        return () => window.removeEventListener("resize", updateDimensions)
    }, [])

    if (data.length === 0) return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

    const { width, height } = dimensions
    const margin = { top: 15, right: 10, bottom: 40, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const xMin = 0
    const xMax = innerWidth

    let xScale = d3.scaleBand<Date>()
        .domain(data.map((bar) => bar.date))
        .range([0, innerWidth])
        .paddingInner(0.35)
        .paddingOuter(0.5)
        .align(0.75)

    let yScale = d3.scaleLinear()
        .domain([d3.min(data, (bar) => bar.low * 0.98)!, d3.max(data, (bar) => bar.high * 1.02)!])
        .nice()
        .range([innerHeight, 0])

    const availableBars = getAvailableBars(data, xScale, zoomTransform)
    if (availableBars) {
        const filteredData = availableBars.filteredData
        availableBarsRef.current = availableBars.filteredData
        dataOnRight.current = availableBars.dataOnRight
        dataOnLeft.current = availableBars.dataOnLeft

        xScale = xScale.domain(filteredData.map((bar: Bar) => bar.date))

        yScale = yScale.domain([
            d3.min(filteredData, (bar: Bar) => bar.low * 0.99) as number,
            d3.max(filteredData, (bar: Bar) => bar.high * 1.01) as number
        ])
            .nice()
    }
    xScaleRef.current = xScale
    yScaleRef.current = yScale

    const zoom = (scaleFactor: number, pivotX: number) => {
        const newZoomLevel = zoomTransform.k * scaleFactor

        const offsetX = (pivotX - zoomTransform.x) / zoomTransform.k
        let newX = pivotX - offsetX * newZoomLevel

        const tooFewBars = availableBarsRef.current.length < 12
        const isZoomingIn = newZoomLevel > zoomTransform.k
        const isZoomingOut = newZoomLevel < zoomTransform.k
        if (!dataOnLeft.current && !dataOnRight.current && isZoomingOut) return
        if (tooFewBars && isZoomingIn) return

        const xMinZoom = (xMin - xMax) * newZoomLevel - (xMin - xMax)
        const xMaxZoom = xMin
        const lowerFromPositionRange = newX < xMinZoom
        const upperFromPositionRange = newX > xMaxZoom
        if (!dataOnRight.current && isZoomingOut && lowerFromPositionRange) newX = xMinZoom
        if (!dataOnLeft.current && isZoomingOut && upperFromPositionRange) newX = xMaxZoom

        const newTransform = d3.zoomIdentity
            .translate(newX, 0)
            .scale(newZoomLevel)

        setZoomTransform(newTransform)
    }

    const dragStart = ({ clientX, clientY }: { clientX: number, clientY: number }) => {
        setIsDragging(true)
        setDragPointerPos({ x: clientX, y: clientY })
    }

    const drag = ({ clientX, clientY }: { clientX: number, clientY: number }) => {
        const relativeOffsetX = (clientX - dragPointerPos.x) / (zoomTransform.k)
        const newX = relativeOffsetX
        const newTransform = zoomTransform.translate(newX, 0)

        const tringToGoLeft = newTransform.x > zoomTransform.x
        const tringToGoRight = newTransform.x < zoomTransform.x

        if (!(dataOnRight.current) && tringToGoRight) return
        if (!(dataOnLeft.current) && tringToGoLeft) return

        setZoomTransform(newTransform)
        setDragPointerPos({ x: clientX, y: clientY })
    }

    const dragEnd = () => {
        setIsDragging(false)
    }

    const handleMouseEnter = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        event.preventDefault()
        document.body.classList.add("h-full")
        document.body.classList.add("overflow-hidden")
    }

    const handleMouseExit = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        event.preventDefault()
        document.body.classList.remove("h-full")
        document.body.classList.remove("overflow-hidden")
        dragEnd()
    }

    const handleMouseDown = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        event.preventDefault()
        dragStart(event)
    }

    const handleMouseHover = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        event.preventDefault()
        if (isDragging) {
            drag(event)
        }
    }

    const handleMouseUp = () => {
        dragEnd()
    }

    const handleMouseEnterCandle = (bar: Bar) => {
        setTooltipBar(bar)
    }

    const handleMouseExitCandle = () => {
        setTooltipBar(null)
    }

    const handleMouseHoverCandle = (mousePosition: { x: number, y: number }) => {
        setTooltipPosition(mousePosition)
    }

    const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
        event.preventDefault()
        const scaleFactor = event.deltaY < 0 ? 1.05 : event.deltaY > 0 ? 0.95 : 1
        const pivotX = d3.pointer(event)[0]
        zoom(scaleFactor, pivotX)
    }

    const handleTouchStart = (event: React.TouchEvent<SVGSVGElement>) => {
        event.preventDefault()
        if (event.touches.length === 2) {
            const touch0 = event.touches[0]
            const touch1 = event.touches[1]

            const distance = Math.hypot(
                touch1.pageX - touch0.pageX,
                touch1.pageY - touch0.pageY
            )

            oldTouchDistanceRef.current = distance
        }
        else if (event.touches.length === 1) {
            dragStart(event.touches[0])
        }
    }

    const handleTouchEnd = (event: React.TouchEvent<SVGSVGElement>) => {
        event.preventDefault()
        oldTouchDistanceRef.current = 0
        dragEnd()
    }

    const handleTouchMove = (event: React.TouchEvent<SVGSVGElement>) => {
        event.preventDefault()

        if (event.touches.length === 2) {
            const touch1 = event.touches[0]
            const touch2 = event.touches[1]

            const distance = Math.hypot(
                touch2.pageX - touch1.pageX,
                touch2.pageY - touch1.pageY
            )

            const scaleFactor = distance > oldTouchDistanceRef.current ? 1.05 : 0.95
            const pivotX = d3.pointer(touch1)[0]
            zoom(scaleFactor, pivotX)

            oldTouchDistanceRef.current = distance
        }
        else if (event.touches.length === 1) {
            drag(event.touches[0])
        }
    }

    return (
        <div ref={containerRef} className="w-full h-full flex flex-col justify-center items-center">
            <IntervalButtons
                ref={intervalBtnContainerRef}
                intervals={intervals}
                pickedAt={currIntervalIndexRef.current}
                onIntervalClick={(timeFrame) => {
                    availableBarsRef.current = []
                    dataOnRight.current = false
                    dataOnLeft.current = false

                    xScaleRef.current = xScale.domain([])
                    yScaleRef.current = yScale.domain([0, 0])

                    currIntervalIndexRef.current = intervals.findIndex(interval => interval.timeFrame === timeFrame)!
                    setTooltipBar(null)
                    setZoomTransform(d3.zoomIdentity)

                    onIntervalBtnClicked(timeFrame)
                }}
            />
            <div className="w-full h-full bg-transparent flex justify-center items-center text-center border-2 sm:hidden landscape:hidden">
                <p>Turn your screen to see the chart</p>
            </div>
            <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="bg-transparent hidden touch-none sm:flex landscape:flex"
                onMouseEnter={handleMouseEnter}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseHover}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseExit}
            >
                <g transform={`translate(${margin.left},${margin.top})`}>
                    <XAxis
                        scale={xScaleRef.current}
                        intervalTimeOffset={intervals[currIntervalIndexRef.current].timeOffset}
                        title="Date"
                        innerHeight={innerHeight} />

                    <YAxis
                        scale={yScaleRef.current}
                        title="Dollars"
                        innerWidth={innerWidth}
                        tickFormat={d3.format("$~f")}
                    />

                    <Candlesticks
                        data={availableBarsRef.current}
                        xScale={xScaleRef.current}
                        yScale={yScaleRef.current}
                        onWheel={handleWheel}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseEnterCandle={handleMouseEnterCandle}
                        onMouseExitCandle={handleMouseExitCandle}
                        onMouseHoverCandle={handleMouseHoverCandle}
                    />
                </g>
            </svg>
            {
                (() => {
                    if (!tooltipBar) return

                    const diff = tooltipBar.close - tooltipBar.open
                    const textColor = diff > 0 ? "text-[--success]" : diff < 0 ? "text-destructive" : "text-foreground"

                    return <div style={{ top: tooltipPosition.y, left: tooltipPosition.x }}
                        className="absolute bg-background border border-foreground p-2 m-5 shadow-xl"
                    >
                        <div>
                            <span className="text-muted-foreground font-mono">Date : </span>
                            <span className="text-foreground">{d3.utcFormat("%a %d %b %Y %H:%M")(tooltipBar.date)}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground font-mono">Open : </span>
                            <span className={textColor}>{d3.format("$~f")(tooltipBar.open)}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground font-mono">High : </span>
                            <span className={textColor}>{d3.format("$~f")(tooltipBar.high)}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground font-mono">Low &nbsp;: </span>
                            <span className={textColor}>{d3.format("$~f")(tooltipBar.low)}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground font-mono">Close: </span>
                            <span className={textColor}>{d3.format("$~f")(tooltipBar.close)}</span>
                        </div>
                    </div>
                })()
            }
        </div>
    )
}

export default CandlestickChart
