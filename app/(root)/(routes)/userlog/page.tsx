"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HeaderPage from "@/components/features/header-page";
import { Button } from "@/components/ui/button";
import {
  Activity, CheckCircle2, CirclePlus, Eye, FilePenLine,
  LogIn, LogOut, Search, Trash2, UserRound, X,
} from "lucide-react";

type AuditRow = {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  route: string | null;
  details: string | null;
  description: string;
  timestamp: string;
  actorUsername: string | null;
};
type AuditPage = { logs: AuditRow[]; total: number; page: number; pageSize: number };

const filters = [
  { value: "", label: "Toutes les activités" },
  { value: "READ", label: "Consultations" },
  { value: "CREATE", label: "Créations" },
  { value: "UPDATE", label: "Modifications" },
  { value: "DELETE", label: "Suppressions" },
  { value: "CLOSE", label: "Clôtures" },
  { value: "LOGIN", label: "Connexions" },
  { value: "LOGOUT", label: "Déconnexions" },
];

const actionInfo: Record<string, { label: string; icon: typeof Eye; color: string }> = {
  READ: { label: "Consultation", icon: Eye, color: "text-sky-600 bg-sky-50 dark:bg-sky-950/30" },
  CREATE: { label: "Création", icon: CirclePlus, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
  UPDATE: { label: "Modification", icon: FilePenLine, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
  DELETE: { label: "Suppression", icon: Trash2, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30" },
  CLOSE: { label: "Clôture", icon: CheckCircle2, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/30" },
  LOGIN: { label: "Connexion", icon: LogIn, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
  LOGOUT: { label: "Déconnexion", icon: LogOut, color: "text-slate-600 bg-slate-100 dark:bg-slate-800" },
};

function formattedDate(date: string) {
  return new Date(date).toLocaleString("fr-FR", {
    timeZone: "Africa/Bamako",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function UserLogPage() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [all, setAll] = useState(false);
  const [queryText, setQueryText] = useState("");

  const query = useQuery<AuditPage>({
    queryKey: ["audit-logs", page, action, entity, all],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "30" });
      if (action) params.set("action", action);
      if (entity) params.set("entity", entity);
      if (all) params.set("all", "true");
      const response = await fetch("/api/userlog?" + params);
      if (!response.ok) throw new Error(response.status === 403
        ? "Accès administrateur requis pour l’historique de l’équipe."
        : "Impossible de charger le journal d’activité.");
      return response.json();
    },
  });

  const displayed = query.data?.logs.filter((log) =>
    [log.description, log.actorUsername, log.entity].some((value) =>
      (value || "").toLocaleLowerCase("fr").includes(queryText.toLocaleLowerCase("fr").trim()),
    ),
  ) ?? [];

  return (
    <div className="crm-workspace">
      <HeaderPage chemins={[{ title: "Journal d’activité", url: "/userlog" }]} />
      <div className="crm-list-page space-y-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Historique des activités</h1>
          <p className="text-muted-foreground mt-1">
            Retrouvez qui a consulté, créé, modifié ou supprimé des informations dans le CRM.
          </p>
        </div>

        <div className="crm-panel space-y-4 rounded-xl border bg-card p-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                aria-label="Rechercher parmi les activités affichées"
                value={queryText}
                onChange={(event) => setQueryText(event.target.value)}
                placeholder="Rechercher une activité ou un utilisateur…"
                className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm"
              />
            </label>
            <select
              aria-label="Filtrer par action"
              className="rounded-md border bg-background px-3 py-2 text-sm"
              value={action}
              onChange={(event) => { setAction(event.target.value); setPage(1); }}
            >
              {filters.map((filter) =>
                <option key={filter.value} value={filter.value}>{filter.label}</option>,
              )}
            </select>
            <select
              aria-label="Filtrer par module"
              className="rounded-md border bg-background px-3 py-2 text-sm"
              value={entity}
              onChange={(event) => { setEntity(event.target.value); setPage(1); }}
            >
              <option value="">Tous les modules</option>
              {["Client", "Requete", "Facture", "Intervention", "Contact", "Contrat", "Base", "Logiciel", "UserRole", "Session"].map((value) =>
                <option key={value} value={value}>{value === "Requete" ? "Requêtes" : value === "UserRole" ? "Permissions" : value}</option>,
              )}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setQueryText(""); setAction(""); setEntity(""); setAll(false); setPage(1); }}
            >
              <X className="size-4" /> Effacer
            </Button>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={all} onChange={(event) => { setAll(event.target.checked); setPage(1); }} />
            Afficher les activités de tous les utilisateurs (administrateur)
          </label>
          <p className="text-xs text-muted-foreground">
            La recherche textuelle porte sur les {query.data?.logs.length ?? 0} activités chargées sur cette page.
          </p>
        </div>

        {query.isPending ? (
          <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">Chargement de l’historique…</div>
        ) : query.isError ? (
          <p role="alert" className="rounded-xl border p-5 text-destructive">{query.error.message}</p>
        ) : (
          <div className="crm-panel overflow-hidden rounded-xl border bg-card">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="flex items-center gap-2 font-semibold"><Activity className="size-5" /> Activités récentes</h2>
              <span className="text-sm text-muted-foreground">{query.data?.total ?? 0} événement(s)</span>
            </div>
            <div className="divide-y">
              {displayed.map((log) => {
                const info = actionInfo[log.action] ?? {
                  label: log.action, icon: Activity, color: "text-muted-foreground bg-muted",
                };
                const Icon = info.icon;
                return (
                  <div key={log.id} className="flex gap-3 p-4 hover:bg-muted/20">
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${info.color}`}>
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="font-medium leading-6 break-words">{log.description}</p>
                        <time className="shrink-0 text-xs text-muted-foreground" dateTime={log.timestamp}>
                          {formattedDate(log.timestamp)}
                        </time>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <UserRound className="size-3.5" />
                        <span>{log.actorUsername || "Utilisateur inconnu"}</span>
                        <span aria-hidden="true">·</span>
                        <span>{info.label}</span>
                        {log.entity && <><span aria-hidden="true">·</span><span>{log.entity === "Requete" ? "Requêtes" : log.entity}</span></>}
                      </div>
                    </div>
                  </div>
                );
              })}
              {!displayed.length && (
                <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                  Aucune activité ne correspond aux filtres sélectionnés.
                </div>
              )}
            </div>
          </div>
        )}

        {query.data && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Page {page} sur {Math.max(1, Math.ceil(query.data.total / query.data.pageSize))}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Précédent</Button>
              <Button variant="outline" disabled={page * query.data.pageSize >= query.data.total} onClick={() => setPage((value) => value + 1)}>Suivant</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
