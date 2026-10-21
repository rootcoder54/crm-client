"use client";

import * as React from "react";
import {
  AlignLeft,
  AppWindow,
  BookDashed,
  Copyright,
  FileArchive,
  FileChartPie,
  Home,
  MessageCircleQuestion,
  Users,
  UserSquareIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "@/components/ui/sidebar";
import { UserButton } from "@/components/sidebar/userButton";
import { NavItems } from "./navItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNumberOfDraftRequetes } from "@/services/requete.service";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [draftCount, setdraftCount] = React.useState<string>();
  React.useEffect(() => {
    getNumberOfDraftRequetes()
      .then((count) => {
        if (count !== 0) {
          setdraftCount(count + "");
        } else {
          setdraftCount(undefined);
        }
      })
      .catch(() => setdraftCount(undefined));
  }, [pathname]);
  const data = {
    navMain: [
      {
        title: "Accueil",
        url: "/",
        icon: Home,
        isActive: pathname === "/",
      },
      {
        title: "Équipe",
        url: "/employe",
        icon: Users,
        isActive: pathname === "/employe",
      },
      {
        title: "Clients",
        url: "/client",
        icon: UserSquareIcon,
        isActive: pathname.startsWith("/client"),
      },
      {
        title: "Licence",
        url: "/licence",
        icon: Copyright,
        isActive: pathname.startsWith("/licence"),
      },
      {
        title: "Requêtes",
        url: "/requete",
        icon: AlignLeft,
        isActive: pathname.startsWith("/requete"),
      },
      {
        title: "Brouillons",
        url: "/draft",
        icon: BookDashed,
        isActive: pathname.startsWith("/draft"),
        badge: draftCount,
      },
      {
        title: "Factures",
        url: "/facture",
        icon: FileChartPie,
        isActive: pathname.startsWith("/facture"),
      },
      {
        title: "Vidéos & astuces",
        url: "/video",
        icon: FileChartPie,
        isActive: pathname.startsWith("/video"),
      },
      {
        title: "Formations",
        url: "/formationuser",
        icon: FileArchive,
        isActive: pathname === "/formationuser",
      },
      {
        title: "Questions fréquentes",
        url: "/frequents",
        icon: MessageCircleQuestion,
        isActive: pathname.startsWith("/frequents"),
      },
      {
        title: "Importations",
        url: "/importation",
        icon: AppWindow,
        isActive: pathname === "/importation",
      },
    ],
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Link href="/" className="crm-brand">
          <span className="crm-brand-mark">M</span>
          <span>
            <strong>Malisystem</strong>
            <small>Relation client & facturation</small>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavItems items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
