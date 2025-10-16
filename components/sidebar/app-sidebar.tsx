"use client";

import * as React from "react";
import {
  AlignLeft,
  FileArchive,
  FileChartColumn,
  FileChartPie,
  Home,
  MessageCircleQuestion,
  Settings,
  Users,
  UserSquareIcon
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent
} from "@/components/ui/sidebar";
import { UserButton } from "@/components/sidebar/userButton";
import { NavItems } from "./navItems";
import { usePathname } from "next/navigation";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const data = {
    navMain: [
      {
        title: "Accueil",
        url: "/",
        icon: Home,
        isActive: pathname === "/"
      },
      {
        title: "Employé",
        url: "/employe",
        icon: Users,
        isActive: pathname === "/employe"
      },
      {
        title: "Client",
        url: "/client",
        icon: UserSquareIcon,
        isActive: pathname.startsWith("/client")
      },
      {
        title: "Requête",
        url: "/requete",
        icon: AlignLeft,
        isActive: pathname.startsWith("/requete")
      },
      {
        title: "Intervention",
        url: "/intervention",
        icon: FileChartColumn,
        isActive: pathname.startsWith("/intervention")
      },
      {
        title: "Facture",
        url: "/facture",
        icon: FileChartPie,
        isActive: pathname.startsWith("/facture")
      },
      {
        title: "Formation User",
        url: "/formationuser",
        icon: FileArchive,
        isActive: pathname === "/formationuser"
      },
      {
        title: "Questions Frequents",
        url: "/ask",
        icon: MessageCircleQuestion,
        isActive: pathname.startsWith("/ask")
      },
      {
        title: "Parametres",
        url: "/setting",
        icon: Settings,
        isActive: pathname === "/setting"
      }
    ]
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <UserButton />
      </SidebarHeader>
      <SidebarContent>
        <NavItems items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
