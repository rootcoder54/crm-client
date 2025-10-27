"use client";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import DataTableFilter from "./data-filter";
import DateFilter from "./date-table-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchId?: string;
  searchPlaceholder?: string;
  options?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  popFilter?: {
    dataFilter: string;
    icon?: React.ReactNode;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  dateChose?: string;
  dateChoseTitle?: string;
}
function safeGetColumn<TData>(table: Table<TData>, id: string) {
  const exists = table.getAllColumns().some((c) => c.id === id);
  if (!exists) {
    console.warn(`[Table] La colonne '${id}' n'existe pas.`);
    return null;
  }
  return table.getColumn(id);
}

function DataToolBar<TData>({
  table,
  searchId,
  searchPlaceholder,
  popFilter,
  dateChose,
  dateChoseTitle
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const filtreValeur = safeGetColumn(table, searchId ?? "");

  return (
    <div className="flex items-center py-4 w-full">
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-row items-center justify-start w-full gap-3 py-2">
          {filtreValeur && (
            <Input
              placeholder={`${searchPlaceholder ?? "Filter"}`}
              value={(filtreValeur?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                filtreValeur?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          )}
          {popFilter &&
            popFilter.map((filter, index) => (
              <DataTableFilter
                key={index}
                column={safeGetColumn(table, filter.dataFilter) ?? undefined}
                title={filter.dataFilter}
                icon={filter.icon}
                options={filter.options ?? []}
              />
            ))}
          {dateChose && (
            <DateFilter
              column={safeGetColumn(table, dateChose) ?? undefined}
              title={dateChoseTitle}
            />
          )}
          {isFiltered && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="danger"
                  onClick={() => {
                    table.resetColumnFilters();
                  }}
                  className="h-8 px-2 lg:px-3"
                >
                  Reset
                  <X />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Effacer les filtres</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}

export default DataToolBar;
