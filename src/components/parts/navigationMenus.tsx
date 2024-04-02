import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const Navbar = () => {
    const brandClass = "tw-text-xl"

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <a href="/about">about</a>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <a href="/pricing">pricing</a>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <a href="/" className={brandClass}>FIMATE</a>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <a href="/login">login</a>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <a href="/register">register</a>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

    )
}

const Footer = () => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem className="tw-text-muted tw-text-sm">
                    © finance mate 2024
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export { Navbar, Footer }