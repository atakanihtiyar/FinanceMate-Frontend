
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RegisterStep1 from "./RegisterStep1"
import RegisterStep2 from "./RegisterStep2"
import { useContext, useState } from "react"
import { Button } from "@/components/ui/button"
import { RegisterDataContext } from "./RegisterPage"

export const RegisterSteps = () => {
    const [activeStep, setActiveStep] = useState(1)
    const minStep = 1
    const maxStep = 2

    const goPreStep = () => {
        setActiveStep(oldStep => oldStep === minStep ? oldStep : --oldStep)
    }

    const goNextStep = () => {
        setActiveStep(oldStep => oldStep === maxStep ? oldStep : ++oldStep)
    }

    const goToStep = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, step: number) => {
        if (e.currentTarget.classList.contains("disabled") && minStep <= step && step >= maxStep)
            setActiveStep(oldStep => oldStep === maxStep ? oldStep : ++oldStep)
    }

    return (

        <Tabs defaultValue={"1"} value={activeStep.toString()} className="w-[400px]">
            <TabsList>
                <TabsTrigger value="1" onClick={(e) => goToStep(e, 1)}>Base</TabsTrigger>
                <TabsTrigger value="2" onClick={(e) => goToStep(e, 1)} className={`${activeStep < 2 && "disabled"}`}>Identity</TabsTrigger>
            </TabsList>
            <TabsContent value="1">
                <RegisterStep1 goNextStep={goNextStep} />
            </TabsContent>
            <TabsContent value="2">
                <RegisterStep2 goPreStep={goPreStep} goNextStep={goNextStep} />
            </TabsContent>
            <TabsContent value="3">
                {
                    activeStep === maxStep &&
                    <Button onClick={() => console.log("formData")}>Register</Button>
                }
            </TabsContent>
        </Tabs>
    )
}