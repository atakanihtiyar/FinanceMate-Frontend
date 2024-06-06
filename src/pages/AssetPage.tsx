import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLocation, useNavigate } from "react-router-dom"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useContext, useEffect, useState } from "react"
import { UserContext, UserContextValues } from "@/context/UserContext"
import { Checkbox } from "@/components/ui/checkbox"

const FormSchema = z.object({
    is_limit: z.boolean().default(false),
    is_stop: z.boolean().default(false),
    limit_price: z.number().transform(v => Number(v) || 0),
    stop_price: z.string().transform(v => Number(v) || 0),
    qty: z.string().transform(v => Number(v) || 0),
    time_in_force: z.enum(["day"])
})

const AssetPage = () => {
    const navigate = useNavigate()
    const { isLoggedIn, isAuthRequestEnd } = useContext(UserContext) as UserContextValues
    useEffect(() => {
        if (!isAuthRequestEnd) return
        if (!isLoggedIn) navigate("/")
    }, [isLoggedIn])

    const location = useLocation()
    const assetData = location.state ? location.state.assetData : {
        symbol: "---",
        name: "---",
        exchange: "---",
        latest_closing: "00.00",
    }

    const [isLimit, setIsLimit] = useState(false)
    const [isStop, setIsStop] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            time_in_force: "day"
        }
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
    }

    return (
        <div className="min-w-screen min-h-screen flex flex-col justify-center items-center space-x-48">
            <div className="w-8/12 grow py-8 flex flex-col justify-start items-start gap-0">
                <Card className="border-0">
                    <CardHeader>
                        <CardTitle className="text-xl">{assetData.symbol} - {assetData.name}</CardTitle>
                        <CardDescription className="text-sm">{assetData.exchange}</CardDescription>
                    </CardHeader>
                </Card>
                <div className="w-full grid grid-cols-6 justify-center items-start gap-2">
                    <div className="h-[512px] w-full col-span-4 border-[1px] border-[var(--muted)] rounded-sm flex justify-center items-center">
                        <p className="text-center">GRAPH PLACEHOLDER</p>
                    </div>
                    <div className="col-span-2">
                        <Card className="border-0">
                            <CardHeader>
                                <CardTitle className="text-xl">Price: ${assetData.latest_closing}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center space-y-4 border-0">
                                <div className="w-full flex flex-row space-y-0 rounded-md border p-4">
                                    <div className="w-[50%] flex flex-row items-start space-x-3 space-y-0">
                                        <Checkbox id="isLimit"
                                            onCheckedChange={(value) => {
                                                setIsLimit(value as boolean)
                                                return !value
                                            }}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <label htmlFor="isLimit"
                                                className="text-sm leading-none">
                                                Limit
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-[50%] flex flex-row items-start space-x-3 space-y-0">
                                        <Checkbox id="isStop"
                                            onCheckedChange={(value) => {
                                                setIsStop(value as boolean)
                                                return !value
                                            }}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <label htmlFor="isStop"
                                                className="text-sm leading-none">
                                                Stop
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center space-y-4">
                                            {
                                                isLimit &&
                                                <FormField
                                                    control={form.control}
                                                    name="limit_price"
                                                    render={({ field }) => (
                                                        <FormItem className="w-[90%]">
                                                            <FormControl>
                                                                <Input type="text" placeholder="Limit Price" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            }
                                            {
                                                isStop &&
                                                <FormField
                                                    control={form.control}
                                                    name="stop_price"
                                                    render={({ field }) => (
                                                        <FormItem className="w-[90%]">
                                                            <FormControl>
                                                                <Input type="text" placeholder="Stop Price" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            }
                                            <FormField
                                                control={form.control}
                                                name="qty"
                                                render={({ field }) => (
                                                    <FormItem className="w-[90%]">
                                                        <FormControl>
                                                            <Input type="text" placeholder="Quantity" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="time_in_force"
                                                render={({ field }) => (
                                                    <FormItem className="w-[90%]">
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select order timing" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="day">Day</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive" className="w-[90%] bg-[--success]">Buy</Button>
                                                </DialogTrigger>
                                                <DialogContent className="w-72">
                                                </DialogContent>
                                            </Dialog>
                                        </form>
                                    </Form>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center space-y-4">
                                            {
                                                isLimit &&
                                                <FormField
                                                    control={form.control}
                                                    name="limit_price"
                                                    render={({ field }) => (
                                                        <FormItem className="w-[90%]">
                                                            <FormControl>
                                                                <Input type="text" placeholder="Limit Price" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            }
                                            {
                                                isStop &&
                                                <FormField
                                                    control={form.control}
                                                    name="stop_price"
                                                    render={({ field }) => (
                                                        <FormItem className="w-[90%]">
                                                            <FormControl>
                                                                <Input type="text" placeholder="Stop Price" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            }
                                            <FormField
                                                control={form.control}
                                                name="qty"
                                                render={({ field }) => (
                                                    <FormItem className="w-[90%]">
                                                        <FormControl>
                                                            <Input type="text" placeholder="Quantity" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="time_in_force"
                                                render={({ field }) => (
                                                    <FormItem className="w-[90%]">
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select order timing" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="day">Day</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive" className="w-[90%]">Sell</Button>
                                                </DialogTrigger>
                                                <DialogContent className="w-72">
                                                </DialogContent>
                                            </Dialog>
                                        </form>
                                    </Form>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AssetPage