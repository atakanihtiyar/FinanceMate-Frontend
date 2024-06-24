import * as d3 from "d3"

export interface Bar {
    date: Date
    low: number
    open: number
    close: number
    high: number
}

export const getAvailableBars = (data: Bar[],
    xMin: number,
    xMax: number,
    xPaddingInner: number,
    zoomTransform: d3.ZoomTransform) => {
    const candleCount = data.length / zoomTransform.k
    const bandWidth = (xMax - xMin) / candleCount
    let dataOnRight = true
    let dataOnLeft = true

    const filteredData = data.filter((_bar: Bar, index: number) => {

        const xOffset = (index + xPaddingInner) * bandWidth
        const x = zoomTransform.applyX((xOffset + zoomTransform.x - bandWidth / 2))
        if (x < xMin || x > xMax) return false

        if (index === 0)
            dataOnLeft = false
        if (index === data.length - 1)
            dataOnRight = false

        return true
    })

    if (filteredData)
        return { filteredData, dataOnRight, dataOnLeft }
    else
        return false
}

interface CandlesticksProps {
    data: Bar[],
    xMin: number,
    xMax: number,
    barPadding: number,
    yScale: d3.ScaleLinear<number, number, never>,
    onWheel: (event: React.WheelEvent<SVGSVGElement>) => void,
    onMouseEnterCandle: (bar: Bar) => void
    onMouseExitCandle: () => void
    onMouseHoverCandle: (mousePosition: { x: number, y: number }) => void
}

const Candlesticks = (
    {
        data, xMin, xMax, barPadding, yScale, onWheel,
        onMouseEnterCandle, onMouseExitCandle, onMouseHoverCandle
    }: CandlesticksProps) => {

    const width = xMax - xMin
    const candleCount = data.length
    const bandWidth = width / candleCount
    const padding = (bandWidth * barPadding)
    const [yMax, yMin] = yScale.range()

    return (
        <g onWheel={onWheel}>
            <line x1={width / 2} x2={width / 2} y1={yMin} y2={yMax} stroke="transparent" strokeWidth={width} />

            {
                data.map((bar: Bar, index: number) => {

                    const x = index * bandWidth + bandWidth / 2

                    const yLow = yScale(bar.low)
                    const yOpen = yScale(bar.open)
                    const yClose = yScale(bar.close)
                    const yHigh = yScale(bar.high)
                    if (!(yLow > yMin || yLow < yMax ||
                        yOpen > yMin || yOpen < yMax ||
                        yClose > yMin || yClose < yMax ||
                        yHigh > yMin || yHigh < yMax)) return false

                    return <g key={bar.date.toString() + bar.close} transform={`translate(${x}, 0)`}
                        onMouseEnter={() => onMouseEnterCandle(bar)}
                        onMouseLeave={onMouseExitCandle}
                        onMouseMove={(e: React.MouseEvent<SVGGElement, MouseEvent>) => onMouseHoverCandle({ x: e.pageX, y: e.pageY })}
                    >
                        <line y1={yScale(bar.low)} y2={yScale(bar.high)} stroke="white" />
                        <line y1={yScale(bar.close)} y2={yScale(bar.open)} strokeWidth={bandWidth - padding}
                            stroke={bar.open > bar.close ? d3.schemeSet1[0]
                                : bar.close > bar.open ? d3.schemeSet1[2]
                                    : d3.schemeSet1[8]} />
                    </g>
                })
            }
        </g>
    )
}

export default Candlesticks