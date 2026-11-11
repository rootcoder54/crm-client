"use client";
import "./crm.css";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { ActivityPageTracker } from "@/components/audit/activity-page-tracker";

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ActivityPageTracker />
      <SidebarProvider
        className="crm-shell"
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="floating" />
        <SidebarInset>
          <div className="min-h-screen min-w-0 p-3 md:p-5">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
