"use client";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
import React, { useEffect } from "react";
import DataToolBar from "./toolbar";
import { DataTablePagination } from "./PaginationTable";
import { buildColumns } from "./columns";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "../ui/button";
import Header from "./header";

interface DataTableProps<TData extends Record<string, unknown>> {
  data: TData[];
  onRowSelect?: (id: string) => void;
  notData?: string;
  searchId?: string;
  searchPlaceholder?: string;
  links?: {
    name: string;
    icon: React.ReactNode;
    lien: string;
    variantbtn?: VariantProps<typeof buttonVariants>["variant"];
  }[];
  selectlinks?: {
    btn: React.ReactNode;
  }[];
  hideList?: string[];
  chemins?: { title: string; url: string }[];
  action?: {
    label: string;
    icon?: React.ReactNode;
    url: string;
    variantbtn: VariantProps<typeof buttonVariants>["variant"];
    hide?: boolean;
  }[];
  selectAction?: {
    label: string;
    icon?: React.ReactNode;
    url: string;
    variantbtn: VariantProps<typeof buttonVariants>["variant"];
    hide?: boolean;
  }[];
}

export function DataTable<TData extends Record<string, unknown>>({
  data,
  onRowSelect,
  notData,
  searchId,
  searchPlaceholder,
  links,
  selectlinks,
  hideList,
  chemins,
  action,
  selectAction
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const columns = buildColumns(data);

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
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
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

  return (
    <div className="w-full">
      <Header
        table={table}
        chemins={chemins}
        action={action}
        selectAction={selectAction}
      />
      <div className="overflow-hidden">
        <div>
          <DataToolBar
            table={table}
            searchId={searchId}
            searchPlaceholder={searchPlaceholder}
            selectlinks={selectlinks}
            links={links}
          />
        </div>
        <Table className="border-y w-full">
          <TableHeader className="bg-zinc-600/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="w-full">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
