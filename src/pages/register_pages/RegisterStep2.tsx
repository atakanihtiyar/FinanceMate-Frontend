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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "lucide-react"
import { useContext } from "react"
import { RegisterDataContext } from "./RegisterPage"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

import { countries } from 'countries-list'
import { getEmojiFlag } from 'countries-list'

interface Props {
    goPreStep: () => void,
    goNextStep: () => void
}

const RegisterStep2 = ({ goPreStep, goNextStep }: Props) => {
    const { formData, setRegisterData } = useContext(RegisterDataContext)

    const formSchema = z.object({
        date_of_birth: z.date(),
        country_of_tax_residence: z.string().length(3, "You should pick one"),
        tax_id: z.string(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date_of_birth: new Date(formData.alpaca.identity.date_of_birth),
            country_of_tax_residence: formData.alpaca.identity.country_of_tax_residence,
            tax_id: formData.alpaca.identity.tax_id
        },

    })

    const handleGoNext = (values: z.infer<typeof formSchema>) => {
        setRegisterData({
            date_of_birth: values.date_of_birth.toISOString().split("T")[0],
            country_of_tax_residence: values.country_of_tax_residence,
            tax_id: values.tax_id
        })
        goNextStep()
    }

    const handleGoPre = () => {
        setRegisterData({
            date_of_birth: form.getValues("date_of_birth").toISOString().split("T")[0],
            country_of_tax_residence: form.getValues("country_of_tax_residence"),
            tax_id: form.getValues("tax_id"),
        })
        goPreStep()
    }

    return (
        <Card className="tw-w-[400px] tw-min-h-[500px] tw-drop-shadow-[0_0_32px_rgba(238,238,238,0.1)]">
            <CardContent className="tw-w-full tw-mt-12">
                <Form {...form}>
                    <form className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-2">
                        {/* DATE OF BIRTH */}
                        <FormField
                            control={form.control}
                            name="date_of_birth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "tw-w-full tw-pl-3 tw-text-left tw-font-normal !tw-mx-0",
                                                            !field.value && "tw-text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="tw-ml-auto tw-h-4 tw-w-4 tw-opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="tw-w-auto tw-p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
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
                        {/* Tax Id */}
                        <FormField
                            control={form.control}
                            name="tax_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tax Id</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="tw-flex tw-justify-between tw-mb-4 tw-mt-4 tw-w-[80%]">
                            <Button type="button" className="tw-font-semibold" onClick={handleGoPre} size="sm">Back</Button>
                            <Button type="submit" className="tw-font-semibold" onClick={form.handleSubmit(handleGoNext)} size="sm">Next</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default RegisterStep2