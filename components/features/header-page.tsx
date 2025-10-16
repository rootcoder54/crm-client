"use client";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Home } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";

interface headerprops {
  chemins?: { title: string; url: string }[];
  children?: ReactNode;
}

function HeaderPage({ chemins, children }: headerprops) {
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

        <div className="ml-auto flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}

export default HeaderPage;
