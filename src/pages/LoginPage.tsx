//#region IMPORTS

import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserContext, UserContextValues } from "@/context/UserContext"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"

//#endregion

const LoginPage = () => {
    const navigate = useNavigate()
    const { isLoggedIn, TryLogIn } = useContext(UserContext) as UserContextValues
    if (isLoggedIn) navigate("/")

    const formSchema = z.object({
        email_address: z.string().email(),
        password: z.string(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email_address: "",
            password: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        TryLogIn(values.email_address, values.password)
        navigate("/")
    };

    return (
        <div className='tw-min-w-screen tw-min-h-screen tw-flex tw-justify-center tw-items-center'>
            <Card className="tw-w-[400px] tw-min-h-[500px] tw-drop-shadow-[0_0_32px_rgba(238,238,238,0.1)]">
                <CardHeader className="tw-w-full tw-text-center tw-mt-4 tw-mb-2">
                    <CardTitle className="tw-tracking-tight tw-font-thin tw-text-5xl tw-p-0">Welcome <br /> Again Mate!</CardTitle>
                </CardHeader>
                <CardContent className="tw-w-full tw-min-h-max tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-0">
                    <Separator className="tw-w-[85%]" />
                </CardContent>
                <CardContent className="tw-w-full tw-mt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-2">
                            {/* EMAIL */}
                            <FormField
                                control={form.control}
                                name="email_address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* PASSWORD */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="tw-mb-2 tw-mt-8">Login</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPage