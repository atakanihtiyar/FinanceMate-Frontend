import { Sizes } from "../../Style";
import Text from "./Text";
import "./styles/Button.css"

export enum ButtonTemplates {
    OUTLINE = "outline",
    FIILED = "filled"
}

interface params {
    size?: Sizes,
    disabled?: boolean
    template: ButtonTemplates,
    text: string,
    onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
}

const Button = ({ size = Sizes.MEDIUM, disabled = false, template, text, onClick }: params) => {

    const ClickHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        onClick(e)
    }

    return (
        <a className={`btn ${template} ${size} ${disabled ? " disabled" : ""}`}
            onClick={e => ClickHandler(e)}>
            <Text text={text} size={size} />
        </a>
    )
}

export default Button