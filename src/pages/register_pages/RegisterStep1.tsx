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
        given_name: z.string().min(3).max(15),
        family_name: z.string().min(3).max(15),
        calling_code: z.string(), // "+15555555555"
        phone_number: z.string(), // "+15555555555"
        email_address: z.string().email(),
        password: z.string().min(3).max(12),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            given_name: formData.given_name,
            family_name: formData.family_name,
            calling_code: formData.calling_code,
            phone_number: formData.phone_number,
            email_address: formData.email_address,
            password: "",
        },

    })

    const handleGoNext = (values: z.infer<typeof formSchema>) => {
        setRegisterData({
            given_name: values.given_name,
            family_name: values.family_name,
            calling_code: values.calling_code,
            phone_number: values.phone_number,
            email_address: values.email_address,
            password: values.password,
        })
        goNextStep()
    }

    return (
        <Card className="tw-w-[400px] tw-min-h-[500px] tw-drop-shadow-[0_0_32px_rgba(238,238,238,0.1)]">
            <CardHeader className="tw-w-full tw-text-center tw-mt-4 tw-mb-2">
                <CardTitle className="tw-tracking-tight tw-font-thin tw-text-5xl tw-p-0">Welcome Mate!</CardTitle>
                <CardDescription className="tw-tracking-wide tw-font-thin tw-text-lg tw-p-0">Start the journey with us today.</CardDescription>
            </CardHeader>
            <CardContent className="tw-w-full tw-min-h-max tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-0">
                <Separator className="tw-w-[85%]" />
            </CardContent>
            <CardContent className="tw-w-full tw-mt-4">
                <Form {...form}>
                    <form className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-2">
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
                        {/* PHONNE NUMBER */}
                        <div className="tw-w-[80%] tw-flex tw-flex-row w-space-y-2">
                            <FormField
                                control={form.control}
                                name="calling_code"
                                render={({ field }) => (
                                    <FormItem className="tw-mr-1">
                                        <FormLabel>Phone Number</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Country Code" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent >
                                                <SelectItem value={"1"}>{getEmojiFlag("US")} +{countries.US.phone}</SelectItem>
                                                <SelectItem value={"90"}>{getEmojiFlag("TR")} +{countries.TR.phone}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone_number"
                                render={({ field }) => (
                                    <FormItem className="tw-ml-1">
                                        <FormLabel><br /></FormLabel>
                                        <FormControl>
                                            <Input type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                        <div className="tw-flex tw-justify-end tw-mb-4 tw-mt-4 tw-w-[80%]">
                            <Button type="submit" className="tw-font-semibold" onClick={form.handleSubmit(handleGoNext)} size="sm">Next</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default RegisterStep1