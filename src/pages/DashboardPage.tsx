import { Button } from "@/components/ui/button"
import { useLocation, useNavigate } from "react-router-dom"
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
import { useContext, useEffect, useState } from "react"
import { UserContext, UserContextValues } from "@/context/UserContext"
import { Separator } from "@/components/ui/separator"

const initialTradingData = {
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
    positions: [{
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
    }],
    orders: [{
        order_id: "",
        symbol: "",
        filled_at: "",
        created_at: "",
        qty: "0",
        filled_qty: "0",
        filled_avg_price: "0",
        order_type: "",
        side: "",
        limit_price: "0",
        stop_price: "0",
        commission: "0",
    }],
}

const DashboardPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, isLoggedIn, isAuthRequestEnd } = useContext(UserContext) as UserContextValues
    const [tradingData, setTradingData] = useState<typeof initialTradingData>(initialTradingData)

    /* 
        api service
    */
    const GetTradingData = async () => {
        const response = await fetch(`http://localhost:5050/trading/${user?.account_number}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (response.status === 200) {
            const data = await response.json()
            setTradingData(data)
        }
    }

    useEffect(() => {
        if (!isAuthRequestEnd) return
        if (isLoggedIn) {
            GetTradingData()
        }
        else {
            navigate("/")
        }
    }, [isAuthRequestEnd])

    const calculatePNL = (oldValue: string, newValue: string) => {
        const _old = parseFloat(oldValue)
        const _new = parseFloat(newValue)

        const pnl = _old === 0 && _new === 0 ? 0 : (_new * 100 / _old) - 100
        return (
            <span className={`${pnl > 0 ? "tw-text-[var(--success)]" : (pnl < 0 && "tw-text-[var(--destructive)]")}`}>
                {pnl.toFixed(2)}%
            </span>
        )
    }

    return (
        <div className="tw-min-w-screen tw-min-h-screen tw-flex tw-flex-row tw-space-x-48">
            <div className="tw-min-h-screen tw-max-w-max tw-flex tw-flex-col tw-justify-start tw-items-start tw-py-8 tw-gap-y-2">
                <Button variant="ghost" className={`!tw-m-0 tw-rounded-md tw-rounded-l-[0px]
                ${!location.pathname.includes("/dashboard") && "tw-text-[var(--muted)]"}`} onClick={() => navigate("/dashboard")}>Overview</Button>

                <Button variant="ghost" className={`!tw-m-0 tw-rounded-md tw-rounded-l-[0px]
                ${!location.pathname.includes("/balances") && "tw-text-[var(--muted)]"}`} onClick={() => navigate("/balances")}>Balances</Button>

                <Button variant="ghost" className={`!tw-m-0 tw-rounded-md tw-rounded-l-[0px]
                ${!location.pathname.includes("/positions") && "tw-text-[var(--muted)]"}`} onClick={() => navigate("/positions")}>Positions</Button>
            </div>
            <div className="tw-w-full tw-grow tw-py-8 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-12">
                <div className="tw-w-full tw-grid tw-grid-cols-4 tw-justify-center tw-items-start tw-gap-2">
                    <div dir="rtl" className="">
                        <Card className="tw-border-0 tw-mb-8">
                            <CardHeader>
                                <CardTitle className="tw-text-xl">{user?.given_name + " " + user?.family_name}</CardTitle>
                                <CardDescription className="tw-text-sm">#{user?.account_number.toString()}</CardDescription>
                            </CardHeader>
                        </Card>
                        <Separator />
                        <Card className="tw-border-0">
                            <CardHeader className="tw-flex tw-flex-col">
                                <CardDescription className="tw-w-[50%] tw-col-span-1">Portfolio Value</CardDescription>
                                <CardDescription className="tw-w-[50%] tw-col-span-1">$ {tradingData.portfolio_value}</CardDescription>
                            </CardHeader>
                        </Card>
                        <Separator />
                        <Card className="tw-border-0">
                            <CardHeader className="tw-flex tw-flex-col">
                                <CardDescription>Buying Power</CardDescription>
                                <CardDescription>$ {tradingData.buying_power}</CardDescription>
                            </CardHeader>
                        </Card>
                        <Separator />
                    </div>
                    <div className="tw-h-full tw-w-full tw-col-span-3 tw-border-[1px] tw-border-[var(--muted)] tw-rounded-sm tw-flex tw-justify-center tw-items-center">
                        <p className="tw-text-center">GRAPH PLACEHOLDER</p>
                    </div>
                </div>
                <div className="tw-w-full tw-grid tw-grid-cols-3 tw-justify-center tw-items-start tw-gap-2">
                    <Card className="tw-rounded-sm">
                        <CardHeader>
                            <CardTitle>Cash</CardTitle>
                            <p>$ {tradingData.cash}</p>
                            <CardDescription>PNL: {calculatePNL(tradingData.last_cash, tradingData.cash)}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="tw-rounded-sm">
                        <CardHeader>
                            <CardTitle>Long Market Value</CardTitle>
                            <p>$ {tradingData.long_market_value}</p>
                            <CardDescription>PNL: {calculatePNL(tradingData.last_long_market_value, tradingData.long_market_value)}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="tw-rounded-sm">
                        <CardHeader>
                            <CardTitle>Short Market Value</CardTitle>
                            <p>$ {tradingData.short_market_value}</p>
                            <CardDescription>PNL: {calculatePNL(tradingData.last_short_market_value, tradingData.short_market_value)}</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <div className="tw-w-full tw-grid tw-grid-cols-2 tw-justify-center tw-items-start tw-gap-2">
                    <Card className="tw-rounded-sm">
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
                                        tradingData.positions.length > 0 ?
                                            tradingData.positions.map((item) => {
                                                return (
                                                    <TableRow key={item.symbol}>
                                                        <TableCell className="font-medium">{item.symbol}</TableCell>
                                                        <TableCell>{item.cost_basis}</TableCell>
                                                        <TableCell>{item.market_value}</TableCell>
                                                        <TableCell>{item.unrealized_pl}</TableCell>
                                                        <TableCell>{item.current_price}</TableCell>
                                                        <TableCell className="tw-text-right">{(parseFloat(item.change_today) * 100).toFixed(2)}</TableCell>
                                                    </TableRow>)
                                            }) : (
                                                <TableRow>
                                                    <TableCell className="tw-text-center" colSpan={6}>No Data</TableCell>
                                                </TableRow>
                                            )
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card className="tw-rounded-sm">
                        <CardHeader>
                            <CardTitle>Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Symbol</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Filled At</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Limit</TableHead>
                                        <TableHead>Stop</TableHead>
                                        <TableHead className="text-right">Side</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        tradingData.orders.length > 0 ?
                                            tradingData.orders.map((item) => {
                                                return (
                                                    <TableRow key={item.symbol}>
                                                        <TableCell className="font-medium">{item.symbol}</TableCell>
                                                        <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                                                        <TableCell>{new Date(item.filled_at).toLocaleString()}</TableCell>
                                                        <TableCell>{item.filled_at ? item.filled_qty : item.qty}</TableCell>
                                                        <TableCell>{item.limit_price}</TableCell>
                                                        <TableCell>{item.stop_price}</TableCell>
                                                        <TableCell className="text-right">{item.side}</TableCell>
                                                    </TableRow>)
                                            }) : (
                                                <TableRow>
                                                    <TableCell className="tw-text-center" colSpan={7}>No Data</TableCell>
                                                </TableRow>
                                            )
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="tw-min-h-screen tw-max-w-max tw-flex tw-flex-col tw-justify-start tw-items-center tw-py-8 tw-gap-y-1">
                <Button variant="ghost" className="!tw-m-0 tw-rounded-l-[0px]" disabled>        </Button>
            </div>
        </div>
    )
}

export default DashboardPage