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
import { Checkbox } from "@/components/ui/checkbox"

const funding_sources = [
    {
        id: "employment_income",
        label: "Employment Income",
    },
    {
        id: "investments",
        label: "Investments",
    },
    {
        id: "inheritance",
        label: "Inheritance",
    },
    {
        id: "business_income",
        label: "Business Income",
    },
    {
        id: "savings",
        label: "Savings",
    },
    {
        id: "family",
        label: "Family",
    },
]

interface Props {
    goPreStep: () => void,
    goNextStep: () => void
}

const RegisterStep2 = ({ goPreStep, goNextStep }: Props) => {
    const { formData, setRegisterData } = useContext(RegisterDataContext)

    const legalMaxDateOfBirth = new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    const legalMinDateOfBirth = new Date("1900-01-01")
    const formSchema = z.object({
        date_of_birth: z.date().min(legalMinDateOfBirth).max(legalMaxDateOfBirth),
        tax_id: formData.identity.country_of_tax_residence === "USA" ?
            z.string().trim().length(11)
                .regex(/(?!(^(000|666)-|.*-00-.*|-0000$)|^(0{3}-0{2}-0{4}|1{3}-1{2}-1{4}|2{3}-2{2}-2{4}|3{3}-3{2}-3{4}|4{3}-4{2}-4{4}|5{3}-5{2}-5{4}|6{3}-6{2}-6{4}|7{3}-7{2}-7{4}|8{3}-8{2}-8{4}|9{3}-9{2}-9{4}|123-45-6789|987-65-4321)$)^\d{3}-\d{2}-\d{4}$/) :
            // other validation is not proper for all rules
            z.string().trim().min(2).max(40)
                .regex(/(?!^(0{3}-0{2}-0{4}|1{3}-1{2}-1{4}|2{3}-2{2}-2{4}|3{3}-3{2}-3{4}|4{3}-4{2}-4{4}|5{3}-5{2}-5{4}|6{3}-6{2}-6{4}|7{3}-7{2}-7{4}|8{3}-8{2}-8{4}|9{3}-9{2}-9{4}|123-45-6789|987-65-4321)$)^([a-zA-Z0-9\+-\.])+$/)
                .refine(item => { // is numbers more than letters or symbols
                    if (!item || typeof item !== "string") return false
                    let letters: RegExpMatchArray | string = (item as String).match(/[a-zA-Z\.\+-]/g) ?? ""
                    let numbers: RegExpMatchArray | string = (item as String).match(/[0-9]/g) ?? ""
                    if (numbers.length <= letters.length) return false
                    return true
                }),
        funding_source: z.array(z.string()).refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date_of_birth: formData.identity.date_of_birth ? new Date(formData.identity.date_of_birth) : undefined,
            tax_id: formData.identity.tax_id,
            funding_source: formData.identity.funding_source
        },

    })

    const handleGoNext = (values: z.infer<typeof formSchema>) => {
        const date_of_birth = new Date(values.date_of_birth.getTime() - (values.date_of_birth.getTimezoneOffset() * 60 * 1000)).toISOString().split("T")[0]
        setRegisterData({
            date_of_birth: date_of_birth,
            tax_id: values.tax_id,
            funding_source: values.funding_source
        })
        goNextStep()
    }

    const handleGoPre = () => {
        let date_of_birth = form.getValues("date_of_birth")?.toISOString().split("T")[0]
        date_of_birth = date_of_birth ? date_of_birth : ""
        setRegisterData({
            date_of_birth: date_of_birth,
            tax_id: form.getValues("tax_id"),
            funding_source: form.getValues("funding_source")
        })
        goPreStep()
    }

    return (
        <Card className="w-[400px] min-h-[250px]">
            <CardHeader>
                <Form {...form}>
                    <form className="flex flex-col justify-center items-center gap-2">
                        {/* DATE OF BIRTH */}
                        <FormField
                            control={form.control}
                            name="date_of_birth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full text-left"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-4" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > legalMaxDateOfBirth || date < legalMinDateOfBirth
                                                }
                                                fromDate={legalMinDateOfBirth}
                                                toDate={legalMaxDateOfBirth}
                                                captionLayout="dropdown"
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
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
                        {/* FUNDING SOURCES */}
                        <FormField
                            control={form.control}
                            name="funding_source"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Funding Source</FormLabel>
                                    {funding_sources.map((item) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="funding_source"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={item.id}
                                                        className="w-full flex flex-row justify-start items-center space-x-1 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(item.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, item.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== item.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel>
                                                            {item.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-[80%] flex justify-between mr-4 mt-4">
                            <Button type="button" variant="link" className="w-20" onClick={handleGoPre}>Back</Button>
                            <Button type="submit" className="w-20" onClick={form.handleSubmit(handleGoNext)}>Next</Button>
                        </div>
                    </form>
                </Form>
            </CardHeader>
        </Card>
    )
}

export default RegisterStep2