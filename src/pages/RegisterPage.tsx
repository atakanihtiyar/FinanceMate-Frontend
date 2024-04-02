import { Heading } from "@/components/ui/text"
import { Navbar, Footer } from "@/components/parts/navigationMenus"
import { FormWrapper, IFormInputProps } from "@/components/utils/formUtils"
import { z as zod } from "zod"

const inputList: IFormInputProps[] = [
    {
        validation: zod.string().email(),
        type: "email",
        label: "Email",
        fieldName: "email",
        placeholder: "",
        description: "",
    },
    {
        validation: zod.string().min(3).max(12),
        type: "password",
        label: "Password",
        fieldName: "password",
        placeholder: "",
        description: "",
    }
]

const RegisterPage = () => {
    return (
        <>
            <Navbar />
            <div className='tw-min-w-full tw-min-h-screen tw-flex tw-flex-col tw-justify-center tw-items-center tw-flex-nowrap tw-gap-8 lg:tw-flex-row xl:tw-gap-24'>
                <Heading variant="h1" size="_6xl" className="tw-font-thin tw-m-8 tw-mt-32">Welcome Mate!</Heading>
                <FormWrapper fields={inputList} onSubmit={(data) => console.log(data)}
                    direction="col" justify="center" alignItems="center"
                    formCN="tw-rounded-xl tw-bg-[--mate-white] tw-min-w-[360px] tw-min-h-[440px]"
                    fieldCN="tw-w-[66%] tw-text-[--mate-dark-black] tw-border-[--mate-dark-black]"
                    submitBtnText="Register"
                />
            </div>
            <Footer />
        </>
    )
}

export default RegisterPage