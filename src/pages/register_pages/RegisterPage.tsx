import { RegisterSteps } from "./RegisterSteps"
import { createContext, useState } from "react"

interface FormDataType {
    password: string,
    calling_code: string,
    phone_number: string,
    identity: {
        given_name: string,
        family_name: string,
        date_of_birth: string,
        country_of_tax_residence: string,
        tax_id_type: string,
        tax_id: string,
        funding_source: string[]
    },
    contact: {
        email_address: string,
        street_address: string[],
        unit: string,
        city: string,
        state: string,
        postal_code: string
    },
    disclosures: {
        is_control_person: boolean,
        is_affiliated_exchange_or_finra: boolean,
        is_politically_exposed: boolean,
        immediate_family_exposed: boolean
    },
    agreements: {
        agreement: "account_agreement" | "customer_agreement" | "margin_agreement",
        signed_at: string
    }[]
}

const DefaultFormData: FormDataType = {
    calling_code: "",
    phone_number: "",
    password: "",
    identity: {
        given_name: "",
        family_name: "",
        date_of_birth: "",
        country_of_tax_residence: "",
        tax_id_type: "",
        tax_id: "",
        funding_source: [],
    },
    contact: {
        email_address: "",
        street_address: [],
        unit: "",
        city: "",
        state: "",
        postal_code: ""
    },
    disclosures: {
        is_control_person: false,
        is_affiliated_exchange_or_finra: false,
        is_politically_exposed: false,
        immediate_family_exposed: false
    },
    agreements: []
}

interface setRegisterDataProps {
    email_address?: string,
    password?: string,
    given_name?: string,
    family_name?: string,
    calling_code?: string,
    phone_number?: string,
    country_of_tax_residence?: string,
    date_of_birth?: string,
    tax_id_type?: string,
    tax_id?: string,
    funding_source?: string[],
    street_address?: string[],
    unit?: string,
    city?: string,
    state?: string,
    postal_code?: string,
    is_control_person?: boolean,
    is_affiliated_exchange_or_finra?: boolean,
    is_politically_exposed?: boolean,
    immediate_family_exposed?: boolean,
    is_read_and_agree_account_agreement?: boolean,
    is_read_and_agree_customer_agreement?: boolean,
    is_read_and_agree_margin_agreement?: boolean,
}

const FormContent = {
    formData: DefaultFormData,
    setRegisterData: (_data: setRegisterDataProps) => { },
    register: () => { }
}

const RegisterDataContext = createContext<typeof FormContent>(FormContent)

const RegisterPage = () => {
    const [formData, setFormData] = useState<FormDataType>(DefaultFormData)

    const setRegisterData = ({ email_address, password, given_name, family_name, calling_code, phone_number, country_of_tax_residence,
        date_of_birth, tax_id_type, tax_id, funding_source, street_address, unit, city, state, postal_code,
        is_control_person, is_affiliated_exchange_or_finra, is_politically_exposed, immediate_family_exposed,
        is_read_and_agree_account_agreement, is_read_and_agree_customer_agreement, is_read_and_agree_margin_agreement
    }: setRegisterDataProps) => {
        setFormData(oldData => {
            const newData: FormDataType = {
                ...oldData,
                password: password ? password : oldData.password,
                calling_code: calling_code ? calling_code : oldData.calling_code,
                phone_number: phone_number ? phone_number : oldData.phone_number,
                identity: {
                    ...oldData.identity,
                    date_of_birth: date_of_birth ? date_of_birth : oldData.identity.date_of_birth,
                    tax_id_type: tax_id_type ? tax_id_type : oldData.identity.tax_id_type,
                    tax_id: tax_id ? tax_id : oldData.identity.tax_id,
                    funding_source: funding_source ? funding_source : oldData.identity.funding_source,
                    given_name: given_name ? given_name : oldData.identity.given_name,
                    family_name: family_name ? family_name : oldData.identity.family_name,
                    country_of_tax_residence: country_of_tax_residence ? country_of_tax_residence : oldData.identity.country_of_tax_residence,
                },
                contact: {
                    ...oldData.contact,
                    email_address: email_address ? email_address : oldData.contact.email_address,
                    street_address: street_address ? street_address : oldData.contact.street_address,
                    unit: unit ? unit : oldData.contact.unit,
                    city: city ? city : oldData.contact.city,
                    state: state ? state : oldData.contact.state,
                    postal_code: postal_code ? postal_code : oldData.contact.postal_code,
                },
                disclosures: {
                    ...oldData.disclosures,
                    is_control_person: is_control_person !== undefined ? is_control_person : oldData.disclosures.is_control_person,
                    is_affiliated_exchange_or_finra: is_affiliated_exchange_or_finra !== undefined ? is_affiliated_exchange_or_finra : oldData.disclosures.is_affiliated_exchange_or_finra,
                    is_politically_exposed: is_politically_exposed !== undefined ? is_politically_exposed : oldData.disclosures.is_politically_exposed,
                    immediate_family_exposed: immediate_family_exposed !== undefined ? immediate_family_exposed : oldData.disclosures.immediate_family_exposed,
                }
            }
            newData.agreements = []
            if (is_read_and_agree_account_agreement) {
                newData.agreements.push({
                    agreement: "account_agreement",
                    signed_at: new Date().toISOString().split(".")[0] + "Z"
                })
            }
            if (is_read_and_agree_customer_agreement) {
                newData.agreements.push({
                    agreement: "customer_agreement",
                    signed_at: new Date().toISOString().split(".")[0] + "Z"
                })
            }
            if (is_read_and_agree_margin_agreement) {
                newData.agreements.push({
                    agreement: "margin_agreement",
                    signed_at: new Date().toISOString().split(".")[0] + "Z"
                })
            }
            switch (newData.identity.country_of_tax_residence) {
                case "USA":
                    newData.identity.tax_id_type = "USA_SSN"
                    break
                case "TUR":
                    newData.identity.tax_id_type = "OTHER_GOV_ID"
                    break
                default:
                    newData.identity.tax_id_type = ""
                    break
            }
            return newData
        })
    }

    const register = () => {
        console.log(formData)
    }

    return (
        <div className='tw-min-w-screen tw-min-h-screen tw-flex tw-flex-col tw-justify-center tw-items-center'>
            <RegisterDataContext.Provider value={{ formData, setRegisterData, register }}>
                <RegisterSteps />
            </RegisterDataContext.Provider>
        </div >
    )
}

export default RegisterPage
export { RegisterDataContext }
