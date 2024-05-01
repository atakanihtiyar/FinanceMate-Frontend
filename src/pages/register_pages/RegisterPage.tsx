import { RegisterSteps } from "./RegisterSteps"
import { createContext, useState } from "react"

interface FormDataType {
    given_name: string,
    family_name: string,
    calling_code: string,
    phone_number: string,
    email_address: string,
    password: string,
    alpaca: {
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
            phone_number: string,
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
        }
    }
}

const DefaultFormData: FormDataType = {
    given_name: "",
    family_name: "",
    calling_code: "",
    phone_number: "",
    email_address: "",
    password: "",
    alpaca: {
        identity: {
            given_name: "",
            family_name: "",
            date_of_birth: "",
            country_of_tax_residence: "",
            tax_id_type: "",
            tax_id: "",
            funding_source: []
        },
        contact: {
            email_address: "",
            phone_number: "",
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
        }
    }
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
        is_control_person, is_affiliated_exchange_or_finra, is_politically_exposed, immediate_family_exposed
    }: setRegisterDataProps) => {
        setFormData(oldData => {
            const newData: FormDataType = {
                ...oldData,
                given_name: given_name ? given_name : oldData.given_name,
                family_name: family_name ? family_name : oldData.family_name,
                calling_code: calling_code ? calling_code : oldData.calling_code,
                phone_number: phone_number ? phone_number : oldData.phone_number,
                email_address: email_address ? email_address : oldData.email_address,
                password: password ? password : oldData.password,
                alpaca: {
                    ...oldData.alpaca,
                    identity: {
                        ...oldData.alpaca.identity,
                        date_of_birth: date_of_birth ? date_of_birth : oldData.alpaca.identity.date_of_birth,
                        tax_id_type: tax_id_type ? tax_id_type : oldData.alpaca.identity.tax_id_type,
                        tax_id: tax_id ? tax_id : oldData.alpaca.identity.tax_id,
                        funding_source: funding_source ? funding_source : oldData.alpaca.identity.funding_source,
                        given_name: given_name ? given_name : oldData.alpaca.identity.given_name,
                        family_name: family_name ? family_name : oldData.alpaca.identity.family_name,
                        country_of_tax_residence: country_of_tax_residence ? country_of_tax_residence : oldData.alpaca.identity.country_of_tax_residence
                    },
                    contact: {
                        ...oldData.alpaca.contact,
                        email_address: email_address ? email_address : oldData.alpaca.contact.email_address,
                        phone_number: calling_code && phone_number ? `+${calling_code}${phone_number}` : oldData.alpaca.contact.phone_number,
                        street_address: street_address ? street_address : oldData.alpaca.contact.street_address,
                        unit: unit ? unit : oldData.alpaca.contact.unit,
                        city: city ? city : oldData.alpaca.contact.city,
                        state: state ? state : oldData.alpaca.contact.state,
                        postal_code: postal_code ? postal_code : oldData.alpaca.contact.postal_code,
                    },
                    disclosures: {
                        ...oldData.alpaca.disclosures,
                        is_control_person: is_control_person !== undefined ? is_control_person : oldData.alpaca.disclosures.is_control_person,
                        is_affiliated_exchange_or_finra: is_affiliated_exchange_or_finra !== undefined ? is_affiliated_exchange_or_finra : oldData.alpaca.disclosures.is_affiliated_exchange_or_finra,
                        is_politically_exposed: is_politically_exposed !== undefined ? is_politically_exposed : oldData.alpaca.disclosures.is_politically_exposed,
                        immediate_family_exposed: immediate_family_exposed !== undefined ? immediate_family_exposed : oldData.alpaca.disclosures.immediate_family_exposed,
                    }
                }
            }
            switch (newData.alpaca.identity.country_of_tax_residence) {
                case "USA":
                    newData.alpaca.identity.tax_id_type = "USA_SSN"
                    break
                case "TUR":
                    newData.alpaca.identity.tax_id_type = "OTHER_GOV_ID"
                    break
                default:
                    newData.alpaca.identity.tax_id_type = ""
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
