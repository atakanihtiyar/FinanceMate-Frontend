import * as d3 from "d3"
import { useState } from "react"

export interface Point {
    date: Date
    value: number
}

export const getAvailablePoints = (data: Point[],
    xScale: d3.ScaleBand<Date>,
    zoomTransform: d3.ZoomTransform) => {

    const [xMin, xMax] = xScale.range()
    let dataOnRight = true
    let dataOnLeft = true

    const filteredData = data.filter((point: Point, index: number) => {
        const x = zoomTransform.applyX(xScale(point.date)!)

        if (x < xMin || x > xMax) return false

        if (index === 0)
            dataOnLeft = false
        if (index === data.length - 1)
            dataOnRight = false

        return true
    })

    return { filteredData, dataOnRight, dataOnLeft }
}

interface LinesProps {
    data: Point[],
    xScale: d3.ScaleBand<Date>,
    yScale: d3.ScaleLinear<number, number, never>,
    onWheel: (event: React.WheelEvent<SVGSVGElement>) => void,
    onMouseEnterLine: (bar: Point) => void
    onMouseExitLine: () => void
    onMouseHoverLine: (mousePosition: { x: number, y: number }) => void
}

const Lines = (
    {
        data, xScale, yScale, onWheel,
        onMouseEnterLine, onMouseExitLine, onMouseHoverLine
    }: LinesProps) => {

    const [isHovering, setIsHovering] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState(-1)
    const [hoverMousePos, setHoverMousePos] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

    const [xMin, xMax] = xScale.range()
    const [yMax, yMin] = yScale.range()
    const width = xMax - xMin

    let startPointValue = data[0].value
    let startPointY = yScale(data[0].value)!

    return (
        <g
            onWheel={onWheel}
            onMouseEnter={() => setIsHovering(true)}
            onMouseMove={(e: React.MouseEvent<SVGGElement, MouseEvent>) => {
                const mousePos = d3.pointer(e)
                setHoverMousePos({ x: mousePos[0], y: mousePos[1] })
                setHoveredIndex(Math.floor((hoverMousePos.x - xScale.paddingOuter()) / xScale.step()))
            }}
            onMouseLeave={() => setIsHovering(false)}
        >
            <g>
                <line
                    x1={width / 2} x2={width / 2} y1={yMin} y2={yMax}
                    strokeWidth={width}
                    className="stroke-transparent"
                />
            </g>
            {data.slice(1).map((point, index) => {
                const prevPoint = data[index];
                const x1 = xScale(prevPoint.date)!;
                const y1 = yScale(prevPoint.value)!;
                const x2 = xScale(point.date)!;
                const y2 = yScale(point.value)!;

                const halfX = x1 + (x2 - x1) / 2;
                const isStartPointAbove = prevPoint.value > startPointValue;
                const strokeColor = point.value > startPointValue ? "stroke-[--success]" : "stroke-destructive";

                return (
                    <g key={x2 + y2 + point.value}
                        onMouseEnter={() => onMouseEnterLine(point)}
                        onMouseLeave={onMouseExitLine}
                        onMouseMove={(e) => onMouseHoverLine({ x: e.pageX, y: e.pageY })}
                    >
                        {isStartPointAbove && point.value < startPointValue ? (
                            <>
                                <line x1={x1} x2={halfX} y1={y1} y2={startPointY} className="stroke-[--success] stroke-[2px] hover:stroke-[5px]" strokeLinecap="round" />
                                <line x1={halfX} x2={x2} y1={startPointY} y2={y2} className="stroke-destructive stroke-[2px] hover:stroke-[5px]" strokeLinecap="round" />
                            </>
                        ) : !isStartPointAbove && point.value > startPointValue ? (
                            <>
                                <line x1={x1} x2={halfX} y1={y1} y2={startPointY} className="stroke-destructive stroke-[2px] hover:stroke-[5px]" strokeLinecap="round" />
                                <line x1={halfX} x2={x2} y1={startPointY} y2={y2} className="stroke-[--success] stroke-[2px] hover:stroke-[5px]" strokeLinecap="round" />
                            </>
                        ) : (
                            <line x1={x1} x2={x2} y1={y1} y2={y2} className={`${strokeColor} stroke-[2px] hover:stroke-[5px]`} strokeLinecap="round" />
                        )}
                    </g>
                );
            })}
            {
                isHovering && data[hoveredIndex] &&
                <>
                    <line
                        x1={hoverMousePos.x} x2={hoverMousePos.x} y1={yMin} y2={yMax}
                        className="stroke-foreground pointer-events-none"
                    />
                    <line
                        x1={xMin} x2={xMax} y1={hoverMousePos.y} y2={hoverMousePos.y}
                        className="stroke-foreground pointer-events-none"
                    />
                </>
            }
        </g>
    )
}

export default Lines