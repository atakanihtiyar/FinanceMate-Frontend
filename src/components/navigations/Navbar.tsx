import { NavigationMenu } from "@/components/ui/navigation-menu"
import { NavigationListFormatter as ListFormatter, INavigationItem } from "./navigationUtils"

const leftSideItems: INavigationItem[] = [
    { type: "link", text: "about us", url: "/about" },
    { type: "link", text: "pricing", url: "/pricing" },
]

const middleSideItems: INavigationItem[] = [
    { type: "link", text: "FIMATE", url: "/", style: { size: "xl" } }
]

const rightSideItems: INavigationItem[] = [
    { type: "link", text: "login", url: "/login" },
    { type: "link", text: "register", url: "/register" },
]

const Navbar = () => {
    return (
        <NavigationMenu className="">
            {ListFormatter(leftSideItems)}
            {ListFormatter(middleSideItems)}
            {ListFormatter(rightSideItems)}
        </NavigationMenu>
    )
}

export default Navbar