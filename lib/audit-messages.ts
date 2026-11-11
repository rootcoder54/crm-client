/**
 * Descriptions courtes des actions. Aucun mot de passe, contenu de document
 * ou détail sensible ne doit être journalisé.
 */
const entityLabels: Record<string, string> = {
  Client: "client", Requete: "requête", Facture: "facture",
  Contact: "contact", Base: "base", Contrat: "contrat",
  Logiciel: "logiciel", Intervention: "intervention",
  ItemIntervention: "ligne d'intervention",
  ItemFacture: "ligne de facture", User: "utilisateur",
  UserRole: "permission", Document: "document",
  Article: "article", Video: "vidéo",
};

const feminineEntities = new Set(["Requete", "Facture", "Base", "Intervention", "UserRole", "Video"]);
const pluralEntities: Record<string, string> = {
  Client: "Clients", Requete: "Requêtes", Facture: "Factures",
  Intervention: "Interventions", Contact: "Contacts",
  Contrat: "Contrats", Base: "Bases", Logiciel: "Logiciels",
  Document: "Documents", User: "Utilisateurs", UserRole: "Permissions",
  Video: "Vidéos", Article: "Articles",
};

function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.replace(/[\r\n\t]+/g, " ").trim().slice(0, 160);
  return text || null;
}

export function getAuditTitle(entity: string, value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const fields: Record<string, string[]> = {
    Requete: ["sujet"], Client: ["nomClient"], Facture: ["numero"],
    Contact: ["nom"], Base: ["societe"], Contrat: ["type"],
    Logiciel: ["nom"], Intervention: ["numero"], ItemFacture: ["libelle"],
    ItemIntervention: [], User: ["username"], UserRole: ["name"],
    Document: ["nom"], Video: ["nom"], Article: ["titre"],
  };
  for (const field of fields[entity] ?? []) {
    const title = clean(item[field]);
    if (title) return title;
  }
  return null;
}

export function auditMessage(
  action: string,
  entity: string | null | undefined,
  title?: string | null,
  legacyDetails?: string | null,
): string {
  if (action === "LOGIN") return "Connexion à l'application";
  if (action === "LOGOUT") return "Déconnexion de l'application";

  const label = entityLabels[entity ?? ""] ?? "élément";
  const feminine = feminineEntities.has(entity ?? "");
  const article = feminine ? "la" : "le";
  const safeTitle = clean(title);

  if (action === "READ") {
    if (safeTitle) return `Consultation de ${article} ${label} : ${safeTitle}`;
    return `Consultation de la page ${pluralEntities[entity ?? ""] ?? label}`;
  }

  const verb = ({
    CREATE: "Création", UPDATE: "Modification",
    DELETE: "Suppression", CLOSE: "Clôture",
  } as Record<string, string>)[action];
  if (!verb) return clean(legacyDetails) ?? action;

  const suffix = safeTitle ? ` : ${safeTitle}` : "";
  const prefix = action === "CLOSE" ? "Clôture" : verb;
  return `${prefix} de ${article} ${label}${suffix}`;
}

export function legacyAuditMessage(log: {
  action: string; entity: string | null;
  details: string | null; entityId: string | null;
}, title?: string | null): string {
  if (log.details?.startsWith("Consultation de la page ") ||
      log.details?.startsWith("Consultation de la requête :") ||
      log.details?.startsWith("Consultation du client :") ||
      log.details?.startsWith("Création de ") ||
      log.details?.startsWith("Modification de ") ||
      log.details?.startsWith("Suppression de ") ||
      log.details?.startsWith("Clôture de ") ||
      log.details === "Connexion à l'application" ||
      log.details === "Déconnexion de l'application") {
    return log.details;
  }
  return auditMessage(log.action, log.entity, title, log.details);
}
