import {
    navigationMenuTriggerStyle,
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Typo } from "../ui/text"

const Navbar = () => {
    return (
        <NavigationMenu className="">
            <NavigationMenuList>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                    <Typo variant="body">about us</Typo>
                </NavigationMenuLink>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                    <Typo variant="body">pricing</Typo>
                </NavigationMenuLink>
            </NavigationMenuList>
            <NavigationMenuList>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                    <Typo variant="body" size="xl">FIMATE</Typo>
                </NavigationMenuLink>
            </NavigationMenuList>
            <NavigationMenuList>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                    <Typo variant="body">login</Typo>
                </NavigationMenuLink>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                    <Typo variant="body">register</Typo>
                </NavigationMenuLink>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default Navbar