import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { UserContext, UserContextValues } from "@/context/UserContext"
import { getAchRelationships } from "@/lib/server_service"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const WalletPage = () => {
    const navigate = useNavigate()
    const { user, isLoggedIn, isAuthRequestEnd } = useContext(UserContext) as UserContextValues
    const [achData, setAchData] = useState<{
        id: string,
        created_at: string,
        updated_at: string,
        status: string,
        account_owner_name: string,
        bank_account_type: string,
        bank_account_number: string,
        bank_routing_number: string,
        nickname: string,
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

    return (
        <div className="min-w-screen min-h-screen flex flex-col justify-center items-center space-x-48">
            <div className="w-8/12 grow py-8 flex flex-col justify-start items-start gap-12">
                <Card className="border-0">
                    <CardHeader>
                        <CardTitle className="text-xl">Cards</CardTitle>
                    </CardHeader>
                </Card>
                <div className="w-full flex flex-row flex-wrap gap-4">
                    {achData && achData.map((ach => {
                        return (
                            <Card key={ach.id} className="w-[30%]">
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
                            </Card>
                        )
                    }))}
                </div>
            </div>
        </div>
    )
}

export default WalletPage