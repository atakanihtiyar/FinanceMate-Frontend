import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { useContext } from "react"
import { RegisterDataContext } from "./RegisterPage"

import { countries } from 'countries-list'
import { getEmojiFlag } from 'countries-list'

const usaStates = [
    ["AA", "Armed Forces of the Americas"],
    ["AE", "Armed Forces of Europe"],
    ["AK", "Alaska"],
    ["AL", "Alabama"],
    ["AP", "Armed Forces of the Pacific"],
    ["AR", "Arkansas"],
    ["AZ", "Arizona"],
    ["CA", "California"],
    ["CO", "Colorado"],
    ["CT", "Connecticut"],
    ["DC", "District of Columbia"],
    ["DE", "Delaware"],
    ["FL", "Florida"],
    ["GA", "Georgia"],
    ["HI", "Hawaii"],
    ["IA", "Iowa"],
    ["ID", "Idaho"],
    ["IL", "Illinois"],
    ["IN", "Indiana"],
    ["KS", "Kansas"],
    ["KY", "Kentucky"],
    ["LA", "Louisiana"],
    ["MA", "Massachusetts"],
    ["MD", "Maryland"],
    ["ME", "Maine"],
    ["MI", "Michigan"],
    ["MN", "Minnesota"],
    ["MO", "Missouri"],
    ["MS", "Mississippi"],
    ["MT", "Montana"],
    ["NC", "North Carolina"],
    ["ND", "North Dakota"],
    ["NE", "Nebraska"],
    ["NH", "New Hampshire"],
    ["NJ", "New Jersey"],
    ["NM", "New Mexico"],
    ["NV", "Nevada"],
    ["NY", "New York"],
    ["OH", "Ohio"],
    ["OK", "Oklahoma"],
    ["OR", "Oregon"],
    ["PA", "Pennsylvania"],
    ["RI", "Rhode Island"],
    ["SC", "South Carolina"],
    ["SD", "South Dakota"],
    ["TN", "Tennessee"],
    ["TX", "Texas"],
    ["UT", "Utah"],
    ["VA", "Virginia"],
    ["VT", "Vermont"],
    ["WA", "Washington"],
    ["WI", "Wisconsin"],
    ["WV", "West Virginia"],
    ["WY", "Wyoming"]
]

interface Props {
    goPreStep: () => void,
    goNextStep: () => void
}

const RegisterStep3 = ({ goPreStep, goNextStep }: Props) => {
    const { formData, setRegisterData } = useContext(RegisterDataContext)

    const formSchema = z.object({
        calling_code: z.string().trim().min(1, "You have to select one item.").max(3, "You have to select one item.").regex(/^[0-9]+$/, "You have to select one item."),
        phone_number: z.string().trim().length(10).regex(/^[0-9]+$/),
        street_address: z.string().trim().min(1).max(60).regex(/^(?!^\d+$)^[ -~]+$/),
        unit: z.string().trim().min(1).max(10).regex(/^[ -~]+$/),
        city: z.string().trim().min(1).max(50).regex(/^(?!^\d+$)^[a-zA-Z0-9_ ]+$/),
        state: formData.identity.country_of_tax_residence === "USA" ?
            z.string().trim().length(2).regex(/^[a-zA-Z]{2}$/) :
            z.string().trim().max(50).regex(/^(?!^\d+$)^[a-zA-Z0-9_ ]*$/),
        postal_code: z.string().trim().min(5).max(10).regex(/^[0-9]{5}[ -~]{0,5}$/),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            calling_code: formData.contact.phone_number.length > 10 ? formData.contact.phone_number.slice(1, formData.contact.phone_number.length - 10) : "",
            phone_number: formData.contact.phone_number.length > 10 ? formData.contact.phone_number.slice(-10) : "",
            street_address: formData.contact.street_address[0] ? formData.contact.street_address[0] : "",
            unit: formData.contact.unit,
            city: formData.contact.city,
            state: formData.contact.state,
            postal_code: formData.contact.postal_code,
        },

    })

    const handleGoNext = (values: z.infer<typeof formSchema>) => {
        setRegisterData({
            phone_number: `+${values.calling_code}${values.phone_number}`,
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
            phone_number: `+${form.getValues("calling_code")}${form.getValues("phone_number")}`,
            street_address: [form.getValues("street_address")],
            unit: form.getValues("unit"),
            city: form.getValues("city"),
            state: form.getValues("state"),
            postal_code: form.getValues("postal_code")
        })
        goPreStep()
    }

    return (
        <Card className="w-[360px] min-h-[250px] border-0 sm:border-2 sm:w-[400px]">
            <CardHeader>
                <Form {...form}>
                    <form className="flex flex-col justify-center items-center gap-2">
                        {/* PHONNE NUMBER */}
                        <div className="w-[80%] flex flex-row w-space-y-2 w-space-x-2">
                            <FormField
                                control={form.control}
                                name="calling_code"
                                render={({ field }) => (
                                    <FormItem>
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
                                    <FormItem className="ml-1">
                                        <FormLabel><br /></FormLabel>
                                        <FormControl>
                                            <Input type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                            formData.identity.country_of_tax_residence === "USA" ?
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem className="mr-1">
                                            <FormLabel>State</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="State" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent >
                                                    {
                                                        usaStates.map(item => {
                                                            let abbreviation = item[0]
                                                            let name = item[1]
                                                            return (
                                                                <SelectItem key={abbreviation} value={abbreviation}>{abbreviation} - {name}</SelectItem>
                                                            )
                                                        })
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> :
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

export default RegisterStep3