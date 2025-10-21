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
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface DataTableDateFilterProps<TData> {
  column?: Column<TData, unknown>;
  title?: string;
}

const DateFilter = <TData,>({
  column,
  title
}: DataTableDateFilterProps<TData>) => {
  // ✅ Lecture directe de la valeur du filtre depuis la colonne
  const filterValueChose = column?.getFilterValue() as [string, string] | undefined;

  // ✅ Transformation de la valeur en objet DateRange
  const rangeFromColumn: DateRange | undefined = filterValueChose
    ? {
        from: filterValueChose[0] ? new Date(filterValueChose[0]) : undefined,
        to: filterValueChose[1] ? new Date(filterValueChose[1]) : undefined
      }
    : undefined;

  // ✅ État local
  const [range, setRange] = React.useState<DateRange | undefined>(
    rangeFromColumn
  );
  React.useEffect(() => {
    setRange(rangeFromColumn);
  }, [filterValueChose]);

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
        <Button variant="outline" size="sm" className={cn("h-8 border-dashed")}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {title || "Filtrer"}
          {range?.from && range?.to && (
            <>
            <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal "
              >
                {format(range.from, "dd/MM/yyyy", {
                  locale: fr
                })}{" "}
                - {format(range.to, "dd/MM/yyyy", { locale: fr })}
              </Badge>
            </>
          )}
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
            Nettoyer le filter
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;
