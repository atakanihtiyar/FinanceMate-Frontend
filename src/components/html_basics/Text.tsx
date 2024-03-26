import { Colors, Fonts, Sizes } from "../../Style"
import "./styles/Text.css"

export enum TextTemplates {
    HEADING = "heading",
    SUBHEADING = "subheading",
    BASIC = "basic",
    INPUT = "input",
}

interface params {
    template: TextTemplates,
    text: string,
    color?: Colors
}

const Text = ({ template, text, color }: params) => {

    const classList = `text ${template} ${color ? ` ${color}` : ""}`;
    switch (template) {
        case TextTemplates.HEADING:
            return (
                <h1 className={classList}>
                    {text}
                </h1>
            )
        case TextTemplates.BASIC:
            return (
                <span className={classList}>
                    {text}
                </span>
            )
        default:
            break;
    }
}

export default Text