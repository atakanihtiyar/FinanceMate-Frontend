import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { countries } from 'countries-list'
import { getEmojiFlag } from 'countries-list'
import { useContext } from "react"
import { RegisterDataContext } from "./RegisterPage"

interface Props {
    goNextStep: () => void
}

const RegisterStep1 = ({ goNextStep }: Props) => {
    const { formData, setRegisterData } = useContext(RegisterDataContext)

    const formSchema = z.object({
        given_name: z.string().trim().min(3).max(20).regex(/^[ -~]+$/),
        family_name: z.string().trim().min(3).max(20).regex(/^[ -~]+$/),
        country_of_tax_residence: z.string().trim().length(3, "You should pick one"),
        email_address: z.string().trim().min(1).max(60).email(),
        password: z.string().min(3).max(16).regex(/^[ -~]+$/),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            given_name: formData.identity.given_name,
            family_name: formData.identity.family_name,
            country_of_tax_residence: formData.identity.country_of_tax_residence,
            email_address: formData.contact.email_address,
            password: "",
        },
    })

    const handleGoNext = (values: z.infer<typeof formSchema>) => {
        setRegisterData({
            given_name: values.given_name,
            family_name: values.family_name,
            country_of_tax_residence: values.country_of_tax_residence,
            email_address: values.email_address,
            password: values.password,
        })
        goNextStep()
    }

    return (
        <Card className="w-[400px] min-h-[250px]">
            <CardHeader className="text-center">
                <CardTitle className="font-thin text-5xl">Welcome Mate!</CardTitle>
                <CardDescription className="tracking-wide font-thin text-lg">Start the journey with us today.</CardDescription>
            </CardHeader>
            <CardContent>
                <Separator />
            </CardContent>
            <CardContent>
                <Form {...form}>
                    <form className="flex flex-col items-center gap-2">
                        {/* GIVEN NAME */}
                        <FormField
                            control={form.control}
                            name="given_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* FAMILY NAME */}
                        <FormField
                            control={form.control}
                            name="family_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* TAX RESIDENCE */}
                        <FormField
                            control={form.control}
                            name="country_of_tax_residence"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tax Residence</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a Country" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={"USA"}>{getEmojiFlag("US")} {countries.US.name}</SelectItem>
                                            <SelectItem value={"TUR"}>{getEmojiFlag("TR")} {countries.TR.name}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        <div className="w-[80%] flex justify-end mr-4 mt-4">
                            <Button type="submit" className="w-20" onClick={form.handleSubmit(handleGoNext)}>Next</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default RegisterStep1