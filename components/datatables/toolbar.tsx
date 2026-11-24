"use client";

import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "../ui/button";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DataTableFilter from "./data-filter";
import DateFilter from "./date-table-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchId?: string;
  globalSearch?: boolean;
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
  isHeader?: boolean;
  selectAction?: {
    label: string;
    icon?: React.ReactNode;
    url: string;
    variantbtn: VariantProps<typeof buttonVariants>["variant"];
    hide?: boolean;
  }[];
}
function safeGetColumn<TData>(table: Table<TData>, id: string) {
  const exists = table.getAllColumns().some((c) => c.id === id);
  if (!exists) {
    //console.warn(`[Table] La colonne '${id}' n'existe pas.`);
    return null;
  }
  return table.getColumn(id);
}

function DataToolBar<TData>({
  table,
  searchId,
  globalSearch = false,
  searchPlaceholder,
  popFilter,
  dateChose,
  dateChoseTitle,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    table.getState().sorting.length > 0 ||
    !!table.getState().globalFilter;

  const filtreValeur = safeGetColumn(table, searchId ?? "");

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 px-3 pb-3">
      {(globalSearch || filtreValeur) && (
        <Input
          placeholder={`${searchPlaceholder ?? "Filter"}`}
          aria-label={searchPlaceholder ?? "Rechercher"}
          value={
            globalSearch
              ? (table.getState().globalFilter ?? "")
              : ((filtreValeur?.getFilterValue() as string) ?? "")
          }
          onChange={(event) =>
            globalSearch
              ? table.setGlobalFilter(event.target.value)
              : filtreValeur?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      )}
      <div className="flex flex-row gap-2">
        {filtreValeur &&
          popFilter &&
          popFilter.map((filter, index) => (
            <DataTableFilter
              key={index}
              column={safeGetColumn(table, filter.dataFilter) ?? undefined}
              title={filter.dataFilter}
              icon={filter.icon}
              options={filter.options ?? []}
            />
          ))}
        {filtreValeur && dateChose && (
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
                  table.setGlobalFilter("");
                  table.resetColumnFilters();
                  table.resetSorting();
                  table.setPageIndex(0);
                }}
                className="h-8 px-2 lg:px-3"
              >
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
  );
}

export default DataToolBar;
