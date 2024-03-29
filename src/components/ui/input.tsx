import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "tw-flex tw-h-9 tw-w-full tw-rounded-md tw-border tw-border-zinc-200 tw-bg-transparent tw-px-3 tw-py-1 tw-text-sm tw-shadow-sm tw-transition-colors file:tw-border-0 file:tw-bg-transparent file:tw-text-sm file:tw-font-medium placeholder:tw-text-zinc-500 focus-visible:tw-outline-none focus-visible:tw-ring-1 focus-visible:tw-ring-zinc-950 disabled:tw-cursor-not-allowed disabled:tw-opacity-50 dark:tw-border-zinc-800 dark:placeholder:tw-text-zinc-400 dark:focus-visible:tw-ring-zinc-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
