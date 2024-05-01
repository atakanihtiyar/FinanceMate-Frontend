
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

    const goToStep = (step: number) => {
        if (minStep <= step && step <= maxStep)
            setActiveStep(step)
    }

    const onSubmit = () => {
        register()
    }

    const generateTabTriggerClassName = (currStep: number) => {
        return `!tw-bg-transparent tw-text-muted
        ${currStep === activeStep && "!tw-text-primary-light"}
        ${currStep > activeStep && "tw-pointer-events-none tw-text-foreground"}`
    }

    return (
        <Tabs defaultValue={"1"} value={activeStep.toString()}>
            <TabsList className="tw-w-[400px] tw-h-[40px] !tw-bg-[--background] tw-border-[1px] tw-border-[--muted] tw-border-solid">
                <TabsTrigger value="1" onClick={() => goToStep(1)} className={generateTabTriggerClassName(1)}>Base</TabsTrigger>
                <TabsTrigger value="2" onClick={() => goToStep(2)} className={generateTabTriggerClassName(2)}>Identity</TabsTrigger>
                <TabsTrigger value="3" onClick={() => goToStep(3)} className={generateTabTriggerClassName(3)}>Contact</TabsTrigger>
                <TabsTrigger value="4" onClick={() => goToStep(4)} className={generateTabTriggerClassName(4)}>Disclosures</TabsTrigger>
                <TabsTrigger value="5" onClick={() => goToStep(5)} className={generateTabTriggerClassName(5)}>Overview</TabsTrigger>
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