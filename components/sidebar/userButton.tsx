"use client";
import * as React from "react";
import { useSession } from "next-auth/react";

import {
  Cloud,
  HelpCircle,
  LogOut,
  Plus,
  Settings,
  User,
  Users
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

export const UserButton = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {session?.user !== null && session?.user !== undefined && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="w-fit px-1.5">
                <span className="sr-only"> user </span>
                <div className="flex items-center justify-center rounded-md">
                  <Avatar className="size-7">
                    <AvatarImage
                      src={session.user.image || "/avatars/02.png"}
                      alt="user logo"
                    />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                </div>
                <span className="truncate font-semibold">
                  {session.user.name}
                </span>
                <ChevronDown className="opacity-50" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href={"/user"}>
                  <DropdownMenuItem className="cursor-pointer">
                    <User />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  <Settings />
                  <span>Parametres</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Users />
                  <span>Mes Taches</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Plus />
                  <span>New Team</span>
                  <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href="/support" className="flex w-full gap-2 items-center">
                  <HelpCircle />
                  <span>Support</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Cloud />
                <span>API</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href="/logout" className="flex w-full gap-2 items-center">
                  <LogOut />
                  <span>Deconnexion</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
