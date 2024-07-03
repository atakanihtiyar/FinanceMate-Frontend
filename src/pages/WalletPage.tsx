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
import { UserContext, UserContextValues } from "@/context/UserContext"
import { createAchRelationship, deleteAchRelationship, getAchRelationships } from "@/lib/server_service"
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
            getAchRelationships(user.account_number)
                .then((data) => {
                    if (data) {
                        setAchData(data)
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
        <div className="min-w-screen min-h-screen flex flex-col justify-center items-center space-x-48">
            <div className="w-8/12 grow py-8 flex flex-col justify-start items-start gap-12">
                <Card className="border-0">
                    <CardHeader>
                        <CardTitle className="text-xl">Cards</CardTitle>
                    </CardHeader>
                </Card>
                <div className="w-full grid grid-cols-3 gap-4">
                    {achData && achData.map((ach => {
                        return (
                            <Card key={ach.relation_id} className="min-w-[248px] min-h-[436px]">
                                <CardHeader>
                                    <CardTitle>{ach.nickname}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Status:&nbsp;
                                        <span className={ach.status === "APPROVED" ? "text-[--success]" :
                                            ach.status === "CANCEL_REQUESTED" ? "text-destructive" :
                                                "text-[--warning]"}>
                                            {ach.status}
                                        </span>
                                    </p>
                                    <p>Owner: {ach.account_owner_name}</p>
                                    <p>Type: {ach.bank_account_type}</p>
                                    <p>Bank number: {ach.bank_account_number}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="destructive" onClick={() => onDelete(ach.relation_id)}>Delete</Button>
                                </CardFooter>
                            </Card>
                        )
                    }))}
                    {
                        isNewAch ?
                            <Card className="min-w-[248px] min-h-[436px]">
                                <CardHeader className="relative">
                                    <CardTitle>Add ACH</CardTitle>
                                    <Button
                                        variant="ghost"
                                        className="absolute top-3 right-4"
                                        onClick={() => {
                                            achForm.reset()
                                            setIsNewAch(false)
                                        }}
                                    >
                                        X
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <Form {...achForm}>
                                        <form onSubmit={achForm.handleSubmit(onSubmit)} className="w-full h-full flex flex-col justify-center items-center space-y-4">
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

                                            <Button variant="default" type="submit" className="w-full">Create</Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card> :
                            <Button
                                variant="outline"
                                className="min-w-[248px] min-h-[436px] flex justify-center items-center"
                                onClick={() => setIsNewAch(true)}
                            >
                                Add New Ach
                            </Button>
                    }

                </div>
            </div>
        </div >
    )
}

export default WalletPage