import {
    navigationMenuTriggerStyle,
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Text } from "../ui/text"

const Navbar = () => {
    return (
        <NavigationMenu className="">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <a href="/">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <Text variant="p">about</Text>
                        </NavigationMenuLink>
                    </a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <a href="/">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <Text variant="p">pricing</Text>
                        </NavigationMenuLink>
                    </a>
                </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <a href="/">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <Text variant="p" size="xl">FIMATE</Text>
                        </NavigationMenuLink>
                    </a>
                </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <a href="/">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <Text variant="p">login</Text>
                        </NavigationMenuLink>
                    </a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <a href="/">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <Text variant="p">register</Text>
                        </NavigationMenuLink>
                    </a>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default Navbar