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
        <Card className="w-[400px] min-h-[250px] drop-shadow-[0_0_32px_rgba(238,238,238,0.1)]">
            <CardHeader className="w-full text-center mt-4 mb-2">
                <CardTitle className="tracking-tight font-thin text-5xl p-0">Push the button and join us</CardTitle>
            </CardHeader>
            <CardContent className="w-full min-h-max flex flex-col justify-center items-center p-0">
                <Separator className="w-[85%]" />
            </CardContent>
            <CardContent className="w-full mt-0">
                <Form {...form}>
                    <form className="flex flex-col justify-center items-center gap-2">
                        <div className="flex justify-between mb-4 mt-4 w-[80%]">
                            <Button type="button" variant={"outline"} className="font-semibold" onClick={handleGoPre} size="sm">Back</Button>
                            <Button type="submit" className="font-semibold" onClick={form.handleSubmit(handleSubmit)} size="sm">Register</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default RegisterStepLast