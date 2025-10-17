"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function ImportClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Veuillez sélectionner un fichier Excel");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const res = await fetch("/api/import/client", {
      method: "POST",
      body: formData
    });
    setLoading(false);

    const result = await res.json();
    alert(result.message);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Import Client</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Importer des données Excel</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-start justify-start sm:justify-start">
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                type="file"
                accept=".xlsx,.xls"
                className="cursor-pointer"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="flex flex-row gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Importation..." : "Importer"}
                </Button>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
              </div>
            </form>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
