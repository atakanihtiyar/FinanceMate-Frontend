import * as d3 from "d3"

export interface Bar {
    date: Date
    low: number
    open: number
    close: number
    high: number
}

export const getAvailableBars = (data: Bar[],
    xScale: d3.ScaleBand<Date>,
    yScale: d3.ScaleLinear<number, number, never>,
    zoomTransform: d3.ZoomTransform) => {
    const [xMin, xMax] = xScale.range()
    const [yMax, yMin] = yScale.range()
    let dataOnRight = true
    let dataOnLeft = true
    const filteredData = data.filter((bar: Bar, index: number) => {
        const bandWidth = xScale.bandwidth() * zoomTransform.k

        const x = zoomTransform.applyX(xScale(bar.date)!) + bandWidth / 2
        if (x < xMin || x > xMax) return false

        const yLow = zoomTransform.applyY(yScale(bar.low))
        const yOpen = zoomTransform.applyY(yScale(bar.open))
        const yClose = zoomTransform.applyY(yScale(bar.close))
        const yHigh = zoomTransform.applyY(yScale(bar.high))
        if (!(yLow > yMin || yLow < yMax ||
            yOpen > yMin || yOpen < yMax ||
            yClose > yMin || yClose < yMax ||
            yHigh > yMin || yHigh < yMax)) return false

        if (index === 0)
            dataOnRight = false
        if (index === data.length - 1)
            dataOnLeft = false

        return true
    })

    if (filteredData.length > 5)
        return { filteredData, dataOnRight, dataOnLeft }
    else
        return false
}

interface CandlesticksProps {
    data: Bar[],
    xScale: d3.ScaleBand<Date>,
    yScale: d3.ScaleLinear<number, number, never>,
    onMouseEnterCandle: (bar: Bar) => void
    onMouseExitCandle: () => void
    onMouseHoverCandle: (mousePosition: { x: number, y: number }) => void
}

const Candlesticks = ({ data, xScale, yScale, onMouseEnterCandle, onMouseExitCandle, onMouseHoverCandle }: CandlesticksProps) => {

    const [xMin, xMax] = xScale.range()
    const [yMax, yMin] = yScale.range()

    return (
        <g>
            {
                data.map((bar: Bar) => {

                    const x = xScale(bar.date)!
                    if (x < xMin || x > xMax) return false

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
                        <line y1={yScale(bar.close)} y2={yScale(bar.open)} strokeWidth={xScale.bandwidth()}
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