import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { UserContext, UserContextValues } from "@/context/UserContext"
import { useContext, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ModeToggle } from "../mode-toggle"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Search } from "lucide-react"
import { getAssetData } from "@/lib/backend_service"

const Navbar = () => {
    const { isLoggedIn, LogOut } = useContext(UserContext) as UserContextValues
    const navigate = useNavigate()
    const location = useLocation()
    const isThisDashboard = location.pathname.includes("/dashboard")

    const [searchText, setSearchText] = useState("")

    const onSearchTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value.toUpperCase())
    }

    const onSearchButtonClicked = () => {
        const getData = async () => {
            const assetData = await getAssetData(searchText.toUpperCase())
            navigate(`/assets`, { state: { assetData } })
        }
        getData()
    }

    return (
        <NavigationMenu className="p-2">
            {
                !isThisDashboard &&
                <>{
                    isLoggedIn ?
                        <>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink href="/dashboard" className={navigationMenuTriggerStyle()}>
                                        dashboard
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </> : <>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
                                        about
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
                                        pricing
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </>
                }</>
            }
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/" className={`${navigationMenuTriggerStyle()} text-xl`}>
                        FIMATE
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            {
                isThisDashboard &&
                <NavigationMenuList className="p-2 flex justify-center items-center">
                    <NavigationMenuItem>
                        <div className="flex w-full items-center mr-4">
                            <Input id="searchText" type="text" placeholder="Symbol"
                                className="h-8 py-1 px-2 text-sm border-[1px] mr-0 border-r-0 rounded-r-none !ring-0"
                                onChange={e => onSearchTextChanged(e)} />

                            <Button type="submit" variant="outline" size="icon" className="h-8 text-sm ml-0 rounded-l-none border-l-0"
                                onClick={() => onSearchButtonClicked()}>
                                <Search size={16} />
                            </Button>
                        </div>
                    </NavigationMenuItem>
                </NavigationMenuList>
            }
            <NavigationMenuList className="p-2 flex justify-center items-center">
                {
                    isLoggedIn ?
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()} onClick={async (e) => {
                                e.preventDefault()
                                await LogOut()
                                navigate("/")
                            }}>
                                logout
                            </NavigationMenuLink>
                        </NavigationMenuItem> :
                        <>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/login" className={navigationMenuTriggerStyle()}>
                                    login
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/register" className={navigationMenuTriggerStyle()}>
                                    register
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </>
                }
                <NavigationMenuItem>
                    <ModeToggle />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const Footer = () => {
    return (
        <NavigationMenu className="p-4">
            <NavigationMenuList>
                <NavigationMenuItem className="text-muted-foreground text-sm">
                    © finance mate 2024
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export { Navbar, Footer }
