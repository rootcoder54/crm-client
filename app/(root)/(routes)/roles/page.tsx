"use client";
import { useEffect, useState } from "react";
import HeaderPage from "@/components/features/header-page";
import { Button } from "@/components/ui/button";

type User = { id: string; name: string | null; username: string };
type Role = { id: string; userId: string; name: string; url: string | null; accessLevel: number };
const examples = [
  { name: "requete", url: "/requete" },
  { name: "client", url: "/client" },
  { name: "facture", url: "/facture" },
  { name: "intervention", url: "/intervention" },
  { name: "requete_delete", url: "/requete" },
  { name: "requete_edite", url: "/requete" },
  { name: "requete_cloture", url: "/requete" },
  { name: "requete_intervention", url: "/requete" },
];
export default function RolesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("requete");
  const [url, setUrl] = useState("/requete");
  const [level, setLevel] = useState(1);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() {
    const res = await fetch("/api/role/admin");
    if (!res.ok) { setError("Accès réservé aux administrateurs des permissions."); return; }
    const data = await res.json();
    setUsers(data.users); setRoles(data.roles);
    setUserId((current) => current || data.users[0]?.id || "");
  }
  useEffect(() => { void load(); }, []);
  async function save() {
    setBusy(true); setError("");
    const res = await fetch("/api/role/admin", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name, url, accessLevel: level }),
    });
    if (!res.ok) setError("Échec de l'enregistrement");
    else await load();
    setBusy(false);
  }
  async function remove(id: string) {
    if (!window.confirm("Retirer cette règle ?")) return;
    const res = await fetch("/api/role/admin", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }),
    });
    if (res.ok) await load(); else setError("Suppression impossible");
  }
  return <div className="crm-workspace">
    <HeaderPage chemins={[{ title: "Permissions", url: "/roles" }]} />
    <div className="crm-list-page space-y-5">
      <h1 className="text-2xl font-semibold">Rôles et autorisations</h1>
      <p className="text-sm text-muted-foreground">Les règles sont propres à chaque utilisateur. Sans règle, les anciens accès restent autorisés pour permettre une migration progressive.</p>
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <div className="rounded-lg border p-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">Utilisateur
          <select className="border rounded p-2" value={userId} onChange={(e) => setUserId(e.target.value)}>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name || u.username} ({u.username})</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm">Permission
          <select className="border rounded p-2" value={name} onChange={(e) => {
            const item = examples.find((i) => i.name === e.target.value);
            if (item) { setName(item.name); setUrl(item.url); }
          }}>{examples.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select>
        </label>
        <label className="grid gap-1 text-sm">Route URL
          <input className="border rounded p-2" value={url} onChange={(e) => setUrl(e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">Niveau d&apos;accès
          <select className="border rounded p-2" value={level} onChange={(e) => setLevel(Number(e.target.value))}>
            <option value={0}>0 — Refusé</option><option value={1}>1 — Lecture</option>
            <option value={2}>2 — Lecture et écriture</option><option value={3}>3 — Complet</option>
          </select>
        </label>
        <Button disabled={busy || !userId} onClick={save}>Enregistrer la permission</Button>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm"><thead><tr className="border-b text-left">
          <th className="p-3">Utilisateur</th><th className="p-3">Permission</th><th className="p-3">URL</th><th className="p-3">Niveau</th><th className="p-3">Action</th>
        </tr></thead><tbody>{roles.map((r) => <tr className="border-b" key={r.id}>
          <td className="p-3">{users.find((u) => u.id === r.userId)?.username ?? r.userId}</td>
          <td className="p-3">{r.name}</td><td className="p-3">{r.url || "—"}</td>
          <td className="p-3">{r.accessLevel}</td><td className="p-3">
            <Button size="sm" variant="outline" onClick={() => {
              setUserId(r.userId); setName(r.name); setUrl(r.url || "/"); setLevel(r.accessLevel);
            }}>Modifier</Button>{" "}
            <Button size="sm" variant="destructive" onClick={() => remove(r.id)}>Retirer</Button>
          </td>
        </tr>)}</tbody></table>
      </div>
    </div>
  </div>;
}
