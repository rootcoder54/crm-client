"use client";

import { AlignLeft, type LucideIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SearchButton } from "./searchButton";
import { ScrollArea } from "@/components/ui/scroll-area";

export function NavItems({
  items
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  return (
    <ScrollArea className="h-full w-full">
      <SidebarMenu className="gap-y-1">
        <SidebarMenuItem>
          <SearchButton />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Link href={"/requete/add"} className="flex items-center gap-x-1">
              <AlignLeft />
              <span>Nouvelle requête</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <hr />
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.isActive}>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </ScrollArea>
  );
}
