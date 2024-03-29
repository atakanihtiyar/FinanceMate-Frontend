import React from "react"


export interface PageSectionProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
    className?: string
    children?: React.ReactNode
}

const PageSection = React.forwardRef<HTMLDivElement, PageSectionProps>(
    ({ className, children, ...props }, ref) => {
        const defaultStyle = `tw-min-w-full tw-min-h-screen tw-flex tw-justify-center tw-items-center`
        return (
            <div className={`${defaultStyle} ${className}`} ref={ref} {...props}>
                {children}
            </div>
        )
    }
)

export default PageSection