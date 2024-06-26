import * as d3 from "d3"
import { Bar } from "./Candlesticks"

interface TooltipProps {
    bar: Bar | null
    relativePosition: { x: number, y: number }
}

const Tooltip: React.FC<TooltipProps> = ({ bar, relativePosition }) => {
    if (!bar) return null
    const diff = bar.close - bar.open
    const textColor = diff > 0 ? "text-[--success]" : diff < 0 ? "text-destructive" : "text-foreground"

    return (
        <div style={{ top: relativePosition.y, left: relativePosition.x }}
            className="absolute bg-background border border-foreground p-2 m-5 shadow-xl"
        >
            <div>
                <span className="text-muted-foreground font-mono">Date : </span>
                <span className="text-foreground">{d3.utcFormat("%a %d %b %Y %H:%M")(bar.date)}</span>
            </div>
            <div>
                <span className="text-muted-foreground font-mono">Open : </span>
                <span className={textColor}>{d3.format("$~f")(bar.open)}</span>
            </div>
            <div>
                <span className="text-muted-foreground font-mono">High : </span>
                <span className={textColor}>{d3.format("$~f")(bar.high)}</span>
            </div>
            <div>
                <span className="text-muted-foreground font-mono">Low &nbsp;: </span>
                <span className={textColor}>{d3.format("$~f")(bar.low)}</span>
            </div>
            <div>
                <span className="text-muted-foreground font-mono">Close: </span>
                <span className={textColor}>{d3.format("$~f")(bar.close)}</span>
            </div>
        </div>
    )
}
export default Tooltip