import * as d3 from "d3"

export interface Bar {
    date: Date
    low: number
    open: number
    close: number
    high: number
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
    return (
        <g>
            {
                data.map((bar: Bar) => {
                    return <g key={bar.date.toString() + bar.close} transform={`translate(${xScale(bar.date)!}, 0)`}
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