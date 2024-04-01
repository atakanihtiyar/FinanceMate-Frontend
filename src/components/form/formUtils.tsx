import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cx } from "class-variance-authority"
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

interface IFormInputProps {
    validation: zod.ZodTypeAny,
    label: string,
    fieldName: string,
    placeholder: string,
    description: string,
}

interface IFormInputControl extends IFormInputProps {
    control: Control<{ [x: string]: any; }, any>,
    fieldClassName?: string,
    labelClassName?: string,
    inputClassName?: string,
    descriptionClassName?: string,
    messageClassName?: string,
}

const FormInputWrapper = ({ control, fieldName, label, placeholder, description,
    fieldClassName, labelClassName, inputClassName, descriptionClassName, messageClassName }: IFormInputControl) => {
    return (
        <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className={cx("tw-w-[100%]", fieldClassName)}>
                    <FormLabel className={labelClassName}>{label}</FormLabel>
                    <FormControl>
                        <Input placeholder={placeholder} {...field} className={cx("tw-w-[100%]", inputClassName)} />
                    </FormControl>
                    <FormDescription className={cx("tw-w-[100%]", descriptionClassName)}>
                        {description}
                    </FormDescription>
                    <FormMessage className={messageClassName} />
                </FormItem >
            )}
        />
    )
}

interface IFormProps {
    fields: IFormInputProps[],
    holderClassName?: string,
    formClassName?: string,
    fieldClassName?: string,
    labelClassName?: string,
    inputClassName?: string,
    descriptionClassName?: string,
    messageClassName?: string,
    onSubmit?: (data: {
        [x: string]: any;
    }) => void
}

const FormWrapper = ({ fields, onSubmit,
    holderClassName, formClassName, fieldClassName, labelClassName, inputClassName, descriptionClassName, messageClassName }: IFormProps) => {
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

    const holderBaseClassName = "tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-max tw-h-max"
    const formBaseClassName = "tw-space-y-8 tw-flex tw-flex-col tw-justify-center tw-items-center tw-bg-transparent"

    return (
        <Form {...form}>
            <div className={cx(holderBaseClassName, holderClassName)}>
                <form onSubmit={form.handleSubmit(SubmitHandler)} className={cx(formBaseClassName, formClassName)}>
                    {fields.map((element, index) => {
                        return (
                            <FormInputWrapper
                                fieldClassName={fieldClassName}
                                labelClassName={labelClassName}
                                inputClassName={inputClassName}
                                descriptionClassName={descriptionClassName}
                                messageClassName={messageClassName}
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
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        </Form>
    );
};

export { FormWrapper, type IFormInputProps };