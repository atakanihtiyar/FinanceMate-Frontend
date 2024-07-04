import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserContext, UserContextValues } from "@/context/UserContext"
import { createAchRelationship, deleteAchRelationship, getAchRelationships, getAssetData, getPositions } from "@/lib/server_service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

const AchFormSchema = z.object({
    nickname: z.string().optional(),
    account_owner_name: z.string(),
    bank_account_type: z.enum(["CHECKING", "SAVINGS"]),
    bank_account_number: z.string(),
    bank_routing_number: z.string(),
})

const WalletPage = () => {
    const navigate = useNavigate()
    const { user, isLoggedIn, isAuthRequestEnd } = useContext(UserContext) as UserContextValues

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


    const [isNewAch, setIsNewAch] = useState(false)
    const [achData, setAchData] = useState<{
        nickname: string,
        relation_id: string,
        created_at: string,
        updated_at: string,
        status: string,
        account_owner_name: string,
        bank_account_type: string,
        bank_account_number: string,
        bank_routing_number: string,
    }[]>([])

    useEffect(() => {
        if (!isAuthRequestEnd) return
        if (isLoggedIn && user) {
            Promise.all([
                getAchRelationships(user.account_number),
                getPositions(user.account_number),
            ]).then((data) => {
                if (data) {
                    if (data[0])
                        setAchData(data[0])
                    if (data[1])
                        setPositions(data[1])
                }
            })
        }
        else {
            navigate("/")
        }
    }, [isAuthRequestEnd])

    const achForm = useForm<z.infer<typeof AchFormSchema>>({
        resolver: zodResolver(AchFormSchema),
        defaultValues: {
            nickname: "",
            account_owner_name: "",
            bank_account_number: "",
            bank_routing_number: "",
        }
    })

    function onSubmit(data: z.infer<typeof AchFormSchema>) {
        const sendData = async () => {
            const resData = await createAchRelationship(user?.account_number!, data)
            if (resData) {
                setIsNewAch(false)
                setAchData(oldAchData => {
                    return [
                        ...oldAchData,
                        resData
                    ]
                })
            }
        }
        sendData()
    }

    function onDelete(achId: string) {
        const deleteAch = async () => {
            const resData = await deleteAchRelationship(user?.account_number!, achId)

            if (resData) {
                setAchData(oldAchData => {
                    return oldAchData.filter(ach => {
                        if (ach.relation_id !== achId)
                            return ach
                    })
                })
            }
        }
        deleteAch()
    }

    return (
        <div className="min-w-screen min-h-screen flex flex-col justify-center items-center">
            <div className="w-8/12 grow py-8 flex flex-col justify-start items-start gap-12">
                <Card className="w-full border-0">
                    <CardHeader>
                        <CardTitle>Positions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Symbol</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Last</TableHead>
                                    <TableHead>Change %</TableHead>
                                    <TableHead>Cost Basis</TableHead>
                                    <TableHead>Mkt Val</TableHead>
                                    <TableHead>Avg Val</TableHead>
                                    <TableHead>Daily PNL</TableHead>
                                    <TableHead>Unrealized PNL</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    positions.length > 0 ?
                                        positions.map((item) => {
                                            return (
                                                <TableRow key={item.symbol} className="cursor-pointer hover:bg-accent"
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
                                                    <TableCell>{item.symbol}</TableCell>
                                                    <TableCell>{item.qty}</TableCell>
                                                    <TableCell>{item.current_price}</TableCell>
                                                    <TableCell>{(parseFloat(item.change_today) * 100).toFixed(2)}</TableCell>
                                                    <TableCell>{item.cost_basis}</TableCell>
                                                    <TableCell>{item.market_value}</TableCell>
                                                    <TableCell>{item.avg_entry_price}</TableCell>
                                                    <TableCell>{item.unrealized_intraday_pl}</TableCell>
                                                    <TableCell>{item.unrealized_pl}</TableCell>
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
            </div>
            <div className="w-8/12 grow py-8 flex flex-col justify-start items-start gap-12">
                <Card className="border-0">
                    <CardHeader>
                        <CardTitle>ACH Relationships</CardTitle>
                    </CardHeader>
                </Card>
                <div className="w-full flex flex-row flex-wrap gap-4 justify-center">
                    {achData && achData.map((ach => {
                        return (
                            <Card key={ach.relation_id} className="min-w-[360px] h-[436px] flex flex-col">
                                <CardHeader>
                                    <CardTitle className="w-full text-center">{ach.nickname}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col grow justify-center">
                                    <Table>
                                        <TableBody>
                                            <TableRow className="cursor-pointer hover:bg-accent">
                                                <TableCell>
                                                    <p className="text-muted-foreground">Status</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p className={ach.status === "APPROVED" ? "text-[--success]" :
                                                        ach.status === "CANCEL_REQUESTED" ? "text-destructive" :
                                                            "text-[--warning]"}>{ach.status}</p>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="cursor-pointer hover:bg-accent">
                                                <TableCell>
                                                    <p className="text-muted-foreground">Owner</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p>{ach.account_owner_name}</p>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="cursor-pointer hover:bg-accent">
                                                <TableCell>
                                                    <p className="text-muted-foreground">Account Type</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p>{ach.bank_account_type}</p>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="cursor-pointer hover:bg-accent">
                                                <TableCell>
                                                    <p className="text-muted-foreground">Account Number</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p>{ach.bank_account_number}</p>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter className="w-full flex flex-row justify-center">
                                    <Button variant="destructive" onClick={() => onDelete(ach.relation_id)}>Delete</Button>
                                </CardFooter>
                            </Card>
                        )
                    }))}
                    {
                        isNewAch ?
                            <Card className="min-w-[360px] h-[436px] flex flex-col">
                                <CardHeader>
                                    <CardTitle className="w-full text-center">Create New ACH</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col grow justify-center">
                                    <Form {...achForm}>
                                        <form onSubmit={achForm.handleSubmit(onSubmit)} className="w-full h-full flex flex-col justify-end items-center gap-4">
                                            <FormField
                                                control={achForm.control}
                                                name="nickname"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormControl>
                                                            <Input type="text" placeholder="Name" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={achForm.control}
                                                name="account_owner_name"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormControl>
                                                            <Input type="text" placeholder="Bank Account Owner" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={achForm.control}
                                                name="bank_account_type"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Bank Account Type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="CHECKING">Checking</SelectItem>
                                                                <SelectItem value="SAVINGS">Savings</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={achForm.control}
                                                name="bank_account_number"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormControl>
                                                            <Input type="text" placeholder="Bank Account Number" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={achForm.control}
                                                name="bank_routing_number"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormControl>
                                                            <Input type="text" placeholder="Bank Routing" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="w-full flex flex-row justify-evenly mt-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        achForm.reset()
                                                        setIsNewAch(false)
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button variant="default" type="submit">Create</Button>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card> :
                            <Button
                                variant="outline"
                                className="min-w-[360px] h-[436px] flex justify-center items-center text-xl"
                                onClick={() => setIsNewAch(true)}
                            >
                                Create New Ach
                            </Button>
                    }
                </div>
            </div>
        </div >
    )
}

export default WalletPage