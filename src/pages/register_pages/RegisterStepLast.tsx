import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"

interface Props {
    goPreStep: () => void,
    onSubmit: () => void,
}

const RegisterStepLast = ({ onSubmit, goPreStep }: Props) => {
    const form = useForm()

    const handleGoPre = () => {
        goPreStep()
    }

    const handleSubmit = () => {
        onSubmit()
    }

    return (
        <Card className="tw-w-[400px] tw-min-h-[250px] tw-drop-shadow-[0_0_32px_rgba(238,238,238,0.1)]">
            <CardHeader className="tw-w-full tw-text-center tw-mt-4 tw-mb-2">
                <CardTitle className="tw-tracking-tight tw-font-thin tw-text-5xl tw-p-0">Push the button and join us</CardTitle>
            </CardHeader>
            <CardContent className="tw-w-full tw-min-h-max tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-0">
                <Separator className="tw-w-[85%]" />
            </CardContent>
            <CardContent className="tw-w-full tw-mt-0">
                <Form {...form}>
                    <form className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-2">
                        <div className="tw-flex tw-justify-between tw-mb-4 tw-mt-4 tw-w-[80%]">
                            <Button type="button" variant={"outline"} className="tw-font-semibold" onClick={handleGoPre} size="sm">Back</Button>
                            <Button type="submit" className="tw-font-semibold" onClick={form.handleSubmit(handleSubmit)} size="sm">Register</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default RegisterStepLast