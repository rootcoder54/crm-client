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
import { Badge } from "@/components/ui/badge";
import DataTableFilter from "./data-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchId?: string;
  searchPlaceholder?: string;
  dataFilter?: string;
  options?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  popFilter?: {
    dataFilter: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
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
  popFilter
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
                options={filter.options ?? []}
              />
            ))}
          {isFiltered && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  onClick={() => {
                    table.resetColumnFilters();
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
          {table.getFilteredSelectedRowModel().rows.length !== 0 && (
            <div className="shadow-2xl rounded-lg bg-zinc-300/30 backdrop-blur-md border z-[50]">
              <div className="flex flex-row items-center justify-start w-full gap-x-1 px-4 py-1">
                <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums bg-blue-600">
                  {table.getFilteredSelectedRowModel().rows.length}
                </Badge>{" "}
                <span>sélectionné</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DataToolBar;
