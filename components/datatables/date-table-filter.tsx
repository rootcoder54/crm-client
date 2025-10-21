"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Column } from "@tanstack/react-table";
import { DateRange } from "react-day-picker"; // ✅ import du bon type

interface DataTableDateFilterProps<TData> {
  column?: Column<TData, unknown>;
  title?: string;
}

const DateFilter = <TData,>({
  column,
  title
}: DataTableDateFilterProps<TData>) => {
  const [range, setRange] = React.useState<DateRange | undefined>(undefined); // ✅ typage correct

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);

    if (newRange?.from && newRange?.to) {
      column?.setFilterValue([
        newRange.from.toISOString(),
        newRange.to.toISOString()
      ]);
    } else {
      column?.setFilterValue(undefined);
    }
    if (newRange?.from && newRange?.to) {
      column?.setFilterValue([
        newRange.from.toISOString(),
        newRange.to.toISOString()
      ]);
    } else {
      column?.setFilterValue(undefined);
    }
  };

  const handleReset = () => {
    setRange(undefined);
    column?.setFilterValue(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 border-dashed",
            !range?.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {title || "Filtrer"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-3">
        <Calendar
          mode="range"
          numberOfMonths={1}
          selected={range}
          onSelect={handleSelect}
          initialFocus
          locale={fr}
        />
        {(range?.from || range?.to) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="mt-2 w-full text-center"
          >
            Réinitialiser
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;
