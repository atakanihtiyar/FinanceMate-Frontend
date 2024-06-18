import * as d3 from "d3"

const XAxis = ({ scale, title, innerHeight }:
    { scale: d3.ScaleBand<Date>, title: string, innerHeight: number }) => {

    const [xMin, xMax] = scale.range()
    const ticks = d3.axisBottom(scale)
        .tickValues(scale.domain()
            .filter((date: Date) => date.getUTCHours() === 8 || date.getUTCHours() === 16)
        ).tickValues()!
    d3.scaleTime().tickFormat()
    const hourFormatter = d3.utcFormat("%H:%M")
    const dayformatter = d3.utcFormat("%a %d")

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
                ticks.map((date: Date) => {
                    const x = scale(date)
                    return <g key={date.toString()} transform={`translate(${x},0)`}>
                        <line y1={0} y2={8} stroke="currentColor" ></line>
                        <line y1={0} y2={-innerHeight} stroke="currentColor" strokeOpacity={0.1}></line>
                        <text
                            y={10}
                            dy="0.8em"
                            textAnchor="middle"
                            fill="currentColor"
                            className="text-sm text-muted-foreground"
                        >
                            {hourFormatter(date)}
                        </text>
                        {
                            date.getUTCHours() === 8 &&
                            <text
                                y={20}
                                dy="1.25em"
                                textAnchor="middle"
                                fill="currentColor"
                                className="text-sm text-muted-foreground"
                            >
                                {dayformatter(date)}
                            </text>
                        }
                    </g>
                })
            }
        </g>
    )
}

const YAxis = ({ scale, title, innerWidth, innerHeight }:
    { scale: d3.ScaleLinear<number, number, never>, title: string, innerWidth: number, innerHeight: number }) => {

    const [yMin, yMax] = scale.range()
    const ticks = scale.ticks(innerHeight / 40)
    const formatter = d3.format("$~f")

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