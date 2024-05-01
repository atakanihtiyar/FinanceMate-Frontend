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
                is_control_person: formData.alpaca.disclosures.is_control_person,
                is_affiliated_exchange_or_finra: formData.alpaca.disclosures.is_affiliated_exchange_or_finra,
                is_politically_exposed: formData.alpaca.disclosures.is_politically_exposed,
                immediate_family_exposed: formData.alpaca.disclosures.immediate_family_exposed,
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
        <Card className="tw-w-[400px] tw-min-h-[500px] tw-drop-shadow-[0_0_32px_rgba(238,238,238,0.1)]">
            <CardContent className="tw-w-full tw-mt-12">
                <Form {...form}>
                    <form className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4">
                        {/* DISCLOSURES */}
                        <FormField
                            control={form.control}
                            name="disclosures"
                            render={() => (
                                <FormItem>
                                    <div className="tw-mb-0">
                                        <FormLabel>Disclosures</FormLabel>
                                    </div>
                                    <div>
                                        {/* IS CONTROL PERSON */}
                                        <FormField
                                            control={form.control}
                                            name="disclosures.is_control_person"
                                            render={({ field }) => (
                                                <FormItem className="tw-w-full tw-flex tw-flex-row tw-justify-start tw-items-center tw-space-x-2 !tw-space-y-0 tw-my-1 tw-py-1">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="tw-space-y-1 tw-leading-none">
                                                        <FormLabel className="tw-font-normal tw-text-center tw-align-middle">
                                                            Do you hold a significant leadership role in a publicly traded company?
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        {/* IS AFFILLIATED EXCHANGE OR FINRA */}
                                        <FormField
                                            control={form.control}
                                            name="disclosures.is_affiliated_exchange_or_finra"
                                            render={({ field }) => (
                                                <FormItem className="tw-w-full tw-flex tw-flex-row tw-justify-start tw-items-center tw-space-x-2 !tw-space-y-0 tw-my-1 tw-py-1">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="tw-space-y-1 tw-leading-none">
                                                        <FormLabel className="tw-font-normal tw-text-center tw-align-middle">
                                                            Are you affiliated with a stock exchange or FINRA?
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        {/* IS POLITICALLY EXPOSED */}
                                        <FormField
                                            control={form.control}
                                            name="disclosures.is_politically_exposed"
                                            render={({ field }) => (
                                                <FormItem className="tw-w-full tw-flex tw-flex-row tw-justify-start tw-items-center tw-space-x-2 !tw-space-y-0 tw-my-1 tw-py-1">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="tw-space-y-1 tw-leading-none">
                                                        <FormLabel className="tw-font-normal tw-text-center tw-align-middle">
                                                            Are you a politically exposed person (PEP)
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        {/* IS POLITICALLY EXPOSED */}
                                        <FormField
                                            control={form.control}
                                            name="disclosures.immediate_family_exposed"
                                            render={({ field }) => (
                                                <FormItem className="tw-w-full tw-flex tw-flex-row tw-justify-start tw-items-center tw-space-x-2 !tw-space-y-0 tw-my-1 tw-py-1">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="tw-space-y-1 tw-leading-none">
                                                        <FormLabel className="tw-font-normal tw-text-center tw-align-middle">
                                                            Is any of your immediate family a PEP or hold a significant leadership role in a publicly traded company?
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
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
                                    <div className="tw-mb-0">
                                        <FormLabel>Agreements*</FormLabel>
                                    </div>
                                    <div>
                                        {/* ACCOUNT AGREEMENT */}
                                        <FormField
                                            control={form.control}
                                            name="agreements.is_read_and_agree_account_agreement"
                                            render={({ field }) => (
                                                <FormItem className="tw-w-full tw-flex tw-flex-row tw-justify-start tw-items-center tw-space-x-2 !tw-space-y-0 tw-my-1 tw-py-1">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="tw-space-y-1 tw-leading-none">
                                                        <FormLabel className="tw-font-normal tw-text-center tw-align-middle">
                                                            Account Agreement
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        {/* CUSTOMER AGREEMENT */}
                                        <FormField
                                            control={form.control}
                                            name="agreements.is_read_and_agree_customer_agreement"
                                            render={({ field }) => (
                                                <FormItem className="tw-w-full tw-flex tw-flex-row tw-justify-start tw-items-center tw-space-x-2 !tw-space-y-0 tw-my-1 tw-py-1">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="tw-space-y-1 tw-leading-none">
                                                        <FormLabel className="tw-font-normal tw-text-center tw-align-middle">
                                                            Customer Agreement
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        {/* MARGIN AGREEMENT */}
                                        <FormField
                                            control={form.control}
                                            name="agreements.is_read_and_agree_margin_agreement"
                                            render={({ field }) => (
                                                <FormItem className="tw-w-full tw-flex tw-flex-row tw-justify-start tw-items-center tw-space-x-2 !tw-space-y-0 tw-my-1 tw-py-1">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="tw-space-y-1 tw-leading-none">
                                                        <FormLabel className="tw-font-normal tw-text-center tw-align-middle">
                                                            Margin Agreement
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
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

export default RegisterStep4