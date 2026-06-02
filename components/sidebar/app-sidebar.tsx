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
import { getNumberOfDraftRequetes } from "@/services/requete.service";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [draftCount, setdraftCount] = React.useState<string>();
  React.useEffect(() => {
    getNumberOfDraftRequetes().then((count) => {
      if (count !== 0) {
        setdraftCount(count + "");
      } else {
        setdraftCount(undefined);
      }
    });
  }, [draftCount, pathname]);
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
        title: "Licence",
        url: "/licence",
        icon: Copyright,
        isActive: pathname.startsWith("/licence")
      },
      {
        title: "Requête",
        url: "/requete",
        icon: AlignLeft,
        isActive: pathname.startsWith("/requete")
      },
      {
        title: "Requête Brouillon",
        url: "/draft",
        icon: BookDashed,
        isActive: pathname.startsWith("/draft"),
        badge: draftCount
      },
      {
        title: "Facture",
        url: "/facture",
        icon: FileChartPie,
        isActive: pathname.startsWith("/facture")
      },
      {
        title: "Video Astuce",
        url: "/video",
        icon: FileChartPie,
        isActive: pathname.startsWith("/video")
      },
      {
        title: "Formation User",
        url: "/formationuser",
        icon: FileArchive,
        isActive: pathname === "/formationuser"
      },
      {
        title: "Questions Frequents",
        url: "/frequents",
        icon: MessageCircleQuestion,
        isActive: pathname.startsWith("/frequents")
      },
      {
        title: "Importations",
        url: "/importation",
        icon: AppWindow,
        isActive: pathname === "/importation"
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
