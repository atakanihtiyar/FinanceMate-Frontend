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
import { getAccountPortfolioHistory, getOrders, getPositions, getTradingData, PortfolioHistoryTimeFrameType } from "@/lib/server_service"
import LineChart from "@/components/parts/Charts/LineCharts/LineChart"
import { Point } from "@/components/parts/Charts/LineCharts/Lines"

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

    const calculatePNL = (oldValue: string, newValue: string) => {
        const _old = parseFloat(oldValue)
        const _new = parseFloat(newValue)

        const pnl = _old === 0 && _new === 0 ? 0 : (_new * 100 / _old) - 100
        return (
            <span className={`${pnl > 0 ? "text-[--success-txt]" : (pnl < 0 ? "text-[--destructive-txt]" : "text-foreground")}`}>
                {pnl.toFixed(2)}%
            </span>
        )
    }

    return (
        <div className="min-w-screen min-h-screen flex flex-col justify-center items-center space-x-48">
            <div className="w-8/12 grow py-8 flex flex-col justify-start items-start gap-12">
                <div className="w-full grid grid-cols-4 justify-center items-start gap-2">
                    <div dir="rtl" className="">
                        <Card className="border-0 mb-8">
                            <CardHeader>
                                <CardTitle className="text-xl">{user?.given_name + " " + user?.family_name}</CardTitle>
                                <CardDescription className="text-sm">#{user?.account_number.toString()}</CardDescription>
                            </CardHeader>
                        </Card>
                        <Separator />
                        <Card className="border-0">
                            <CardHeader className="flex flex-col">
                                <CardDescription className="w-[50%] col-span-1">Portfolio Value</CardDescription>
                                <CardDescription className="w-[50%] col-span-1">$ {tradingData.portfolio_value}</CardDescription>
                            </CardHeader>
                        </Card>
                        <Separator />
                        <Card className="border-0">
                            <CardHeader className="flex flex-col">
                                <CardDescription>Buying Power</CardDescription>
                                <CardDescription>$ {tradingData.buying_power}</CardDescription>
                            </CardHeader>
                        </Card>
                        <Separator />
                    </div>
                    <div className="h-[512px] w-full col-span-3">
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
                <div className="w-full grid grid-cols-3 justify-center items-start gap-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cash</CardTitle>
                            <p>$ {tradingData.cash}</p>
                            <CardDescription>PNL: {calculatePNL(tradingData.last_cash, tradingData.cash)}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Long Market Value</CardTitle>
                            <p>$ {tradingData.long_market_value}</p>
                            <CardDescription>PNL: {calculatePNL(tradingData.last_long_market_value, tradingData.long_market_value)}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Short Market Value</CardTitle>
                            <p>$ {tradingData.short_market_value}</p>
                            <CardDescription>PNL: {calculatePNL(tradingData.last_short_market_value, tradingData.short_market_value)}</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <div className="w-full grid grid-cols-2 justify-center items-start gap-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Positions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Symbol</TableHead>
                                        <TableHead>Cost Basis</TableHead>
                                        <TableHead>Mkt Val</TableHead>
                                        <TableHead>Unrealized PNL</TableHead>
                                        <TableHead>Last</TableHead>
                                        <TableHead className="text-right">Change %</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        positions.length > 0 ?
                                            positions.map((item) => {
                                                return (
                                                    <TableRow key={item.symbol}>
                                                        <TableCell className="font-medium">{item.symbol}</TableCell>
                                                        <TableCell>{item.cost_basis}</TableCell>
                                                        <TableCell>{item.market_value}</TableCell>
                                                        <TableCell>{item.unrealized_pl}</TableCell>
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Side</TableHead>
                                        <TableHead className="w-[100px]">Symbol</TableHead>
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
                                                        <TableRow key={item.order_id} className="cursor-pointer hover:bg-accent" onClick={() => {
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