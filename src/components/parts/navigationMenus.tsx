import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerGhostStyle,
} from "@/components/ui/navigation-menu"
import { UserContext, UserContextValues } from "@/context/UserContext"
import { useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ModeToggle } from "../mode-toggle"

const Navbar = () => {
    const { isLoggedIn, LogOut } = useContext(UserContext) as UserContextValues
    const navigate = useNavigate()
    const location = useLocation()
    const isThisDashboard = location.pathname.includes("/dashboard")

    return (
        <NavigationMenu>
            {
                !isThisDashboard &&
                <>{
                    isLoggedIn ?
                        <>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink href="/dashboard" className={navigationMenuTriggerGhostStyle()}>
                                        dashboard
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </> : <>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink href="/about" className={navigationMenuTriggerGhostStyle()}>
                                        about
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink href="/pricing" className={navigationMenuTriggerGhostStyle()}>
                                        pricing
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </>
                }</>
            }
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/" className={`${navigationMenuTriggerGhostStyle()} text-xl`}>
                        FIMATE
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            {
                isLoggedIn ?
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/" className={navigationMenuTriggerGhostStyle()} onClick={async (e) => {
                                e.preventDefault()
                                await LogOut()
                                navigate("/")
                            }}>
                                logout
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList> :
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/login" className={navigationMenuTriggerGhostStyle()}>
                                login
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/register" className={navigationMenuTriggerGhostStyle()}>
                                register
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <ModeToggle />
                        </NavigationMenuItem>
                    </NavigationMenuList>
            }

        </NavigationMenu>
    )
}

const Footer = () => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem className="text-muted-foreground text-sm">
                    © finance mate 2024
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export { Navbar, Footer }
