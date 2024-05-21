import { Button } from "@/components/ui/button"
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
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"

const initialTradingData = {
    currency: "USD",
    portfolio_value: 0,
    cash: 0,
    long_market_value: 0,
    short_market_value: 0,
    last_portfolio_value: 0,
    last_cash: 0,
    last_long_market_value: 0,
    last_short_market_value: 0,
    positions: [{
        symbol: "",
        exchange: "",
        avg_entry_price: 0,
        qty: 0,
        side: "",
        cost_basis: 0,
        market_value: 0,
        unrealized_pl: 0,
        unrealized_plpc: 0,
        unrealized_intraday_pl: 0,
        unrealized_intraday_plpc: 0,
        current_price: 0,
        change_today: 0
    }],
    orders: [{
        order_id: "",
        symbol: "",
        filled_at: "",
        created_at: "",
        qty: 0,
        filled_qty: 0,
        filled_avg_price: 0,
        order_type: "",
        side: "",
        limit_price: 0,
        stop_price: 0,
        commission: 0,
    }],
}

const DashboardPage = () => {
    const navigate = useNavigate()
    const [tradingData, setTradingData] = useState<typeof initialTradingData>(initialTradingData)

    const calculatePNL = (oldValue: number, newValue: number) => {
        const pnl = (newValue * 100 / oldValue) - 100
        return (
            <span className={`${pnl > 0 ? "tw-text-[var(--success)]" : (pnl < 0 && "tw-text-[var(--destructive)]")}`}>
                {pnl}%
            </span>
        )
    }

    const GetTradingData = async () => {
        const response = await fetch("http://localhost:5050/trading/asd", {
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
        GetTradingData()
    }, [])

    return (
        <div className="tw-min-w-screen tw-min-h-screen tw-flex tw-flex-row">
            <div className="tw-min-h-screen tw-max-w-max tw-flex tw-flex-col tw-justify-start tw-items-start tw-py-8 tw-gap-y-1">
                <Button variant="ghost" className="!tw-m-0 tw-rounded-l-[0px]" onClick={() => navigate("/overview")}>Overview</Button>
                <Button variant="ghost" className="!tw-m-0 tw-rounded-l-[0px]" onClick={() => navigate("/balances")}>Balances</Button>
                <Button variant="ghost" className="!tw-m-0 tw-rounded-l-[0px]" onClick={() => navigate("/positions")}>Positions</Button>
            </div>
            <div className="tw-w-full tw-grow tw-py-8 tw-px-16 tw-flex tw-flex-col tw-justify-start tw-items-start tw-gap-12">
                <div className="tw-w-full tw-grid tw-grid-cols-4 tw-justify-center tw-items-start tw-gap-4">
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Portfolio Value</CardTitle>
                            <p>$ {tradingData.portfolio_value}</p>
                            <CardDescription>PNL: {calculatePNL(tradingData.last_portfolio_value, tradingData.portfolio_value)}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Cash</CardTitle>
                            <p>$ {tradingData.cash}</p>
                            <CardDescription>PNL: {calculatePNL(tradingData.last_cash, tradingData.cash)}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Long Market Value</CardTitle>
                            <p>$ {tradingData.long_market_value}</p>
                            <CardDescription>PNL: {calculatePNL(tradingData.last_long_market_value, tradingData.long_market_value)}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Short Market Value</CardTitle>
                            <p>$ {tradingData.short_market_value}</p>
                            <CardDescription>PNL: 0%</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <div className="tw-w-full tw-flex tw-justify-center tw-items-center tw-gap-4">
                    <Card className="tw-w-full">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="tw-h-[480px] tw-w-full tw-flex tw-justify-center tw-items-center tw-border">
                            <p className="tw-text-center">PLACEHOLDER</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="tw-w-full tw-grid tw-grid-cols-2 tw-justify-center tw-items-start tw-gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Positions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableCaption>A list of your recent invoices.</TableCaption>
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
                                        tradingData.positions.map((item) => {
                                            return (
                                                <TableRow key={item.symbol}>
                                                    <TableCell className="font-medium">
                                                        <div>{item.symbol}</div>
                                                        <div className="tw-text-xs tw-text-[var(--muted)]">{item.exchange}</div>
                                                    </TableCell>
                                                    <TableCell>{item.cost_basis}</TableCell>
                                                    <TableCell>{item.market_value}</TableCell>
                                                    <TableCell>{item.unrealized_pl}</TableCell>
                                                    <TableCell>{item.current_price}</TableCell>
                                                    <TableCell className="text-right">{item.change_today * 100}</TableCell>
                                                </TableRow>)
                                        })
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
                                <TableCaption>A list of your recent invoices.</TableCaption>
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
                                        })
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