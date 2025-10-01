"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import Link from "next/link";

import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
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
  links,
  selectlinks
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const deselectRows = () => {
    table.getState().rowSelection = {};
    table.setRowSelection({});
  };
  const filtreValeur = safeGetColumn(table, searchId ?? "");

  return (
    <div className="flex items-center py-4 w-full h-20">
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
          {isFiltered && (
            <Button
              variant="destructive"
              onClick={() => {
                table.resetColumnFilters();
              }}
              className="h-8 px-2 lg:px-3"
            >
              Effacer les filtres
              <X />
            </Button>
          )}
          {links &&
            links.map((link) => (
              <Link key={link.lien} href={`${link.lien}`}>
                <Button variant={link.variantbtn}>
                  {link.icon} {link.name}
                </Button>
              </Link>
            ))}
        </div>
        {table.getFilteredSelectedRowModel().rows.length !== 0 && (
          <div className="fixed bottom-5 shadow-2xl rounded-lg bg-zinc-300/30 backdrop-blur-md border z-[50]">
            <div className="flex flex-row items-center justify-start w-full gap-x-1 px-4 py-1">
              {selectlinks && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="size-8"
                      onClick={deselectRows}
                    >
                      <X />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Déselectionné</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums bg-blue-600">
                {table.getFilteredSelectedRowModel().rows.length}
              </Badge>{" "}
              <span>sélectionné</span>
              {selectlinks &&
                selectlinks.map((link, index) => (
                  <div key={index}>{link.btn}</div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataToolBar;
