"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { SidebarMenuButton } from "../ui/sidebar";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "../ui/input-group";

export const SearchButton = () => {
  const [filter, setFilter] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton className="cursor-pointer">
          <Search />
          Recherche
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-[825px]">
        <div className="flex items-center">
          <DialogTitle />
          <InputGroup>
            <InputGroupInput
              type="text"
              placeholder="recherche..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">12 resultats</InputGroupAddon>
          </InputGroup>
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
