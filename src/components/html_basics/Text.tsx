import { Colors, Fonts, Sizes } from "../../Style"
import "./styles/Text.css"

export enum TextTemplates {
    H1 = "h1",
    BASIC = "basic",
    HERO = "hero"
}

interface params {
    template?: TextTemplates,
    font?: Fonts,
    color?: Colors,
    size?: Sizes,
    text: string,
}

const Text = ({ template, font, color, size, text }: params) => {
    return (
        <span className={`text ${template}
            ${font ? ` ${font}` : ""} 
            ${color ? ` ${color}` : ""} 
            ${size ? ` ${size}` : ""}`} >
            {text}
        </span>
    )
}

export default Text