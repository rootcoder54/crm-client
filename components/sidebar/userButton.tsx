"use client";
import * as React from "react";
import { useSession } from "next-auth/react";

import {
  BookUser,
  HelpCircle,
  LogOut,
  Settings,
  User,
  UserPlus,
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
              <SidebarMenuButton className="w-fit px-1.5 cursor-pointer">
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
                <Link href={"/register/" + session.user.id}>
                  <DropdownMenuItem className="cursor-pointer">
                    <User />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href={"/userlog"}>
                  <DropdownMenuItem className="cursor-pointer">
                    <BookUser />
                    <span>User Log</span>
                  </DropdownMenuItem>
                </Link>
                <Link href={"/setting"}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings />
                    <span>Parametres</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Users />
                  <span>Mes Taches</span>
                </DropdownMenuItem>
                <Link href={"/register"}>
                  <DropdownMenuItem>
                    <UserPlus />
                    <span>New User</span>
                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <a href={"/support"}>
                <DropdownMenuItem className="cursor-pointer">
                  <HelpCircle />
                  <span>Support</span>
                </DropdownMenuItem>
              </a>
              <DropdownMenuSeparator />
              <Link href={"/logout"}>
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut />
                  <span>Deconnexion</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
