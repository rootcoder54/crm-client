"use client";
import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Table } from "@tanstack/react-table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Home, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface headerprops<TData> {
  table: Table<TData>;
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

function Header<TData>({
  table,
  chemins,
  action,
  selectAction
}: headerprops<TData>) {
  const deselectRows = () => {
    table.getState().rowSelection = {};
    table.setRowSelection({});
  };
  const ismobile = useIsMobile();
  return (
    <header className="flex sticky top-0 z-50 bg-background/5 backdrop-blur-sm h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-2">
          {ismobile ? (
            <>
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />
            </>
          ) : (
            <>
              <Link href={`http://localhost:3000`}>
                <Home className="-ml-1" />
              </Link>
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />
            </>
          )}
        </div>
        {chemins ? (
          chemins.map((chemin, index) => (
            <div key={index} className="flex items-center gap-2">
              {chemin.url === "#" ? (
                <h1>{chemin.title}</h1>
              ) : (
                <Link href={chemin.url}>
                  <h1 className="text-base font-medium">{chemin.title}</h1>
                </Link>
              )}
              {index < chemins.length - 1 && (
                <Separator
                  orientation="vertical"
                  className="mx-2 data-[orientation=vertical]:h-4"
                />
              )}
            </div>
          ))
        ) : (
          <>
            <h1 className="text-base font-medium">Test</h1>
          </>
        )}

        <div className="ml-auto flex items-center gap-2">
          {table.getFilteredSelectedRowModel().rows.length !== 0 && (
            <div className="flex items-center gap-2">
              {selectAction && (
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"default"}
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
                  {selectAction.map((act, index) => (
                    <Button
                      key={index}
                      variant={act.variantbtn}
                      asChild
                      size="sm"
                      className={cn(act.hide && "hidden")}
                    >
                      <Link href={act.url} className="dark:text-foreground">
                        {act.icon}
                        <span className="hidden sm:flex">{act.label}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
          {table.getFilteredSelectedRowModel().rows.length === 0 && action && (
            <div className="flex items-center gap-2">
              {action.map((act, index) => (
                <Button
                  key={index}
                  variant={act.variantbtn}
                  asChild
                  size="sm"
                  className={cn(act.hide && "hidden")}
                >
                  <Link href={act.url} className="dark:text-foreground">
                    {act.icon}
                    <span className="hidden sm:flex">{act.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
