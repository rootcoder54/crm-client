"use client";

import React from "react";
import { Column } from "@tanstack/react-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "../ui/button-group";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  SearchIcon,
  SlidersHorizontal,
  X
} from "lucide-react";

interface ColumnHeaderProps<TData, TValue> {
  title: string;
  column: Column<TData, TValue>;
}

export function ColumnHeader<TData, TValue>({
  title,
  column
}: ColumnHeaderProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(
    (column.getFilterValue() as string) ?? ""
  );
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      column.setFilterValue(text);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          className="w-full justify-start"
        >
          {title}
          {column.getIsFiltered() && <SlidersHorizontal />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <ButtonGroup>
          <Button
            variant="outline"
            aria-label="Search"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
          <Input
            placeholder="Filtrer..."
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          {column.getIsFiltered() && (
            <Button
              variant={"danger"}
              className="border"
              onClick={() => {
                column.setFilterValue("");
                column.toggleSorting(false);
              }}
            >
              <X />
            </Button>
          )}
          <Button
            variant="outline"
            aria-label="Search"
            onClick={() => {
              column.setFilterValue(text);
            }}
          >
            <SearchIcon />
          </Button>
        </ButtonGroup>
      </PopoverContent>
    </Popover>
  );
}
