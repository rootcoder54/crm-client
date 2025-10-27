"use client";

import React from "react";
import { Column } from "@tanstack/react-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUp,
  SearchIcon,
  SlidersHorizontal,
  X
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "../ui/input-group";

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
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-2">
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
