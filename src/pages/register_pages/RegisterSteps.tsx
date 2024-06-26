
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RegisterStep1 from "./RegisterStep1"
import RegisterStep2 from "./RegisterStep2"
import { useContext, useState } from "react"
import { RegisterDataContext } from "./RegisterPage"
import RegisterStep3 from "./RegisterStep3"
import RegisterStepLast from "./RegisterStepLast"
import RegisterStep4 from "./RegisterStep4"

export const RegisterSteps = () => {
    const { register } = useContext(RegisterDataContext)
    const [activeStep, setActiveStep] = useState(1)
    const minStep = 1
    const maxStep = 5

    const goPreStep = () => {
        setActiveStep(oldStep => oldStep === minStep ? oldStep : --oldStep)
    }

    const goNextStep = () => {
        setActiveStep(oldStep => oldStep === maxStep ? oldStep : ++oldStep)
    }

    const onSubmit = () => {
        register()
    }

    return (
        <Tabs defaultValue={"1"} value={activeStep.toString()}>
            <TabsList className="w-[400px] h-[40px]">
                <TabsTrigger value="1" className="pointer-events-none">Base</TabsTrigger>
                <TabsTrigger value="2" className="pointer-events-none">Identity</TabsTrigger>
                <TabsTrigger value="3" className="pointer-events-none">Contact</TabsTrigger>
                <TabsTrigger value="4" className="pointer-events-none">Disclosures</TabsTrigger>
                <TabsTrigger value="5" className="pointer-events-none">Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="1">
                <RegisterStep1 goNextStep={goNextStep} />
            </TabsContent>
            <TabsContent value="2">
                <RegisterStep2 goPreStep={goPreStep} goNextStep={goNextStep} />
            </TabsContent>
            <TabsContent value="3">
                <RegisterStep3 goPreStep={goPreStep} goNextStep={goNextStep} />
            </TabsContent>
            <TabsContent value="4">
                <RegisterStep4 goPreStep={goPreStep} goNextStep={goNextStep} />
            </TabsContent>
            <TabsContent value="5">
                <RegisterStepLast goPreStep={goPreStep} onSubmit={onSubmit} />
            </TabsContent>
        </Tabs>
    )
}