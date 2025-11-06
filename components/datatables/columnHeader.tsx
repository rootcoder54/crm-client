"use client";

import React from "react";
import { Column, Table } from "@tanstack/react-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  AArrowDown,
  AArrowUp,
  ArrowDown,
  ArrowUp,
  Check,
  SlidersHorizontal
} from "lucide-react";

import { Badge } from "../ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "../ui/command";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface ColumnHeaderProps<TData, TValue> {
  title: string;
  column: Column<TData, TValue>;
  table: Table<TData>;
}

export function ColumnHeader<TData, TValue>({
  title,
  column,
  table
}: ColumnHeaderProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(
    (column.getFilterValue() as string) ?? ""
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      column.setFilterValue(text);
      event.preventDefault();
    }
  };

  const allValues = table
    .getCoreRowModel()
    .rows.map((row) => row.getValue(column.id));
  const dataFiltered = Array.from(
    new Map(
      (allValues ?? []).map((value) => [
        value,
        {
          label: value,
          value: value
        }
      ])
    ).values()
  ) as { label: string; value: string }[];

  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="transparent"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          className="w-full justify-start"
        >
          {title}
          {column.getIsFiltered() && <SlidersHorizontal />}
          {column.getIsSorted() === "desc" ? (
            <Badge className="bg-yellow-400 text-black">
              <AArrowDown className="h-4 w-4" />
            </Badge>
          ) : column.getIsSorted() === "asc" ? (
            <Badge className="bg-yellow-400 text-black">
              <AArrowUp className="h-4 w-4" />
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="w-80"
        onClick={(e) => e.stopPropagation()}
      >
        {/*<div className="flex flex-col space-y-2">
          <InputGroup>
            <InputGroupInput
              placeholder="Filtrer..."
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            {column.getIsFiltered() && (
              <Button
                variant={"ghost"}
                className="hover:text-red-800"
                onClick={() => {
                  column.setFilterValue("");
                  column.toggleSorting(false);
                }}
              >
                <X />
              </Button>
            )}
            <InputGroupAddon align="inline-end">
              <Button
                variant="ghost"
                aria-label="Search"
                onClick={() => {
                  column.setFilterValue(text);
                }}
              >
                <SearchIcon />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <Button
            variant={column.getIsSorted() === "asc" ? "secondary" : "ghost"}
            onClick={() => column.toggleSorting(false)}
            className="justify-start"
          >
            <ArrowUp className="ml-2 h-4 w-4" /> Croissant
          </Button>
          <Button
            variant={column.getIsSorted() === "desc" ? "secondary" : "ghost"}
            onClick={() => column.toggleSorting(true)}
            className="justify-start"
          >
            <ArrowDown className="ml-2 h-4 w-4" /> Decroissant
          </Button>
        </div>*/}
        <Command>
          <div className="flex flex-row py-1 gap-2 items-center">
            <CommandInput
              value={text}
              onValueChange={(e) => setText(e)}
              onKeyDown={handleKeyDown}
              className="border-0"
              placeholder={title}
              noBorder
            />
            <Button
              variant={column.getIsSorted() === "asc" ? "outline" : "ghost"}
              onClick={() => column.toggleSorting(false)}
              className="justify-start"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant={column.getIsSorted() === "desc" ? "outline" : "ghost"}
              onClick={() => column.toggleSorting(true)}
              className="justify-start"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
          <hr />
          <CommandList>
            <CommandEmpty>Aucun resultat.</CommandEmpty>
            <CommandGroup>
              {dataFiltered.map((option, index) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={index}
                    className={cn(
                      isSelected && "bg-zinc-600/10 dark:bg-zinc-600/35",
                      "cursor-pointer"
                    )}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.clear();
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check />
                    </div>
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        {selectedValues.size > 0 && (
          <>
            <Separator className="mt-2" />
            <Button
              onClick={() => column?.setFilterValue(undefined)}
              className="w-full mt-2"
              variant={"secondary"}
            >
              Nettoyer le filter
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
