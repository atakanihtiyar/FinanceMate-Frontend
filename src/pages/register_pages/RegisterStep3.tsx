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
    Card,
    CardContent
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useContext } from "react"
import { RegisterDataContext } from "./RegisterPage"

interface Props {
    goPreStep: () => void,
    goNextStep: () => void
}

const RegisterStep3 = ({ goPreStep, goNextStep }: Props) => {
    const { formData, setRegisterData } = useContext(RegisterDataContext)

    const formSchema = z.object({
        street_address: z.string().min(3),
        unit: z.string(),
        city: z.string(),
        state: z.string(), // picked usa as country of tax residence
        postal_code: z.string(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            street_address: formData.alpaca.contact.street_address[0] ? formData.alpaca.contact.street_address[0] : "",
            unit: formData.alpaca.contact.unit,
            city: formData.alpaca.contact.city,
            state: "",
            postal_code: formData.alpaca.contact.postal_code,
        },

    })

    const handleGoNext = (values: z.infer<typeof formSchema>) => {
        setRegisterData({
            street_address: [values.street_address],
            unit: values.unit,
            city: values.city,
            state: values.state,
            postal_code: values.postal_code
        })
        goNextStep()
    }

    const handleGoPre = () => {
        setRegisterData({
            street_address: [form.getValues("street_address")],
            unit: form.getValues("unit"),
            city: form.getValues("city"),
            state: form.getValues("state"),
            postal_code: form.getValues("postal_code")
        })
        goPreStep()
    }

    return (
        <Card className="tw-w-[400px] tw-min-h-[500px] tw-drop-shadow-[0_0_32px_rgba(238,238,238,0.1)]">
            <CardContent className="tw-w-full tw-mt-12">
                <Form {...form}>
                    <form className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4">
                        {/* STREET ADDRESS */}
                        <FormField
                            control={form.control}
                            name="street_address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Street Address</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* CITY */}
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* STATE */}
                        {
                            formData.alpaca.identity.country_of_tax_residence === "USA" &&
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input type="string" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        }
                        {/* UNIT */}
                        <FormField
                            control={form.control}
                            name="unit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unit</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* POSTAL CODE */}
                        <FormField
                            control={form.control}
                            name="postal_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="tw-flex tw-justify-between tw-mb-4 tw-mt-4 tw-w-[80%]">
                            <Button type="button" variant={"outline"} className="tw-font-semibold" onClick={handleGoPre} size="sm">Back</Button>
                            <Button type="submit" className="tw-font-semibold" onClick={form.handleSubmit(handleGoNext)} size="sm">Next</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default RegisterStep3