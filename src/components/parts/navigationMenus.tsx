import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { UserContext, UserContextValues } from "@/context/UserContext"
import { useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ModeToggle } from "../mode-toggle"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Search } from "lucide-react"
import { getAssetData } from "@/lib/backend_service"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from "../ui/form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const searchFormSchema = z.object({
    searchText: z.string().min(2).max(10).regex(/[a-zA-Z.]+/),
})

const Navbar = () => {
    const { isLoggedIn, LogOut } = useContext(UserContext) as UserContextValues
    const navigate = useNavigate()
    const location = useLocation()
    const showAssetSearch = location.pathname.includes("/dashboard") || location.pathname.includes("/assets")

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
        <NavigationMenu className="flex flex-row p-2">
            <div className="basis-1/5"></div>
            <div className="flex justify-start basis-1/4">
                {
                    isLoggedIn ?
                        <NavigationMenuLink href="/dashboard" className={navigationMenuTriggerStyle()}>
                            dashboard
                        </NavigationMenuLink> :
                        <>
                            <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
                                about
                            </NavigationMenuLink>
                            <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
                                pricing
                            </NavigationMenuLink>
                        </>
                }
            </div>
            <div className="flex justify-center basis-1/4">
                <NavigationMenuLink href="/" className={`${navigationMenuTriggerStyle()} text-xl`}>
                    FIMATE
                </NavigationMenuLink>
            </div>
            <div className="flex basis-1/4 justify-end items-center p-2">
                {
                    showAssetSearch &&
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSearchSubmit)} className="w-44 flex justify-between border rounded-md mr-4">
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
                {
                    isLoggedIn ?
                        <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()} onClick={async (e) => {
                            e.preventDefault()
                            await LogOut()
                            navigate("/")
                        }}>
                            logout
                        </NavigationMenuLink> :
                        <>
                            <NavigationMenuLink href="/login" className={navigationMenuTriggerStyle()}>
                                login
                            </NavigationMenuLink>
                            <NavigationMenuLink href="/register" className={navigationMenuTriggerStyle()}>
                                register
                            </NavigationMenuLink>
                        </>
                }
                <ModeToggle />
            </div>
            <div className="basis-1/5"></div>
        </NavigationMenu >
    )
}

const Footer = () => {
    return (
        <NavigationMenu className="p-4">
            <div>
                <NavigationMenuItem className="text-muted-foreground text-sm">
                    © finance mate 2024
                </NavigationMenuItem>
            </div>
        </NavigationMenu>
    )
}

export { Navbar, Footer }
