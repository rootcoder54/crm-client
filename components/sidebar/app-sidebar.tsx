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
        url: "/admin",
        icon: Home,
        isActive: pathname === "/admin"
      },
      {
        title: "Employé",
        url: "/admin/employe",
        icon: Users,
        isActive: pathname === "/admin/employe"
      },
      {
        title: "Client",
        url: "/admin/client",
        icon: UserSquareIcon,
        isActive: pathname.startsWith("/admin/client")
      },
      {
        title: "Licence",
        url: "/admin/licence",
        icon: Copyright,
        isActive: pathname.startsWith("/admin/licence")
      },
      {
        title: "Requête",
        url: "/admin/requete",
        icon: AlignLeft,
        isActive: pathname.startsWith("/admin/requete")
      },
      {
        title: "Requête Brouillon",
        url: "/admin/draft",
        icon: BookDashed,
        isActive: pathname.startsWith("/admin/draft"),
        badge: draftCount
      },
      {
        title: "Facture",
        url: "/admin/facture",
        icon: FileChartPie,
        isActive: pathname.startsWith("/admin/facture")
      },
      {
        title: "Video Astuce",
        url: "/admin/video",
        icon: FileChartPie,
        isActive: pathname.startsWith("/admin/video")
      },
      {
        title: "Formation User",
        url: "/admin/formationuser",
        icon: FileArchive,
        isActive: pathname === "/admin/formationuser"
      },
      {
        title: "Questions Frequents",
        url: "/admin/frequents",
        icon: MessageCircleQuestion,
        isActive: pathname.startsWith("/admin/frequents")
      },
      {
        title: "Importations",
        url: "/admin/importation",
        icon: AppWindow,
        isActive: pathname === "/admin/importation"
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
