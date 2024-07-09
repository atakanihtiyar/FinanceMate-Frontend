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
import { getHistoricalBars, postOrder, HistoricalBarsTimeFrameType, getNews } from "@/lib/server_service"

import CandlestickChart from "@/components/parts/Charts/CandlestickChart/CandlestickChart"
import { Bar } from "@/components/parts/Charts/CandlestickChart/Candlesticks"
import * as d3 from "d3"

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
    const { user, isLoggedIn, isAuthRequestEnd } = useContext(UserContext) as UserContextValues
    useEffect(() => {
        if (!isAuthRequestEnd) return
        if (!isLoggedIn) navigate("/")
    }, [isLoggedIn])

    const location = useLocation()
    const assetData = location.state ? location.state.assetData : null

    const [chartData, setChartData] = useState<Bar[]>([])
    const [newsData, setNewsData] = useState<{
        id: number,
        headline: string,
        author: string,
        created_at: string,
        updated_at: string,
        summary: string,
        content: string,
        url: string,
        images: [{ size: string, url: string }],
        symbols: [string],
        source: string,
    }[]>([])
    const [timeFrame, setTimeFrame] = useState<HistoricalBarsTimeFrameType>("1Day")

    const fetchData = async () => {
        Promise.all([getHistoricalBars(assetData.symbol, timeFrame), getNews(assetData.symbol)])
            .then((data) => {
                if (data[0].status === 200) {
                    setChartData(data[0].data.bars)
                }
                if (data[1].news) {
                    setNewsData(data[1].news)
                }
            })
    }

    useEffect(() => {
        if (assetData)
            fetchData()
    }, [assetData, timeFrame])

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
            <div className="w-10/12 grow py-8 flex flex-col justify-start items-start gap-12 xl:w-9/12 2xl:w-8/12">
                <div className="w-full h-full flex flex-col justify-center items-start gap-2 lg:flex-row">
                    <Card className="w-full h-[512px] border-0 flex flex-col justify-between items-center text-center mb-8 [&>*:nth-child(odd)]:py-2 lg:w-[400px] lg:justify-between lg:items-end lg:text-end lg:mb-0">
                        <CardHeader>
                            <CardTitle className="text-3xl">{assetData.symbol}</CardTitle>
                            <CardDescription className="text-base">{assetData.name}</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent>
                            <p>Price</p>
                            <p className="text-muted-foreground">
                                $ {assetData.latest_closing.toFixed(2)}
                            </p>
                        </CardContent>
                        <Separator />
                        <CardContent>
                            <p>Class</p>
                            <p className="text-foreground">
                                {assetData.class.split("_").join(" ").toUpperCase()}
                            </p>
                        </CardContent>
                        <Separator />
                        <CardContent>
                            <p>Exchange</p>
                            <p className="text-foreground">
                                {assetData.exchange}
                            </p>
                        </CardContent>
                        <Separator />
                        <CardContent>
                            <p>Status</p>
                            <p className="rounded-sm text-[--success] px-1">
                                {assetData.status}
                            </p>
                        </CardContent>
                        <Separator />
                        <CardContent className="w-full">
                            <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
                                <div className="w-full flex flex-row space-x-2 p-0">
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" className={"w-[90%] bg-[--success]"}
                                            disabled={assetData.status !== "active"}
                                            onClick={() => {
                                                form.setValue("side", "buy")
                                            }}>Buy</Button>
                                    </DialogTrigger>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" className="w-[90%]"
                                            disabled={assetData.status !== "active"}
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

                    <div className="w-full h-[512px]">
                        <CandlestickChart
                            data={chartData}
                            intervals={[
                                {
                                    title: "5 Minutes",
                                    timeFrame: "5Min",
                                    timeOffset: 1000 * 60 * 5,
                                },
                                {
                                    title: "15 Minutes",
                                    timeFrame: "15Min",
                                    timeOffset: 1000 * 60 * 15,
                                },
                                {
                                    title: "30 Minutes",
                                    timeFrame: "30Min",
                                    timeOffset: 1000 * 60 * 30,
                                },
                                {
                                    title: "1 Hour",
                                    timeFrame: "1Hour",
                                    timeOffset: 1000 * 60 * 60,
                                },
                                {
                                    title: "1 Day",
                                    timeFrame: "1Day",
                                    timeOffset: 1000 * 60 * 60 * 24,
                                    isDefault: true
                                },
                                {
                                    title: "1 Week",
                                    timeFrame: "1Week",
                                    timeOffset: 1000 * 60 * 60 * 24 * 7,
                                },
                                {
                                    title: "1 Month",
                                    timeFrame: "1Month",
                                    timeOffset: 1000 * 60 * 60 * 24 * 30,
                                },
                                {
                                    title: "1 Year",
                                    timeFrame: "12Month",
                                    timeOffset: 1000 * 60 * 60 * 24 * 365,
                                }
                            ]}
                            onIntervalBtnClicked={(timeFrame: string) => setTimeFrame(timeFrame as HistoricalBarsTimeFrameType)} />
                    </div>
                </div>

                <div className="w-full p-0">
                    <CardHeader>
                        <CardTitle>
                            NEWS
                        </CardTitle>
                    </CardHeader>
                    <Card className="w-full">
                        <CardContent className="w-full flex flex-col p-0">
                            {
                                newsData && newsData.length > 0 ?
                                    newsData.map((news) => {
                                        return (
                                            <Button
                                                key={news.id}
                                                variant="outline"
                                                className="w-full h-full flex flex-col grow text-left text-wrap gap-0 lg:flex-row"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    window.open(news.url, "_blank")
                                                }}
                                            >
                                                <div className="w-full flex flex-col grow">
                                                    <p className="text-sm text-foreground lg:text-base">{news.headline}</p>
                                                    <p className="text-xs text-muted-foreground mt-2">@{news.source} - {news.author}</p>
                                                    {
                                                        (() => {
                                                            const newsDate = new Date(news.created_at)
                                                            const dateTxt = d3.utcFormat("%a, %d %b %Y")(newsDate)
                                                            const timeTxt = d3.utcFormat("%H:%M:%S")(newsDate) + " GMT"
                                                            return (
                                                                <p className="flex flex-row text-xs text-muted-foreground gap-1">
                                                                    <span>{dateTxt}</span>
                                                                    <span>{timeTxt}</span>
                                                                </p>
                                                            )
                                                        })()
                                                    }
                                                </div>
                                            </Button>
                                        )
                                    }) : (
                                        <Button variant="outline" className="min-h-min" onClick={(e) => {
                                            e.preventDefault()
                                        }}>
                                            <p className="text-muted-foreground text-sm lg:text-base text-center">No Data</p>
                                        </Button>
                                    )
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    )
}

export default AssetPage