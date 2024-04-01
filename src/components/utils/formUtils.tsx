import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { VariantProps, cva, cx } from "class-variance-authority"
import { zodResolver } from "@hookform/resolvers/zod"
import { z as zod } from "zod"
import { Control, useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { flexVariants } from "@/components/utils/variants"

// #region FIELD UTILS

interface IFieldClassNames {
    fieldCN?: string,
    labelCN?: string,
    inputCN?: string,
    descriptionCN?: string,
    messageCN?: string,
}

interface IFormInputProps {
    validation: zod.ZodTypeAny,
    type: React.HTMLInputTypeAttribute,
    label: string,
    fieldName: string,
    placeholder: string,
    description: string,
}

interface IFormInputControl extends IFormInputProps, IFieldClassNames {
    control: Control<{ [x: string]: any; }, any>,
}

const FormInputWrapper = ({ control, type, label, fieldName, placeholder, description,
    fieldCN, labelCN, inputCN, descriptionCN, messageCN }: IFormInputControl) => {
    return (
        <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className={cx("tw-w-[100%]", fieldCN)}>
                    <FormLabel className={labelCN}>{label}</FormLabel>
                    <FormControl>
                        <Input placeholder={placeholder} {...field} className={inputCN} type={type} />
                    </FormControl>
                    <FormDescription className={descriptionCN}>
                        {description}
                    </FormDescription>
                    <FormMessage className={messageCN} />
                </FormItem >
            )}
        />
    )
}

// #endregion

// #region FORM UTILS

interface IFormProps extends React.FormHTMLAttributes<HTMLFormElement>, VariantProps<typeof flexVariants>, IFieldClassNames {
    formCN?: string,
    fields: IFormInputProps[],
    submitBtnText?: string,
    onSubmit?: (data: {
        [x: string]: any;
    }) => void
}

const FormWrapper = ({ fields, onSubmit, direction, justify, alignItems, wrap, submitBtnText,
    formCN, fieldCN, labelCN, inputCN, descriptionCN, messageCN }: IFormProps) => {
    const zodObjFormat: { [key: string]: zod.ZodTypeAny } = {}
    for (let key in fields) {
        zodObjFormat[fields[key].fieldName] = fields[key].validation
    }
    const schema = zod.object(zodObjFormat)
    const form = useForm<zod.infer<typeof schema>>({
        resolver: zodResolver(schema),
    });

    const SubmitHandler = (data: zod.infer<typeof schema>) => {
        onSubmit && onSubmit(data)
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(SubmitHandler)} className={cx("tw-space-y-8", formCN, flexVariants({ size: "default", direction, justify, alignItems, wrap }))}>
                {fields.map((element, index) => {
                    return (
                        <FormInputWrapper
                            fieldCN={fieldCN}
                            labelCN={labelCN}
                            inputCN={inputCN}
                            type={element.type}
                            descriptionCN={descriptionCN}
                            messageCN={messageCN}
                            control={form.control}
                            key={index}
                            label={element.label}
                            placeholder={element.placeholder}
                            description={element.description}
                            fieldName={element.fieldName}
                            validation={element.validation}
                        />
                    )
                })}
                <Button type="submit">{submitBtnText ? submitBtnText : "Submit"}</Button>
            </form>
        </Form >
    );
};

// #endregion

export { FormWrapper, type IFormInputProps };