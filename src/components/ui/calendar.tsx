"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center gap-2",
        caption_label: "flex text-sm font-medium justify-center grow",
        caption_dropdowns: "flex justify-center gap-1 grow",
        vhidden: "hidden",
        nav: "flex items-center [&:has([name='previous-month'])]:order-first [&:has([name='next-month'])]:order-last",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
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
