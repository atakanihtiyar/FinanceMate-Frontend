import React, { Children, ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textVariants = cva(
    ``,
    {
        variants: {
            variant: {
                h1: "tw-scroll-m-20 tw-tracking-tight tw-m-3 tw-text-3xl tw-font-extrabold",
                h2: "tw-scroll-m-20 tw-tracking-tight tw-m-3 tw-text-2xl tw-font-semibold tw-border-b tw-pb-2 first:tw-mt-0",
                h3: "tw-scroll-m-20 tw-tracking-tight tw-m-3 tw-text-xl tw-font-semibold",
                h4: "tw-scroll-m-20 tw-tracking-tight tw-m-3 tw-text-l tw-font-semibold",
                body: "leading-7 [&:not(:first-child)]:mt-6",
                muted: "tw-text-sm tw-text-muted-foreground",
            },
            align: {
                none: "",
                start: "tw-text-start",
                center: "tw-text-center",
                end: "tw-text-end",
            },
            size: {
                none: "",
                sm: "tw-text-sm",
                md: "tw-text-md",
                lg: "tw-text-lg",
                xl: "tw-text-xl",
                _2xl: "tw-text-2xl",
                _3xl: "tw-text-3xl",
                _4xl: "tw-text-4xl",
                _5xl: "tw-text-5xl",
                _6xl: "tw-text-6xl",
            },
            wrap: {
                none: "",
                wrap: "tw-text-wrap",
                nowrap: "tw-text-nowrap",
            }
        },
        defaultVariants: {
            variant: "body",
            align: "none",
            size: "none",
            wrap: "none",
        },
    }
)

// #region ANCHOR

interface AnchorProps extends React.HTMLAttributes<HTMLAnchorElement>, VariantProps<typeof textVariants> {
    level?: "a",
    link: string,
    children?: React.ReactNode,
}

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
    ({ level: Tag = "a", link, children, variant, align, size, wrap, className, ...props }, ref) => {
        return (
            <Tag
                className={cn(textVariants({ variant, align, size, wrap, className }))}
                href={link}
                ref={ref}
                {...props}>
                {children}
            </Tag>
        )
    }
)

// #endregion

// #region TYPO

interface TypoProps extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof textVariants> {
    level?: "p",
    children?: React.ReactNode,
}

const Typo = React.forwardRef<HTMLParagraphElement, TypoProps>(
    ({ level: Tag = "p", children, variant, align, size, wrap, className, ...props }, ref) => {
        return (
            <Tag
                className={cn(textVariants({ variant, align, size, wrap, className }))}
                ref={ref}
                {...props}>
                {children}
            </Tag>
        )
    }
)

// #endregion

// #region HEADING

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof textVariants> {
    level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
    children?: React.ReactNode,
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ level: Tag = "h1", children, variant, align, size, wrap, className, ...props }, ref) => {
        return (
            <Tag
                className={cn(textVariants({ variant, align, size, wrap, className }))}
                ref={ref}
                {...props}>
                {children}
            </Tag>
        )
    }
)

// #endregion

export { Heading, Typo, Anchor, textVariants }
