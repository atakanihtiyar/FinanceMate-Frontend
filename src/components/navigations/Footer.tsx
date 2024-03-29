import {
    navigationMenuTriggerStyle,
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
} from "@/components/ui/navigation-menu"
import { Typo } from "../ui/text"

const Footer = () => {
    return (
        <NavigationMenu className="">
            <NavigationMenuList>
                <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                    <Typo variant="body">© finance mate 2024</Typo>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default Footer