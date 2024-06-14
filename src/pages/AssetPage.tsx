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
    FormLabel,
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
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useContext, useEffect, useState } from "react"
import { UserContext, UserContextValues } from "@/context/UserContext"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { getHistoricalBars, postOrder } from "@/lib/backend_service"

import CandlestickChart, { Bar } from "@/components/parts/CandleStickChart"

const FormSchema = z.object({
    is_limit: z.boolean(),
    is_stop: z.boolean(),
    limit_price: z.coerce.number().optional(),
    stop_price: z.coerce.number().optional(),
    qty: z.coerce.number(),
    side: z.enum(["none", "sell", "buy"]),
    time_in_force: z.enum(["day"]),
}).refine(schema => {
    if (schema.is_limit && !schema.limit_price)
        return false
    else if (!schema.is_limit)
        schema.limit_price = undefined

    if (schema.is_stop && !schema.stop_price)
        return false
    else if (!schema.is_stop)
        schema.stop_price = undefined

    return true
})

const AssetPage = () => {
    const navigate = useNavigate()
    const [chartData, setChartData] = useState<Bar[]>([])

    const fetchData = async () => {
        const response = await getHistoricalBars(assetData.symbol)
        if (response.status === 200) {
            const newData: Bar[] = response.data.bars.map((bar: { t: string, l: number, o: number, c: number, h: number }) => {
                return {
                    date: new Date(bar.t),
                    low: bar.l,
                    open: bar.o,
                    close: bar.c,
                    high: bar.h,
                }
            })
            setChartData(newData)
        }
        else
            setChartData([])
    }

    const { user, isLoggedIn, isAuthRequestEnd } = useContext(UserContext) as UserContextValues
    useEffect(() => {
        if (!isAuthRequestEnd) return
        if (!isLoggedIn) navigate("/")
        fetchData()
    }, [isLoggedIn])

    const location = useLocation()
    const assetData = location.state ? location.state.assetData : {
        symbol: "---",
        name: "---",
        exchange: "---",
        latest_closing: 0.00,
    }

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            is_limit: false,
            is_stop: false,
            limit_price: 0,
            stop_price: 0,
            qty: 0,
            side: "none",
            time_in_force: "day",
        }
    })

    const onDialogOpenChange = (isOpen: boolean) => {
        setIsDialogOpen(isOpen)
        if (!isOpen) {
            form.reset()
        }
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const createOrder = async () => {
            if (!user || data.side === "none") return

            const response = await postOrder(user.account_number, {
                symbol: assetData.symbol,
                qty: data.qty.toString(),
                side: data.side,
                type: data.is_limit && data.is_stop ? "stop_limit" : (data.is_limit ? "limit" : (data.is_stop ? "stop" : "market")),
                time_in_force: data.time_in_force,
                limit_price: data.limit_price?.toString(),
                stop_price: data.stop_price?.toString(),
            })
            if (response.status === 200) navigate("/dashboard")
        }
        createOrder()
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
                    <div className="h-[512px] w-full col-span-4 flex justify-center items-center">
                        {
                            chartData.length !== 0 &&
                            <CandlestickChart data={chartData} />
                        }
                    </div>
                    <div className="col-span-2">
                        <Card className="border-0">
                            <CardHeader>
                                <CardTitle className="text-xl">Price: ${assetData.latest_closing.toFixed(2)}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center space-y-4 border-0">
                                <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
                                    <div className="w-full flex flex-row space-x-2 p-2">
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" className="w-[90%] bg-[--success]"
                                                onClick={() => {
                                                    form.setValue("side", "buy")
                                                }}>Buy</Button>
                                        </DialogTrigger>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" className="w-[90%]"
                                                onClick={() => {
                                                    form.setValue("side", "sell")
                                                }}>Sell</Button>
                                        </DialogTrigger>
                                    </div>
                                    <DialogContent className="w-72 flex flex-col items-center">
                                        <DialogHeader className="w-[90%] mb-2">
                                            <DialogTitle className="text-xl">Create {form.getValues("side")} order</DialogTitle>
                                            <DialogDescription>
                                                This action will create an {form.getValues("side")} order. Do you accept the following order?
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Separator className="mb-2" />
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center space-y-4">
                                                <div className="w-[90%] flex flex-row justify-center space-y-0 p-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="is_limit"
                                                        render={({ field }) => (
                                                            <FormItem className="w-[50%] flex flex-row justify-center items-start space-x-2 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                    />
                                                                </FormControl>
                                                                <div className="space-y-1 leading-none">
                                                                    <FormLabel>
                                                                        Limit
                                                                    </FormLabel>
                                                                </div>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="is_stop"
                                                        render={({ field }) => (
                                                            <FormItem className="w-[50%] flex flex-row justify-center items-start space-x-2 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                    />
                                                                </FormControl>
                                                                <div className="space-y-1 leading-none">
                                                                    <FormLabel>
                                                                        Stop
                                                                    </FormLabel>
                                                                </div>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                {
                                                    form.getValues().is_limit &&
                                                    <FormField
                                                        control={form.control}
                                                        name="limit_price"
                                                        render={({ field }) => (
                                                            <FormItem className="w-[90%]">
                                                                <FormLabel>Limit Price</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" placeholder="Limit Price" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                }
                                                {
                                                    form.getValues().is_stop &&
                                                    <FormField
                                                        control={form.control}
                                                        name="stop_price"
                                                        render={({ field }) => (
                                                            <FormItem className="w-[90%]">
                                                                <FormLabel>Stop Price</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" placeholder="Stop Price" {...field} />
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
                                                            <FormLabel>Quantity</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="Quantity" {...field} />
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
                                                            <FormLabel>Expire Mode</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select Expire Mode" />
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

                                                <p className="">Estimated Cost: $ {(form.getValues().qty * assetData.latest_closing).toFixed(2)}</p>

                                                <Button variant="destructive"
                                                    className={`w-[90%] ${form.getValues("side") === "buy" && "bg-[--success]"}`}
                                                    disabled={form.getValues("side") === "none"}>
                                                    <span>{form.getValues("side") !== "none" ? "Set Order" : "Order Side Not Selected"}</span>
                                                </Button>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AssetPage