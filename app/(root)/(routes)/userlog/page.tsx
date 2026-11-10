"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HeaderPage from "@/components/features/header-page";
import { Button } from "@/components/ui/button";

type AuditRow = {
  id: string; action: string; entity: string | null; entityId: string | null;
  route: string | null; details: string | null; timestamp: string;
  actorUsername: string | null;
};
type AuditPage = { logs: AuditRow[]; total: number; page: number; pageSize: number };
const actions = ["CREATE", "UPDATE", "DELETE", "READ", "CLOSE", "LOGIN", "LOGOUT"];
const translations: Record<string, string> = {
  CREATE: "Création", UPDATE: "Modification", DELETE: "Suppression",
  READ: "Consultation", CLOSE: "Clôture", LOGIN: "Connexion", LOGOUT: "Déconnexion",
};
export default function UserLogPage() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [all, setAll] = useState(false);
  const query = useQuery<AuditPage>({
    queryKey: ["audit-logs", page, action, entity, all],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "30" });
      if (action) params.set("action", action);
      if (entity.trim()) params.set("entity", entity.trim());
      if (all) params.set("all", "true");
      const res = await fetch("/api/userlog?" + params);
      if (!res.ok) throw new Error(res.status === 403 ? "Accès administrateur requis" : "Chargement impossible");
      return res.json();
    },
  });
  return <div className="crm-workspace">
    <HeaderPage chemins={[{ title: "Journal d’activité", url: "/userlog" }]} />
    <div className="crm-list-page space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Historique des activités</h1>
        <p className="text-sm text-muted-foreground">Actions enregistrées automatiquement côté serveur.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select className="rounded-md border p-2 text-sm" value={action} onChange={(e) => { setPage(1); setAction(e.target.value); }}>
          <option value="">Toutes les actions</option>
          {actions.map((a) => <option key={a} value={a}>{translations[a]}</option>)}
        </select>
        <input className="rounded-md border p-2 text-sm" placeholder="Module : Client, Requete..." value={entity} onChange={(e) => { setPage(1); setEntity(e.target.value); }} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={all} onChange={(e) => { setPage(1); setAll(e.target.checked); }} />
          Tous les utilisateurs (administrateur)
        </label>
      </div>
      {query.isPending ? <p>Chargement des activités…</p> :
        query.isError ? <p role="alert" className="text-red-600">{query.error.message}</p> :
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left"><th className="p-3">Date et heure</th><th className="p-3">Utilisateur</th><th className="p-3">Action</th><th className="p-3">Module</th><th className="p-3">ID</th><th className="p-3">Détails</th></tr></thead>
            <tbody>{query.data.logs.map((log) => <tr key={log.id} className="border-b">
              <td className="p-3 whitespace-nowrap">{new Date(log.timestamp).toLocaleString("fr-FR", { timeZone: "Africa/Bamako" })}</td>
              <td className="p-3">{log.actorUsername || "Ancien compte"}</td>
              <td className="p-3">{translations[log.action] || log.action}</td>
              <td className="p-3">{log.entity || "—"}</td>
              <td className="p-3 font-mono text-xs">{log.entityId || "—"}</td>
              <td className="p-3">{log.details || log.route || "—"}</td>
            </tr>)}</tbody>
          </table>
          {!query.data.logs.length && <p className="p-5 text-center text-muted-foreground">Aucune activité pour ce filtre.</p>}
        </div>}
      {query.data && <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{query.data.total} événement(s) • page {page} sur {Math.max(1, Math.ceil(query.data.total / query.data.pageSize))}</p>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Précédent</Button>
          <Button variant="outline" disabled={page * query.data.pageSize >= query.data.total} onClick={() => setPage(page + 1)}>Suivant</Button>
        </div>
      </div>}
    </div>
  </div>;
}
