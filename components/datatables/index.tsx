"use client";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Popover, PopoverContent } from "@/components/ui/popover";
import React, { useEffect } from "react";
import DataToolBar from "./toolbar";
import { buildColumns } from "./columns";
import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import Header from "./header";
import Link from "next/link";
import { X } from "lucide-react";
import { RiFileExcel2Line } from "react-icons/ri";
import { dateRangeFilter } from "./dateRangeFilter";
import { cn } from "@/lib/utils";

interface DataTableProps<TData extends Record<string, unknown>> {
  data: TData[];
  onRowSelect?: (id: string) => void;
  notData?: string;
  searchId?: string;
  searchPlaceholder?: string;
  hideList?: string[];
  chemins?: { title: string; url: string }[];
  isHeader?: boolean;
  titre?: string;
  description?: string;
  action?: {
    label: string;
    icon?: React.ReactNode;
    url: string;
    variantbtn: VariantProps<typeof buttonVariants>["variant"];
    hide?: boolean;
    target?: boolean;
  }[];
  selectAction?: {
    label: string;
    icon?: React.ReactNode;
    url: string;
    variantbtn: VariantProps<typeof buttonVariants>["variant"];
    hide?: boolean;
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
  columnStyles?: Record<
    string,
    (value: unknown, row: TData) => React.ReactNode
  >;
  exportName?: string;
}

export function DataTable<TData extends Record<string, unknown>>({
  data,
  titre,
  description,
  onRowSelect,
  notData,
  searchId,
  searchPlaceholder,
  hideList,
  chemins,
  isHeader = true,
  action,
  selectAction,
  popFilter,
  dateChose,
  dateChoseTitle,
  columnStyles,
  exportName
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  });
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const columns = buildColumns(data, columnStyles);

  const initialVisibility: VisibilityState = hideList
    ? hideList.reduce((acc, key) => ({ ...acc, [key]: false }), {})
    : {};
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: false,
      ...initialVisibility
    });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    //enableRowSelection: true,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    //getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    filterFns: {
      dateRange: dateRangeFilter
    },
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      const selectedId = selectedRows[0].getValue("id") as string;
      if (onRowSelect) onRowSelect(selectedId);
    }
  }, [rowSelection, table, onRowSelect]);

  console.log(
    table.getRowModel().rows.map((row) => {
      return row.getAllCells().reduce((acc, cell) => {
        acc[cell.column.id] = cell.getValue();
        return acc;
      }, {} as Record<string, unknown>);
    })
  );
  const exportExcel = async () => {
    const data = table.getRowModel().rows.map((row) => {
      return row.getAllCells().reduce((acc, cell) => {
        acc[cell.column.id] = cell.getValue();
        return acc;
      }, {} as Record<string, unknown>);
    });
    const response = await fetch("/api/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data })
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = exportName ? exportName + ".xlsx" : "data.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const error = await response.json();
      alert(error.message);
    }
  };

  return (
    <div className="w-full pb-5">
      {isHeader && (
        <Header
          table={table}
          chemins={chemins}
          action={action}
          selectAction={selectAction}
        />
      )}
      {selectAction && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverContent
            side="right"
            align="start"
            className="p-2 w-40 absolute"
            style={{
              top: position.y,
              left: position.x,
              transform: "translate(1%, 1%)"
            }}
          >
            <div className="flex flex-col space-y-2">
              <>
                {selectAction.map(
                  (actionItem, index) =>
                    !actionItem.hide && (
                      <Link key={index} href={actionItem.url}>
                        <Button
                          variant={"ghost"}
                          className="w-full justify-start"
                        >
                          {actionItem.icon && (
                            <span className="mr-2">{actionItem.icon}</span>
                          )}{" "}
                          {actionItem.label}
                        </Button>
                      </Link>
                    )
                )}
              </>
              <Button
                variant={"green"}
                className="w-full justify-start text-green-600 dark:text-white"
                onClick={exportExcel}
              >
                <span className="mr-2">
                  <RiFileExcel2Line />
                </span>
                Excel
              </Button>
              <Button
                variant={"danger"}
                onClick={() => {
                  setOpen(false);
                  table.resetRowSelection();
                }}
                className="w-full justify-start"
              >
                <span className="mr-2">
                  {" "}
                  <X />
                </span>
                <span>Annuler</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
      <div className="space-y-3 px-3">
        {titre && <h2 className="text-xl pt-5 font-bold">{titre}</h2>}
        {description && <p className="wrap-break-word">{description}</p>}
      </div>
      <div className="overflow-hidden">
        <div>
          <DataToolBar
            table={table}
            searchId={searchId}
            searchPlaceholder={searchPlaceholder}
            popFilter={popFilter}
            dateChose={dateChose}
            dateChoseTitle={dateChoseTitle}
          />
        </div>
        <Table className="border-y w-full">
          <TableHeader className="bg-zinc-600/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="w-full">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(index !== 0 && "border-r")}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer w-full h-8"
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    table.setRowSelection({ [row.id]: true });
                    const selectedId = row.getValue("id") as string;
                    if (onRowSelect) onRowSelect(selectedId);
                  }}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    table.setRowSelection({ [row.id]: true });
                    const selectedId = row.getValue("id") as string;
                    if (onRowSelect) onRowSelect(selectedId);
                    setOpen(true);
                    setPosition({ x: event.clientX, y: event.clientY });
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(cell.column.getIndex() !== 0 && "border-r")}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {notData ? notData : "Pas de resultat"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
