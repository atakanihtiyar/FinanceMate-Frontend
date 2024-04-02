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

    const fieldClass = "tw-w-[66%] tw-text-[--mate-dark-black] tw-border-[--mate-dark-black]"

    return (
        <>
            <Navbar />
            <div className='tw-min-w-full tw-min-h-screen tw-flex tw-flex-col tw-justify-center tw-items-center tw-flex-nowrap tw-gap-8'>
                <h1 className="txt tw-text-6xl tw-font-thin tw-m-8">Welcome Mate!</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="tw-min-w-[360px] tw-min-h-[440px] tw-bg-[--mate-white] tw-rounded-xl tw-flex tw-flex-col tw-justify-center tw-items-center tw-space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className={fieldClass}>
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
                                <FormItem className={fieldClass}>
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