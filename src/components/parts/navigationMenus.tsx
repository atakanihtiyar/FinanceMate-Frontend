import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerUnfocusableStyle,
} from "@/components/ui/navigation-menu"
import { UserContext, UserContextValues } from "@/context/UserContext"
import { useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"

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
                                    <NavigationMenuLink href="/dashboard" className={navigationMenuTriggerUnfocusableStyle()}>
                                        dashboard
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </> : <>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink href="/about" className={navigationMenuTriggerUnfocusableStyle()}>
                                        about
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink href="/pricing" className={navigationMenuTriggerUnfocusableStyle()}>
                                        pricing
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </>
                }</>
            }
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/" className={`${navigationMenuTriggerUnfocusableStyle()} tw-text-xl`}>
                        FIMATE
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            {
                isLoggedIn ?
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/" className={navigationMenuTriggerUnfocusableStyle()} onClick={async (e) => {
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
                            <NavigationMenuLink href="/login" className={navigationMenuTriggerUnfocusableStyle()}>
                                login
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/register" className={navigationMenuTriggerUnfocusableStyle()}>
                                register
                            </NavigationMenuLink>
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
                <NavigationMenuItem className="tw-text-muted tw-text-sm">
                    © finance mate 2024
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export { Navbar, Footer }
