import { cva } from "class-variance-authority";

const flexVariants = cva(
    "tw-flex",
    {
        variants: {
            size: {
                default: "",
                full: "tw-min-w-full tw-min-h-screen"
            },
            direction: {
                row: "tw-flex-row",
                col: "tw-flex-col",
            },
            justify: {
                normal: "tw-justify-normal",
                start: "tw-justify-start",
                end: "tw-justify-end",
                center: "tw-justify-center",
                evenly: "tw-justify-evenly",
            },
            alignItems: {
                start: "tw-items-start",
                end: "tw-items-end",
                center: "tw-items-center",
            },
            wrap: {
                yes: "tw-flex-wrap",
                no: "tw-flex-nowrap",
            }
        },
        defaultVariants: {
            size: "default",
            direction: "row",
            justify: "normal",
            alignItems: "start",
            wrap: "yes"
        },
    }
)

export { flexVariants }