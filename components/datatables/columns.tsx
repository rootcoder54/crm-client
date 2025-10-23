"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileImage } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

import Image from "next/image";

import { ColumnHeader } from "./columnHeader";

const isImageUrl = (url: string) => {
  return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
};
function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
// Fonction générique pour le rendu
const renderCell = (value: unknown) => {
  if (typeof value === "boolean") {
    return (
      <Badge variant={value ? "default" : "destructive"}>
        {value ? "Oui" : "Non"}
      </Badge>
    );
  }

  if (typeof value === "number") {
    return <span className="font-medium">{value.toLocaleString()}</span>;
  }

  if (value instanceof Date) {
    return <span>{format(value, "dd/MM/yyyy")}</span>;
  }

  if (typeof value === "string") {
    if (isImageUrl(value)) {
      if (!isValidUrl(value)) {
        return <FileImage />;
      }
      return (
        <Image
          src={value}
          alt={value}
          width={60}
          height={60}
          className="object-cover rounded-md"
        />
      );
    }
    const displayText = value.length > 30 ? value.slice(0, 30) + "..." : value;
    if (value.includes("@")) {
      return (
        <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
          {displayText}
        </a>
      );
    }
    if (value.length < 30) {
      return <span>{value}</span>;
    }
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{displayText}</span>
        </TooltipTrigger>
        <TooltipContent className="w-[560px] p-4">
          <p>{value}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
  if (React.isValidElement(value)) {
    return value;
  }

  return <span>-</span>;
};

export function generateColumns<T extends Record<string, unknown>>(
  data: T[],
  customStyles?: Record<string, (value: unknown, row: T) => React.ReactNode>
): ColumnDef<T>[] {
  if (data.length === 0) return [];

  const sample = data[0]; // on prend la première ligne comme modèle

  return Object.keys(sample).map((key) => {
    const firstNonNull = data.find((row) => row[key] != null)?.[key];

    const isDateColumn =
      firstNonNull instanceof Date ||
      (typeof firstNonNull === "string" &&
        !/^\d+$/.test(firstNonNull) && // 🔹 exclut les nombres purs
        firstNonNull.length >= 6 && // 🔹 évite les chaînes trop courtes
        !isNaN(Date.parse(firstNonNull)) && // 🔹 valide par Date.parse
        /[-/]/.test(firstNonNull)); // 🔹 doit contenir - ou /

    console.log(key, ":", isDateColumn);

    return {
      accessorKey: key,
      header: ({ column }) => {
        return (
          <ColumnHeader
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            column={column}
          />
        );
      },
      filterFn: isDateColumn ? "dateRange" : "auto",
      cell: ({ row, getValue }) => {
        const value = getValue();
        if (customStyles && customStyles[key]) {
          return customStyles[key](value, row.original);
        }
        return renderCell(value);
      }
    } as ColumnDef<T>;
  });
}

export function buildColumns<T extends Record<string, unknown>>(
  data: T[],
  customStyles?: Record<string, (value: unknown, row: T) => React.ReactNode>
): ColumnDef<T>[] {
  const dynamicCols = generateColumns(data, customStyles);

  return [
    {
      id: "select",
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    ...dynamicCols
  ];
}
