"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SidebarMenuButton } from "../ui/sidebar";
import { Search } from "lucide-react";
import { useState } from "react";

export const SearchButton = () => {
  const [filter, setFilter] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <Search />
          Recherche
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <div className="flex items-center border-b px-3">
          <DialogTitle />
          <Search className="mr-2 h-8 w-8 shrink-0 opacity-50" />
          <Input
            type="text"
            placeholder="recherche..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex h-11 w-full rounded-md border-0 bg-transparent py-3 text-lg outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="flex flex-col">
          {!filter ? (
            <div className="flex justify-center items-center p-5 w-full">
              <span>Taper</span>
            </div>
          ) : (
            <div className="flex justify-center items-center p-5 w-full">
              <span>{filter}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
