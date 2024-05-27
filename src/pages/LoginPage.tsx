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
import { useContext, useEffect } from "react"

//#endregion

const LoginPage = () => {
    const navigate = useNavigate()
    const { isLoggedIn, TryLogIn } = useContext(UserContext) as UserContextValues
    useEffect(() => {
        if (isLoggedIn) navigate("/")
    }, [isLoggedIn])

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
        <div className='min-w-screen min-h-screen flex justify-center items-center'>
            <Card className="w-[400px] min-h-[250px]">
                <CardHeader className="text-center">
                    <CardTitle className="font-thin text-5xl">Welcome <br /> Again Mate!</CardTitle>
                </CardHeader>
                <CardContent>
                    <Separator />
                </CardContent>
                <CardContent className="">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center items-center gap-2">
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
                            <Button type="submit" className="mb-4 mt-4 w-32">Login</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPage