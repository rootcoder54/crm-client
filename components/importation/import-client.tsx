"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Upload, XIcon } from "lucide-react";
import { RiFileExcel2Line } from "react-icons/ri";
import { toast } from "sonner";

const mainVariant = {
  initial: {
    x: 0,
    y: 0
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9
  }
};

export function ImportClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRetrait = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.warning("Veuillez sélectionner un fichier Excel");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const res = await fetch("/api/import/client", {
      method: "POST",
      body: formData
    });
    setLoading(false);

    const result = await res.json();
    if (!res.ok) {
      // 🟥 Erreur côté serveur (400, 500, etc.)
      if (result.colonnesManquantes) {
        toast.warning(
          `Le modèle du fichier n’est pas conforme. Colonnes manquantes : ${result.colonnesManquantes.join(
            ", "
          )}`
        );
      } else {
        toast.warning(
          result.message || "Erreur lors de l’importation du fichier"
        );
      }
      return;
    }

    // ✅ Cas succès
    if (result.lignesIgnorées && result.lignesIgnorées > 0) {
      toast.success(
        `Import partiel réussi : ${result.lignesImportées} lignes importées, ${result.lignesIgnorées} ignorées`
      );

      // Si tu veux afficher les détails des lignes ignorées :
      console.warn("Lignes ignorées :", result.detailsIgnorées);
    } else {
      toast.success(result.message || "Importation réussie !");
    }

    setFile(null);
    setOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(o) => setOpen(o)}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Import Client</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Importer des données Excel</AlertDialogTitle>
        </AlertDialogHeader>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <motion.div
              whileHover="animate"
              onClick={handleClick}
              className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden border border-dashed"
            >
              <Input
                id="file-upload-handle"
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
                <GridPattern />
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
                  Chargé le fichier Excel
                </p>
                <div className="relative w-full mt-10 max-w-xl mx-auto">
                  {file ? (
                    <motion.div
                      layoutId={"file-upload"}
                      className={cn(
                        "relative bg-white dark:bg-neutral-900 flex flex-col items-start justify-start p-4 mt-4 w-full mx-auto rounded-md",
                        "shadow-sm h-full group"
                      )}
                    >
                      <Button
                        type="button"
                        variant={"ghost"}
                        size={"icon"}
                        onClick={(e) => handleRetrait(e)}
                        className="hidden group-hover:flex absolute -top-2 -right-2 focus:ring-2 bg-zinc-500/10"
                      >
                        <XIcon />
                        <span className="sr-only">Close</span>
                      </Button>
                      <div className="flex justify-between w-full items-center gap-4">
                        <RiFileExcel2Line className="text-green-600 size-10" />
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                          className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                        >
                          {(file.size / 1024).toFixed(2)} KB
                        </motion.p>
                      </div>

                      <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                          className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                        >
                          {file.name}
                        </motion.p>

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                        >
                          modifié le{" "}
                          {new Date(file.lastModified).toLocaleDateString()}
                        </motion.p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      layoutId="file-upload"
                      variants={mainVariant}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                      className={cn(
                        "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                        "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                      )}
                    >
                      <Upload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
            <AlertDialogFooter className="flex flex-row items-start justify-start">
              <div className="flex flex-row gap-2">
                <Button
                  variant={"destructive"}
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Annuler
                </Button>
                <Link href={"/download/client.xlsx"}>
                  <Button variant={"secondary"}>Exemple d&apos;import</Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? "Importation..." : "Importer"}
                </Button>
              </div>
            </AlertDialogFooter>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
