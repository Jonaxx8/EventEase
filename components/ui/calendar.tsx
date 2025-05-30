"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { addDays, addMonths, format, startOfMonth, startOfWeek, eachDayOfInterval, isSameMonth, isSameDay, subMonths } from "date-fns"

interface CalendarProps {
  selected?: Date | undefined
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  showOutsideDays?: boolean
  className?: string
  modifiers?: Record<string, (date: Date) => boolean>
  modifiersStyles?: Record<string, React.CSSProperties>
}

function Calendar({
  selected,
  onSelect,
  disabled,
  modifiers = {},
  modifiersStyles = {},
  showOutsideDays = true,
  className,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
  const daysInMonth = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth))
    return eachDayOfInterval({
      start,
      end: addDays(start, 41)
    })
  }, [currentMonth])

  const weekDays = React.useMemo(() => {
    const start = startOfWeek(new Date())
    return eachDayOfInterval({
      start,
      end: addDays(start, 6)
    }).map(day => format(day, "EEE"))
  }, [])

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }

  const handleSelectDate = (day: Date) => {
    if (disabled?.(day)) return
    onSelect?.(day)
  }

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="space-y-4">
        <div className="flex justify-center pt-1 relative items-center">
          <div className="text-sm font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </div>
          <div className="flex items-center gap-1 absolute right-1">
            <button
              onClick={handlePreviousMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              )}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className={cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              )}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div
              key={day}
              className="text-muted-foreground text-center text-[0.8rem] font-normal"
            >
              {day}
            </div>
          ))}
          {daysInMonth.map((day, i) => {
            const isSelected = selected instanceof Date && isSameDay(day, selected)
            const isOutsideMonth = !isSameMonth(day, currentMonth)
            const isDisabled = disabled?.(day)
            
            // Apply custom modifiers
            const modifierStyles = Object.entries(modifiers).reduce((styles, [name, fn]) => {
              if (fn(day)) {
                return { ...styles, ...modifiersStyles[name] }
              }
              return styles
            }, {})

            if (!showOutsideDays && isOutsideMonth) {
              return <div key={i} />
            }

            return (
              <button
                key={i}
                onClick={() => handleSelectDate(day)}
                disabled={isDisabled}
                className={cn(
          buttonVariants({ variant: "ghost" }),
                  "size-8 p-0 font-normal",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  isOutsideMonth && "text-muted-foreground opacity-50",
                  isDisabled && "text-muted-foreground opacity-50 cursor-not-allowed"
                )}
                style={modifierStyles}
              >
                {format(day, "d")}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { Calendar }
