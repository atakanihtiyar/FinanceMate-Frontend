import React, { useRef, useEffect } from "react"
import * as d3 from "d3"

// Define the structure of the data
export interface Bar {
  date: Date
  low: number
  open: number
  close: number
  high: number
}

interface CandlestickChartProps {
  data: Bar[]
  width?: number
  height?: number
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, width = 600, height = 512 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!data || data.length === 0) return

    // Clear previous chart
    const svgElement = d3.select(svgRef.current)
    svgElement.selectAll("*").remove()

    // Set up the SVG canvas dimensions
    const margin = { top: 50, right: 30, bottom: 30, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const startDay = new Date(data[0].date.getTime() - (1000 * 60 * 60 * 2))
    const endDay = new Date(data[data.length - 1].date.getTime() + (1000 * 60 * 60 * 2))
    const allDates = [startDay, ...data.map((bar: Bar) => bar.date), endDay]
    const minPrice: number = d3.min(data, (bar: Bar) => bar.low * 0.98) as number
    const maxPrice: number = d3.max(data, (bar: Bar) => bar.high * 1.02) as number

    // SCALES
    const xScale = d3.scaleBand<Date>()
      .domain(allDates)
      .range([0, innerWidth])
      .paddingInner(.35)

    const yScale = d3.scaleLinear()
      .domain([minPrice, maxPrice])
      .rangeRound([innerHeight - margin.bottom, 0])

    // CONTAINER
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])

    // AXES
    const xAxis = d3.axisBottom(xScale)
      .tickValues(xScale.domain()
        .filter((_date: Date, index: number) => index % 10 === 0)
      )
      .tickFormat(d3.scaleTime().tickFormat())

    const yAxis = d3.axisLeft(yScale)
      .ticks(innerHeight / 40)
      .tickFormat(d3.format("$~f"))

    svg.append("g")
      .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
      .call(xAxis)
      .call(g => g.selectAll(".tick line").clone()
        .attr("stroke-opacity", 0.2)
        .attr("y2", -(innerHeight - margin.bottom))
      )

    svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top + margin.bottom})`)
      .call(yAxis)
      .call(g => g.selectAll(".tick line").clone()
        .attr("stroke-opacity", 0.2)
        .attr("x2", innerWidth)
      )

    // CANDLESTICKS
    const chartBody = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

    const candle = chartBody.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (bar: Bar) => `translate(${xScale(bar.date)}, 0)`)

    candle.append("line")
      .attr("y1", (bar: Bar) => yScale(bar.low))
      .attr("y2", (bar: Bar) => yScale(bar.high))
      .attr("stroke", "white")

    candle.append("line")
      .attr("y1", (bar: Bar) => yScale(bar.open))
      .attr("y2", (bar: Bar) => yScale(bar.close))
      .attr("stroke-width", xScale.bandwidth())
      .attr("stroke", (bar: Bar) => bar.open > bar.close ? d3.schemeSet1[0]
        : bar.close > bar.open ? d3.schemeSet1[2]
          : d3.schemeSet1[8])

  }, [data])

  return (
    <svg ref={svgRef}></svg>
  )
}

export default CandlestickChart