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
    CardHeader
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { useContext } from "react"
import { RegisterDataContext } from "./RegisterPage"
import { Checkbox } from "@/components/ui/checkbox"

interface Props {
    goPreStep: () => void,
    goNextStep: () => void
}

const RegisterStep4 = ({ goPreStep, goNextStep }: Props) => {
    const { formData, setRegisterData } = useContext(RegisterDataContext)

    const formSchema = z.object({
        disclosures: z.object({
            is_control_person: z.boolean(),
            is_affiliated_exchange_or_finra: z.boolean(),
            is_politically_exposed: z.boolean(),
            immediate_family_exposed: z.boolean(),
        }),
        agreements: z.object({
            is_read_and_agree_account_agreement: z.boolean().refine(item => item === true),
            is_read_and_agree_customer_agreement: z.boolean().refine(item => item === true),
            is_read_and_agree_margin_agreement: z.boolean().refine(item => item === true),
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            disclosures: {
                is_control_person: formData.disclosures.is_control_person,
                is_affiliated_exchange_or_finra: formData.disclosures.is_affiliated_exchange_or_finra,
                is_politically_exposed: formData.disclosures.is_politically_exposed,
                immediate_family_exposed: formData.disclosures.immediate_family_exposed,
            },
            agreements: {
                is_read_and_agree_account_agreement: false,
                is_read_and_agree_customer_agreement: false,
                is_read_and_agree_margin_agreement: false,
            }
        }
    })

    const handleGoNext = (values: z.infer<typeof formSchema>) => {
        setRegisterData({
            is_control_person: values.disclosures.is_control_person,
            is_affiliated_exchange_or_finra: values.disclosures.is_affiliated_exchange_or_finra,
            is_politically_exposed: values.disclosures.is_politically_exposed,
            immediate_family_exposed: values.disclosures.immediate_family_exposed,
            is_read_and_agree_account_agreement: values.agreements.is_read_and_agree_account_agreement,
            is_read_and_agree_customer_agreement: values.agreements.is_read_and_agree_customer_agreement,
            is_read_and_agree_margin_agreement: values.agreements.is_read_and_agree_margin_agreement,
        })
        goNextStep()
    }

    const handleGoPre = () => {
        setRegisterData({
            is_control_person: form.getValues("disclosures.is_control_person"),
            is_affiliated_exchange_or_finra: form.getValues("disclosures.is_affiliated_exchange_or_finra"),
            is_politically_exposed: form.getValues("disclosures.is_politically_exposed"),
            immediate_family_exposed: form.getValues("disclosures.immediate_family_exposed")
        })
        goPreStep()
    }

    return (
        <Card className="w-[400px] min-h-[250px]">
            <CardHeader>
                <Form {...form}>
                    <form className="flex flex-col justify-center items-center gap-2">
                        {/* DISCLOSURES */}
                        <FormField
                            control={form.control}
                            name="disclosures"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Disclosures</FormLabel>{/* IS CONTROL PERSON */}
                                    <FormField
                                        control={form.control}
                                        name="disclosures.is_control_person"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex flex-row justify-start items-center space-x-1 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel>
                                                    Do you hold a significant leadership role in a publicly traded company?
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    {/* IS AFFILLIATED EXCHANGE OR FINRA */}
                                    <FormField
                                        control={form.control}
                                        name="disclosures.is_affiliated_exchange_or_finra"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex flex-row justify-start items-center space-x-1 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel>
                                                    Are you affiliated with a stock exchange or FINRA?
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    {/* IS POLITICALLY EXPOSED */}
                                    <FormField
                                        control={form.control}
                                        name="disclosures.is_politically_exposed"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex flex-row justify-start items-center space-x-1 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel>
                                                    Are you a politically exposed person (PEP)
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    {/* IS POLITICALLY EXPOSED */}
                                    <FormField
                                        control={form.control}
                                        name="disclosures.immediate_family_exposed"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex flex-row justify-start items-center space-x-1 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel>
                                                    Is any of your immediate family a PEP or hold a significant leadership role in a publicly traded company?
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* AGREEMENTS */}
                        <FormField
                            control={form.control}
                            name="agreements"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Agreements*</FormLabel>
                                    {/* ACCOUNT AGREEMENT */}
                                    <FormField
                                        control={form.control}
                                        name="agreements.is_read_and_agree_account_agreement"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex flex-row justify-start items-center space-x-1 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel>
                                                    Account Agreement
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    {/* CUSTOMER AGREEMENT */}
                                    <FormField
                                        control={form.control}
                                        name="agreements.is_read_and_agree_customer_agreement"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex flex-row justify-start items-center space-x-1 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel>
                                                    Customer Agreement
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    {/* MARGIN AGREEMENT */}
                                    <FormField
                                        control={form.control}
                                        name="agreements.is_read_and_agree_margin_agreement"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex flex-row justify-start items-center space-x-1 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel>
                                                    Margin Agreement
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </FormItem>
                            )}
                        />
                        <div className="w-[80%] flex justify-between mb-4 mt-4">
                            <Button type="button" variant="link" className="w-20" onClick={handleGoPre}>Back</Button>
                            <Button type="submit" className="w-20" onClick={form.handleSubmit(handleGoNext)}>Next</Button>
                        </div>
                    </form>
                </Form>
            </CardHeader>
        </Card>
    )
}

export default RegisterStep4