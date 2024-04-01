import { NavigationMenu } from "@/components/ui/navigation-menu"
import { NavigationListFormatter as ListFormatter, INavigationItem } from "../utils/navigationUtils"

const items: INavigationItem[] = [
    { type: "text", text: "© finance mate 2024" },
]

const Footer = () => {
    return (
        <NavigationMenu className="">
            {ListFormatter(items)}
        </NavigationMenu>
    )
}

export default Footer