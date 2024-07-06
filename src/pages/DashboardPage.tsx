import { useNavigate } from "react-router-dom"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

import { ScrollArea } from "@/components/ui/scroll-area"

import { useContext, useEffect, useState } from "react"
import { UserContext, UserContextValues } from "@/context/UserContext"
import { Separator } from "@/components/ui/separator"
import { getAccountPortfolioHistory, getAssetData, getOrders, getPositions, getTradingData, PortfolioHistoryTimeFrameType } from "@/lib/server_service"
import LineChart from "@/components/parts/Charts/LineCharts/LineChart"
import { Point } from "@/components/parts/Charts/LineCharts/Lines"
import { Button } from "@/components/ui/button"

const DashboardPage = () => {
    const navigate = useNavigate()
    const { user, isLoggedIn, isAuthRequestEnd } = useContext(UserContext) as UserContextValues
    const [tradingData, setTradingData] = useState({
        currency: "USD",
        portfolio_value: "0",
        buying_power: "0",
        cash: "0",
        long_market_value: "0",
        short_market_value: "0",
        last_portfolio_value: "0",
        last_buying_power: "0",
        last_cash: "0",
        last_long_market_value: "0",
        last_short_market_value: "0",
    })
    const [positions, setPositions] = useState([{
        symbol: "",
        exchange: "",
        avg_entry_price: "0",
        qty: "0",
        side: "",
        cost_basis: "0",
        market_value: "0",
        unrealized_pl: "0",
        unrealized_plpc: "0",
        unrealized_intraday_pl: "0",
        unrealized_intraday_plpc: "0",
        current_price: "0",
        change_today: "0"
    }])
    const [orders, setOrders] = useState([{
        order_id: "",
        symbol: "",
        asset_class: "",
        created_at: "",
        updated_at: "",
        submitted_at: "",
        filled_at: "",
        expired_at: "",
        cancelled_at: "",
        failed_at: "",
        status: "status",
        qty: "0",
        filled_qty: "0",
        filled_avg_price: "0",
        type: "",
        time_in_force: "",
        side: "",
        limit_price: "0",
        stop_price: "0",
        commission: "0",
        commission_bps: "0",
    }])
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [dialogOrder, setDialogOrder] = useState<typeof orders[0]>(orders[0])

    useEffect(() => {
        if (!isAuthRequestEnd) return
        if (isLoggedIn && user) {
            Promise.all([
                getTradingData(user.account_number),
                getPositions(user.account_number),
                getOrders(user.account_number),
            ]).then((data) => {
                if (data) {
                    if (data[0])
                        setTradingData(data[0])
                    if (data[1])
                        setPositions(data[1])
                    if (data[2])
                        setOrders(data[2])
                }
            })
        }
        else {
            navigate("/")
        }
    }, [isAuthRequestEnd])

    const [portfolioHistory, setPortfolioHistory] = useState<Point[]>([])
    const [timeFrame, setTimeFrame] = useState<PortfolioHistoryTimeFrameType>("1D")

    useEffect(() => {
        if (!isAuthRequestEnd) return
        if (!isLoggedIn || !user) return

        const fetchPortfolioHistory = async () => {
            await getAccountPortfolioHistory(user.account_number, timeFrame)
                .then((data) => {
                    setPortfolioHistory(data)
                })
        }
        fetchPortfolioHistory()
    }, [isAuthRequestEnd, timeFrame])

    const getPctAsSpan = (oldValue: string, newValue: string) => {
        const _old = parseFloat(oldValue)
        const _new = parseFloat(newValue)

        const pct = _old === 0 && _new === 0 ? 0 : (_new * 100 / _old) - 100
        return (
            <span className={"text-sm " + `${pct > 0 ? "text-[--success]" : (pct < 0 ? "text-[--destructive]" : "text-muted-foreground")}`}>
                {pct.toFixed(2)}%
            </span>
        )
    }

    return (
        <div className="min-w-screen min-h-screen flex flex-col justify-center items-center space-x-48">
            <div className="w-10/12 grow py-8 flex flex-col justify-start items-start gap-12 lg:w-8/12">
                <div className="w-full h-full flex flex-col justify-center items-start gap-2 lg:flex-row">
                    <Card className="w-full h-[512px] border-0 flex flex-col justify-between items-center text-center mb-8 [&>*:nth-child(odd)]:py-2 lg:w-[400px] lg:justify-between lg:items-end lg:text-end lg:mb-0">
                        <CardHeader>
                            <CardTitle className="text-3xl">{user?.given_name + " " + user?.family_name}</CardTitle>
                            <CardDescription className="text-sm">#{user?.account_number.toString()}</CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent>
                            <p>Portfolio Value</p>
                            <p className="text-muted-foreground">
                                {getPctAsSpan(tradingData.last_portfolio_value, tradingData.portfolio_value)}
                                &nbsp;&nbsp;&nbsp;
                                $ {parseFloat(tradingData.portfolio_value).toLocaleString()}
                            </p>
                        </CardContent>
                        <Separator />
                        <CardContent>
                            <p>Buying Power</p>
                            <p className="text-muted-foreground">
                                {getPctAsSpan(tradingData.last_buying_power, tradingData.buying_power)}
                                &nbsp;&nbsp;&nbsp;
                                $ {parseFloat(tradingData.buying_power).toLocaleString()}
                            </p>
                        </CardContent>
                        <Separator />
                        <CardContent>
                            <p>Long Market Value</p>
                            <p className="text-muted-foreground">
                                {getPctAsSpan(tradingData.last_long_market_value, tradingData.long_market_value)}
                                &nbsp;&nbsp;&nbsp;
                                $ {parseFloat(tradingData.long_market_value).toLocaleString()}
                            </p>
                        </CardContent>
                        <Separator />
                        <CardContent>
                            <p>Short Market Value</p>
                            <p className="text-muted-foreground">
                                {getPctAsSpan(tradingData.last_short_market_value, tradingData.short_market_value)}
                                &nbsp;&nbsp;&nbsp;
                                $ {parseFloat(tradingData.short_market_value).toLocaleString()}
                            </p>
                        </CardContent>
                        <Separator />
                    </Card>
                    <div className="w-full h-[512px]">
                        <LineChart data={portfolioHistory} intervals={[
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
                                title: "1 Hour",
                                timeFrame: "1H",
                                timeOffset: 1000 * 60 * 60,
                            },
                            {
                                title: "1 Day",
                                timeFrame: "1D",
                                timeOffset: 1000 * 60 * 60 * 24,
                                isDefault: true
                            },
                        ]}
                            onIntervalBtnClicked={(timeFrame: string) => setTimeFrame(timeFrame as PortfolioHistoryTimeFrameType)}
                        />
                    </div>
                </div>
                <div className="w-full flex flex-col justify-center items-start gap-2 xl:flex-row">
                    <Card className="w-full border-0 *:text-xs *:p-2 md:*:text-base md:*:p-4 xl:w-7/12 xl:border-2">
                        <CardHeader>
                            <CardTitle><span>Positions</span>
                                <Button variant="link" className="text-sm text-muted-foreground"
                                    onClick={() => navigate("/wallet")}>
                                    view details
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="*:p-2 md:*:p-4">
                                        <TableHead className="w-[100px]">Symbol</TableHead>
                                        <TableHead>Mkt Val</TableHead>
                                        <TableHead>Last</TableHead>
                                        <TableHead className="text-right">Change %</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        positions.length > 0 ?
                                            positions.map((item) => {
                                                return (
                                                    <TableRow key={item.symbol} className="cursor-pointer *:text-xs *:p-2 md:*:text-base md:*:p-4 hover:bg-accent"
                                                        onClick={() => {
                                                            const getData = async () => {
                                                                const asset = await getAssetData(item.symbol)
                                                                if (asset.status === 200)
                                                                    navigate(`/assets`, { state: { assetData: asset.data } })
                                                                else
                                                                    console.log(asset)
                                                            }
                                                            getData()
                                                        }}>
                                                        <TableCell className="font-medium">{item.symbol}</TableCell>
                                                        <TableCell>{item.market_value}</TableCell>
                                                        <TableCell>{item.current_price}</TableCell>
                                                        <TableCell className="text-right">{(parseFloat(item.change_today) * 100).toFixed(2)}</TableCell>
                                                    </TableRow>)
                                            }) : (
                                                <TableRow>
                                                    <TableCell className="text-center" colSpan={6}>No Data</TableCell>
                                                </TableRow>
                                            )
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card className="w-full border-0 *:text-xs *:p-2 md:*:text-base md:*:p-4 xl:w-7/12 xl:border-2">
                        <CardHeader>
                            <CardTitle>Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="*:text-xs *:p-2 md:*:text-base md:*:p-4">
                                        <TableHead>Side</TableHead>
                                        <TableHead>Symbol</TableHead>
                                        <TableHead>Filled Qty</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Created At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <Sheet open={dialogOpen} onOpenChange={setDialogOpen} >
                                        {
                                            orders.length > 0 ?
                                                orders.map((item) => {
                                                    return (
                                                        <TableRow key={item.order_id} className="cursor-pointer *:text-xs *:p-2 md:*:text-base md:*:p-4 hover:bg-accent" onClick={() => {
                                                            setDialogOpen(true)
                                                            setDialogOrder(item)
                                                        }}>
                                                            <TableCell>
                                                                {item.side === "buy" ? "Buy" : item.side === "sell" ? "Sell" : "-"}
                                                            </TableCell>
                                                            <TableCell>{item.symbol}</TableCell>
                                                            <TableCell>{item.filled_qty}</TableCell>
                                                            <TableCell>{item.status[0].toUpperCase() + item.status.slice(1)}</TableCell>
                                                            <TableCell className="text-right">{new Date(item.created_at).toLocaleString()}</TableCell>
                                                        </TableRow>
                                                    )
                                                }) : (
                                                    <TableRow>
                                                        <TableCell className="text-center" colSpan={7}>No Data</TableCell>
                                                    </TableRow>
                                                )
                                        }
                                        <SheetContent className={`min-w-max`}>
                                            <SheetHeader>
                                                <SheetTitle>Order Details</SheetTitle>
                                            </SheetHeader>
                                            <ScrollArea className={`min-h-max w-[512px] my-4 p-4`}>
                                                <div className="flex flex-col">
                                                    <div className="w-full grid grid-cols-12">
                                                        <div className="col-start-1 col-span-4 space-y-2">
                                                            <p className="text-muted-foreground">Order ID</p>
                                                        </div>
                                                        <div className="col-start-5 col-span-8 space-y-2">
                                                            <p>{dialogOrder.order_id ? dialogOrder.order_id : "-"}</p>
                                                        </div>
                                                    </div>
                                                    <Separator className="my-4" />
                                                    <div className="w-full grid grid-cols-12">
                                                        <div className="col-start-1 col-span-4 space-y-2">
                                                            <p className="text-muted-foreground">Symbol</p>
                                                            <p className="text-muted-foreground">Asset Class</p>
                                                            <p className="text-muted-foreground">Quantity</p>
                                                            <p className="text-muted-foreground">Filled Quantity</p>
                                                            <p className="text-muted-foreground">Filled Average Price</p>
                                                            <p className="text-muted-foreground">Commission</p>
                                                            <p className="text-muted-foreground">Commission BPS</p>
                                                            <p className="text-muted-foreground">Type</p>
                                                            <p className="text-muted-foreground">Side</p>
                                                            <p className="text-muted-foreground">Time In Force</p>
                                                            <p className="text-muted-foreground">Limit Price</p>
                                                            <p className="text-muted-foreground">Stop Price</p>
                                                            <p className="text-muted-foreground">Status</p>
                                                        </div>
                                                        <div className="col-start-5 col-span-8 space-y-2">
                                                            <p>{dialogOrder.symbol ? dialogOrder.symbol : "-"}</p>
                                                            <p>{dialogOrder.asset_class ? dialogOrder.asset_class : "-"}</p>
                                                            <p>{dialogOrder.qty ? dialogOrder.qty : "-"}</p>
                                                            <p>{dialogOrder.filled_qty ? dialogOrder.filled_qty : "-"}</p>
                                                            <p>{dialogOrder.filled_avg_price ? "$ " + dialogOrder.filled_avg_price : "-"}</p>
                                                            <p>{dialogOrder.commission ? dialogOrder.commission : "-"}</p>
                                                            <p>{dialogOrder.commission_bps ? dialogOrder.commission_bps : "-"}</p>
                                                            <p>{dialogOrder.type ? dialogOrder.type : "-"}</p>
                                                            <p>{dialogOrder.side ? dialogOrder.side : "-"}</p>
                                                            <p>{dialogOrder.time_in_force ? dialogOrder.time_in_force.toUpperCase() : "-"}</p>
                                                            <p>{dialogOrder.limit_price ? "$ " + dialogOrder.limit_price : "-"}</p>
                                                            <p>{dialogOrder.stop_price ? "$ " + dialogOrder.stop_price : "-"}</p>
                                                            <p>{dialogOrder.status ? dialogOrder.status : "-"}</p>
                                                        </div>
                                                    </div>
                                                    <Separator className="my-4" />
                                                    <div className="w-full grid grid-cols-12">
                                                        <div className="col-start-1 col-span-4 space-y-2">
                                                            <p className="text-muted-foreground">Created At</p>
                                                            <p className="text-muted-foreground">Updated At</p>
                                                            <p className="text-muted-foreground">Submitted At</p>
                                                            <p className="text-muted-foreground">Filled At</p>
                                                            <p className="text-muted-foreground">Expired At</p>
                                                            <p className="text-muted-foreground">Cancelled At</p>
                                                            <p className="text-muted-foreground">Failed At</p>
                                                        </div>
                                                        <div className="col-start-5 col-span-8 space-y-2">
                                                            <p>{dialogOrder.created_at ? new Date(dialogOrder.created_at).toLocaleString() : "-"}</p>
                                                            <p>{dialogOrder.updated_at ? new Date(dialogOrder.updated_at).toLocaleString() : "-"}</p>
                                                            <p>{dialogOrder.submitted_at ? new Date(dialogOrder.submitted_at).toLocaleString() : "-"}</p>
                                                            <p>{dialogOrder.filled_at ? new Date(dialogOrder.filled_at).toLocaleString() : "-"}</p>
                                                            <p>{dialogOrder.expired_at ? new Date(dialogOrder.expired_at).toLocaleString() : "-"}</p>
                                                            <p>{dialogOrder.cancelled_at ? new Date(dialogOrder.cancelled_at).toLocaleString() : "-"}</p>
                                                            <p>{dialogOrder.failed_at ? new Date(dialogOrder.failed_at).toLocaleString() : "-"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </ScrollArea>
                                        </SheetContent>
                                    </Sheet>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage