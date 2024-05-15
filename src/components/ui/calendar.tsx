import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps & { onChange?: React.ChangeEventHandler<HTMLSelectElement> }) {

  const handleCalendarChange = (_value: string | number, _e: React.ChangeEventHandler<HTMLSelectElement>) => {
    const _event = {
      target: {
        value: String(_value)
      },
    } as React.ChangeEvent<HTMLSelectElement>
    _e(_event)
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("tw-p-3", className)}
      classNames={{
        months: "tw-flex tw-flex-col sm:tw-flex-row tw-space-y-4 sm:tw-space-x-4 sm:tw-space-y-0",
        month: "tw-space-y-4",
        caption: "tw-flex tw-justify-center tw-pt-1 tw-relative tw-items-center tw-gap-2",
        caption_label: "tw-flex tw-text-sm tw-font-medium tw-justify-center tw-grow",
        caption_dropdowns: "tw-flex tw-justify-center tw-gap-1 tw-grow",
        vhidden: "tw-hidden",
        nav: "tw-flex tw-items-center [&:has([name='previous-month'])]:tw-order-first [&:has([name='next-month'])]:tw-order-last",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "tw-h-7 tw-w-7 tw-bg-transparent tw-border-[--foreground] tw-text-[--foreground] tw-p-0 tw-text-muted"
        ),
        nav_button_previous: "tw-absolute tw-left-1",
        nav_button_next: "tw-absolute tw-right-1",
        table: "tw-w-full tw-border-collapse tw-space-y-1",
        head_row: "tw-flex",
        head_cell:
          "tw-text-zinc-500 tw-rounded-md tw-w-8 tw-font-normal tw-text-[0.8rem] dark:tw-text-zinc-400",
        row: "tw-flex tw-w-full tw-mt-2",
        cell: cn(
          "tw-relative tw-p-0 tw-text-center tw-text-sm focus-within:tw-relative focus-within:tw-z-20 [&:has([aria-selected])]:tw-bg-zinc-100 [&:has([aria-selected].day-outside)]:tw-bg-zinc-100/50 [&:has([aria-selected].day-range-end)]:tw-rounded-r-md dark:[&:has([aria-selected])]:tw-bg-zinc-800 dark:[&:has([aria-selected].day-outside)]:tw-bg-zinc-800/50",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:tw-rounded-r-md [&:has(>.day-range-start)]:tw-rounded-l-md first:[&:has([aria-selected])]:tw-rounded-l-md last:[&:has([aria-selected])]:tw-rounded-r-md"
            : "[&:has([aria-selected])]:tw-rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "tw-h-8 tw-w-8 !tw-m-0 tw-p-0 tw-font-normal aria-selected:tw-opacity-100 tw-text-[--foreground] aria-selected:tw-opacity-100 aria-selected:tw-bg-[--primary] aria-selected:tw-text-[--foreground]"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "tw-bg-zinc-900 tw-text-zinc-50 hover:tw-bg-zinc-900 hover:tw-text-zinc-50 focus:tw-bg-zinc-900 focus:tw-text-zinc-50 dark:tw-bg-zinc-50 dark:tw-text-zinc-900 dark:hover:tw-bg-zinc-50 dark:hover:tw-text-zinc-900 dark:focus:tw-bg-zinc-50 dark:focus:tw-text-zinc-900",
        day_today: "tw-bg-zinc-100 tw-text-zinc-900 dark:tw-bg-zinc-800 dark:tw-text-zinc-50",
        day_outside:
          "day-outside tw-text-zinc-500 tw-opacity-50 aria-selected:tw-bg-[--primary] aria-selected:tw-text-[--foreground] aria-selected:tw-opacity-50 dark:tw-text-zinc-400 dark:aria-selected:tw-bg-zinc-800/50 dark:aria-selected:tw-text-zinc-400",
        day_disabled: "tw-text-zinc-500 tw-opacity-50 dark:tw-text-zinc-400",
        day_range_middle:
          "aria-selected:tw-bg-zinc-100 aria-selected:tw-text-zinc-900 dark:aria-selected:tw-bg-zinc-800 dark:aria-selected:tw-text-zinc-50",
        day_hidden: "tw-invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeftIcon className="tw-h-4 tw-w-4" />,
        IconRight: () => <ChevronRightIcon className="tw-h-4 tw-w-4" />,
        Dropdown: ({ ...props }) => (
          <Select
            onValueChange={(value) => {
              if (props.onChange) {
                handleCalendarChange(value, props.onChange)
              }
            }}
            value={props.value as string}
          >
            <SelectTrigger className={cn(buttonVariants({ variant: "ghost" }), "tw-pl-2 tw-pr-1 tw-py-2 tw-h-7 tw-w-fit tw-font-medium tw-text-[--foreground] [.is-between_&]:tw-hidden [.is-end_&]:tw-hidden [.is-start.is-end_&]:tw-flex")}>
              <SelectValue placeholder={props?.caption} >{props?.caption}</SelectValue>
            </SelectTrigger>
            <SelectContent className="tw-max-h-[var(--radix-popper-available-height);] tw-overflow-y-auto tw-scrolling-auto tw-min-w-[var(--radix-popper-anchor-width)]">
              {props.children &&
                React.Children.map(props.children, (child) =>
                  <SelectItem value={(child as React.ReactElement<any>)?.props?.value} className="tw-min-w-[var(--radix-popper-anchor-width)] hover:!tw-bg-[--primary] hover:!tw-text-[--foreground] aria-selected:tw-bg-[--primary] aria-selected:tw-text-[--foreground]">{(child as React.ReactElement<any>)?.props?.children}</SelectItem>
                )
              }
            </SelectContent>
          </Select>
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
