import { flexVariants } from "@/components/utils/variants"
import { VariantProps, cx } from "class-variance-authority"
import React from "react"

export interface IPageWrapperProps extends React.ButtonHTMLAttributes<HTMLDivElement>, VariantProps<typeof flexVariants> {
    className?: string
    children?: React.ReactNode
}

const PageWrapper = React.forwardRef<HTMLDivElement, IPageWrapperProps>(
    ({ className, children, direction, justify, alignItems, wrap, ...props }, ref) => {
        return (
            <div className={cx(flexVariants({ size: "full", direction, justify, alignItems, wrap }), className)} ref={ref} {...props}>
                {children}
            </div>
        )
    }
)

export default PageWrapper