import React from "react";
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textVariants = cva(
    "",
    {
        variants: {
            variant: {
                p: "leading-7 [&:not(:first-child)]:mt-6",
                muted: "tw-text-sm tw-text-muted-foreground",
            },
            size: {
                default: "",
                lg: "tw-text-lg",
            },
        },
        defaultVariants: {
            variant: "p",
            size: "default",
        },
    }
)

export interface TextProps
    extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof textVariants> {
    asChild?: boolean
}
const Text = React.forwardRef<HTMLHeadingElement, TextProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "p"
        return (
            <Comp
                className={cn(textVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Text.displayName = "Text"

export { Text, textVariants }
