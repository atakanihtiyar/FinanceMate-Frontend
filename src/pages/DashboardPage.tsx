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
import { getOrders, getPositions, getTradingData } from "@/lib/backend_service"

const DashboardPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
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
    }])

    useEffect(() => {
        if (!isAuthRequestEnd) return
        if (isLoggedIn && user) {
            Promise.all([getTradingData(user.account_number), getPositions(user.account_number), getOrders(user.account_number)]).then((data) => {
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

    const calculatePNL = (oldValue: string, newValue: string) => {
        const _old = parseFloat(oldValue)
        const _new = parseFloat(newValue)

        const pnl = _old === 0 && _new === 0 ? 0 : (_new * 100 / _old) - 100
        return (
            <span className={`${pnl > 0 ? "text-[var(--success)]" : (pnl < 0 && "text-[var(--destructive)]")}`}>
                {pnl.toFixed(2)}%
            </span>
        )
    }

    return (
        <div className="min-w-screen min-h-screen flex flex-col justify-center items-center space-x-48">
            <div className=" w-7/12 grow py-8 flex flex-col justify-start items-start gap-12">
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
                    <div className="h-full w-full col-span-3 border-[1px] border-[var(--muted)] rounded-sm flex justify-center items-center">
                        <p className="text-center">GRAPH PLACEHOLDER</p>
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
                                        orders.length > 0 ?
                                            orders.map((item) => {
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
                                                    <TableCell className="text-center" colSpan={7}>No Data</TableCell>
                                                </TableRow>
                                            )
                                    }
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