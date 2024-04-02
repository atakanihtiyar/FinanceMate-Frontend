//#region IMPORTS

import "./pageStyles.css"
import { Navbar, Footer } from "@/components/parts/navigationMenus"
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

//#endregion

const RegisterPage = () => {
    const formSchema = z.object({
        email: z.string().email(),
        password: z.string().min(3).max(12),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },

    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
    };

    return (
        <>
            <Navbar />
            <div className='full-view tw-flex tw-flex-col tw-justify-center tw-items-center tw-flex-nowrap tw-gap-8'>
                <h1 className="tw-tracking-tight tw-text-6xl tw-font-thin tw-m-8">Welcome Mate!</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="auth-form-input">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="auth-form-input">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Register</Button>
                    </form>
                </Form>
            </div>
            <Footer />
        </>
    )
}

export default RegisterPage