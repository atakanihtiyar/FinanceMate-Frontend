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
        <Card className="w-[360px] min-h-[250px] border-0 sm:border-2 sm:w-[400px]">
            <CardHeader className="text-center">
                <CardTitle className="font-thin text-5xl">Push the button and join us</CardTitle>
            </CardHeader>
            <CardContent>
                <Separator />
            </CardContent>
            <CardContent>
                <Form {...form}>
                    <form className="flex flex-col justify-center items-center gap-2">
                        <div className="w-[80%] flex justify-between mb-4 mt-4">
                            <Button type="button" variant="link" className="w-20" onClick={handleGoPre}>Back</Button>
                            <Button type="submit" variant="default" className="w-20" onClick={form.handleSubmit(handleSubmit)}>Register</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default RegisterStepLast