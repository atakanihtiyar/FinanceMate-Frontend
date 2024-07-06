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
import { getAssetData } from "@/lib/server_service"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from "../ui/form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"

const searchFormSchema = z.object({
    searchText: z.string().min(2).max(10).regex(/[a-zA-Z.]+/),
})

const Navbar = () => {
    const { isLoggedIn, LogOut } = useContext(UserContext) as UserContextValues
    const navigate = useNavigate()
    const location = useLocation()
    const showAssetSearch = location.pathname.includes("/dashboard") || location.pathname.includes("/assets") || location.pathname.includes("/wallet")
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const form = useForm<z.infer<typeof searchFormSchema>>({
        resolver: zodResolver(searchFormSchema),
        defaultValues: {
            searchText: "",
        },
    })

    const onSearchSubmit = (values: z.infer<typeof searchFormSchema>) => {
        const getData = async () => {
            const asset = await getAssetData(values.searchText.toUpperCase())
            if (asset.status === 200)
                navigate(`/assets`, { state: { assetData: asset.data } })
            else
                console.log(asset)
        }
        getData()
    }

    return (
        <NavigationMenu className="">
            <div className="w-10/12 hidden justify-between p-2 gap-12 md:flex md:flex-row lg:w-8/12">
                <NavigationMenuList>
                    <NavigationMenuLink href="/" className={navigationMenuTriggerStyle() + " text-xl pt-0"}>
                        FIMATE
                    </NavigationMenuLink>
                    {
                        isLoggedIn ?
                            <>
                                <NavigationMenuLink href="/dashboard" className={navigationMenuTriggerStyle()}>
                                    dashboard
                                </NavigationMenuLink>
                                <NavigationMenuLink href="/wallet" className={navigationMenuTriggerStyle()}>
                                    wallet
                                </NavigationMenuLink>
                                {
                                    showAssetSearch &&
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSearchSubmit)} className="w-44 flex justify-between border rounded-md ml-8">
                                            <FormField
                                                control={form.control}
                                                name="searchText"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input id="searchText" type="text" placeholder="Symbol" {...field}
                                                                className="h-8 py-1 px-2 text-sm m-0 border-0 !ring-0" />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" variant="ghost" size="icon" className="h-8 text-sm m-0 ">
                                                <Search size={16} />
                                            </Button>
                                        </form>
                                    </Form>
                                }
                            </> :
                            <>
                                <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
                                    about
                                </NavigationMenuLink>
                                <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
                                    pricing
                                </NavigationMenuLink>
                            </>
                    }
                </NavigationMenuList>
                <NavigationMenuList>
                    {
                        isLoggedIn ?
                            <>
                                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()} onClick={async (e) => {
                                    e.preventDefault()
                                    await LogOut()
                                    navigate("/")
                                }}>
                                    logout
                                </NavigationMenuLink>
                                <ModeToggle />
                            </> :
                            <>
                                <NavigationMenuLink href="/login" className={navigationMenuTriggerStyle()}>
                                    login
                                </NavigationMenuLink>
                                <NavigationMenuLink href="/register" className={navigationMenuTriggerStyle()}>
                                    register
                                </NavigationMenuLink>
                                <ModeToggle />
                            </>
                    }
                </NavigationMenuList>
            </div>

            <div className="w-full flex flex-row justify-between px-4 py-2 gap-12 md:hidden">
                <NavigationMenuList>
                    <NavigationMenuLink href="/" className={navigationMenuTriggerStyle() + " text-xl pt-0"}>
                        FIMATE
                    </NavigationMenuLink>
                    {
                        showAssetSearch &&
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSearchSubmit)} className="w-28 flex justify-between border rounded-md ml-8">
                                <FormField
                                    control={form.control}
                                    name="searchText"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input id="searchText" type="text" placeholder="Symbol" {...field}
                                                    className="h-8 py-1 px-2 text-sm m-0 border-0 !ring-0" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" variant="ghost" size="icon" className="h-8 text-sm m-0 ">
                                    <Search size={16} />
                                </Button>
                            </form>
                        </Form>
                    }
                </NavigationMenuList>
                <NavigationMenuList>
                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                        <DrawerTrigger asChild className="border-2">
                            <Button variant="outline" size="icon">ooo</Button>
                        </DrawerTrigger>

                        <DrawerContent className="h-56 flex flex-col justify-evenly">
                            <NavigationMenuList className="hidden">
                                <DrawerHeader>
                                    <DrawerTitle>
                                    </DrawerTitle>
                                    <DrawerDescription>
                                    </DrawerDescription>
                                </DrawerHeader>
                            </NavigationMenuList>
                            {
                                isLoggedIn ?
                                    <NavigationMenuList className="flex-col">
                                        <NavigationMenuLink href="/dashboard" className={navigationMenuTriggerStyle()}>
                                            dashboard
                                        </NavigationMenuLink>
                                        <NavigationMenuLink href="/wallet" className={navigationMenuTriggerStyle()}>
                                            wallet
                                        </NavigationMenuLink>
                                    </NavigationMenuList> :
                                    <NavigationMenuList className="flex-col">
                                        <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
                                            about
                                        </NavigationMenuLink>
                                        <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
                                            pricing
                                        </NavigationMenuLink>
                                    </NavigationMenuList>
                            }
                            {
                                isLoggedIn ?
                                    <NavigationMenuList>
                                        <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()} onClick={async (e) => {
                                            e.preventDefault()
                                            await LogOut()
                                            navigate("/")
                                        }}>
                                            logout
                                        </NavigationMenuLink>
                                    </NavigationMenuList> :
                                    <NavigationMenuList>
                                        <NavigationMenuLink href="/login" className={navigationMenuTriggerStyle()}>
                                            login
                                        </NavigationMenuLink>
                                        <NavigationMenuLink href="/register" className={navigationMenuTriggerStyle()}>
                                            register
                                        </NavigationMenuLink>
                                    </NavigationMenuList>
                            }
                        </DrawerContent>
                    </Drawer>
                </NavigationMenuList>
            </div>
        </NavigationMenu >
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
