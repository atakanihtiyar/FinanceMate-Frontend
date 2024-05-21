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


const DashboardPage = () => {
    const navigate = useNavigate()
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
                            <p>$ 0.00</p>
                            <CardDescription>PNL: 0%</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Cash</CardTitle>
                            <p>$ 0.00</p>
                            <CardDescription>PNL: 0%</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Long Market Value</CardTitle>
                            <p>$ 0.00</p>
                            <CardDescription>PNL: 0%</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Short Market Value</CardTitle>
                            <p>$ 0.00</p>
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
                                        <TableHead className="w-[100px]">Invoice</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">INV001</TableCell>
                                        <TableCell>Paid</TableCell>
                                        <TableCell>Credit Card</TableCell>
                                        <TableCell className="text-right">$250.00</TableCell>
                                    </TableRow>
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
                                        <TableHead className="w-[100px]">Invoice</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">INV001</TableCell>
                                        <TableCell>Paid</TableCell>
                                        <TableCell>Credit Card</TableCell>
                                        <TableCell className="text-right">$250.00</TableCell>
                                    </TableRow>
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