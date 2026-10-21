"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Client } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ChevronsUpDown,
  Eye,
  FileText,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import HeaderPage from "@/components/features/header-page";
import { EmptyState, PageIntro } from "@/components/crm/workspace";
import { fetcher } from "@/lib/fetcher";
import { formatAmount } from "@/lib/crm-metrics";
import {
  invoiceDraftSchema,
  invoiceEditingSchema,
  invoiceTotals,
  type InvoiceDraft,
  type InvoiceLine,
} from "@/lib/invoice-draft";
import { saveInvoiceDraft } from "@/services/invoice-draft.service";
import { FactureView } from "./view-facture";

const STORAGE_KEY = "facture-form-draft";
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const emptyDraft = (): InvoiceDraft => ({
  clientId: "",
  date: today(),
  type: "FACTURE",
  devise: "CFA",
  modeReglement: "Espèce",
  observation: "",
  items: [],
});

export function FactureForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: clients = [],
    isPending,
    isError,
    refetch,
  } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => fetcher("/api/client"),
  });
  const [draft, setDraft] = useState<InvoiceDraft>(emptyDraft);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveLock = useRef(false);
  const [openClient, setOpenClient] = useState(false);
  const [preview, setPreview] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const client = clients.find((c) => c.id === draft.clientId);
  const totals = invoiceTotals(draft.items);
  const amount = (value: number) => formatAmount(value, draft.devise);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        // Preserve the previous editor's local drafts, including unfinished lines.
        const lines = saved.items ?? saved.itemFacture ?? [];
        const candidate = {
          ...emptyDraft(),
          ...saved,
          clientId: saved.clientId ?? "",
          date: saved.date?.slice(0, 10) || today(),
          items: lines.map((item: InvoiceLine) => ({
            reference: item.reference ?? "",
            description: item.description ?? "",
            quantity: Number(item.quantity ?? 1),
            unitPrice: Number(item.unitPrice ?? 0),
            remise: Number(item.remise ?? 0),
            tva: Number(item.tva ?? 18),
          })),
        };
        const parsed = invoiceEditingSchema.safeParse(candidate);
        if (parsed.success) setDraft(parsed.data);
        else
          toast.warning(
            "Le brouillon enregistré est invalide. Vérifiez les informations avant de recommencer.",
          );
      }
    } catch {
      setStorageAvailable(false);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || saveLock.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      setStorageAvailable(false);
    }
  }, [draft, hydrated]);

  const update = <K extends keyof InvoiceDraft>(
    key: K,
    value: InvoiceDraft[K],
  ) => setDraft((current) => ({ ...current, [key]: value }));
  const changeLine = (index: number, patch: Partial<InvoiceLine>) =>
    setDraft((current) => ({
      ...current,
      items: current.items.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  const addLine = () =>
    update("items", [
      ...draft.items,
      {
        reference: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        remise: 0,
        tva: 18,
      },
    ]);
  const reset = () => {
    if (window.confirm("Effacer le brouillon et toutes ses lignes ?"))
      setDraft(emptyDraft());
  };
  const save = async () => {
    if (saveLock.current) return;
    const result = invoiceDraftSchema.safeParse(draft);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    if (!client?.numero) {
      toast.error("Le client doit avoir un numéro dans sa fiche.");
      return;
    }
    saveLock.current = true;
    setSaving(true);
    try {
      const invoice = await saveInvoiceDraft(result.data);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* Saving the invoice succeeded even if browser storage is unavailable. */
      }
      await queryClient.invalidateQueries({ queryKey: ["factures"] });
      toast.success(`Facture ${invoice.numero} enregistrée`);
      router.push(`/facture/details/${invoice.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Enregistrement impossible. Votre brouillon est conservé.",
      );
      saveLock.current = false;
      setSaving(false);
    }
  };

  return (
    <div className="crm-workspace crm-invoice-editor">
      <HeaderPage
        chemins={[
          { title: "Factures", url: "/facture" },
          { title: "Nouvelle facture", url: "#" },
        ]}
      >
        <Button asChild variant="ghost">
          <Link href="/facture">Retour aux factures</Link>
        </Button>
      </HeaderPage>
      <div className="crm-page-content">
        <PageIntro
          eyebrow="FACTURATION · CRÉATION"
          title="Votre prochaine facture."
          description="Choisissez un client, ajoutez vos prestations et vérifiez le récapitulatif avant d’enregistrer."
        />
        <div className="crm-draft-notice">
          <FileText size={18} />
          <span>
            {storageAvailable
              ? "Brouillon conservé automatiquement sur cet appareil."
              : "Sauvegarde locale indisponible : gardez cette page ouverte jusqu’à l’enregistrement."}
          </span>
        </div>
        <fieldset disabled={saving || !hydrated} className="crm-invoice-layout">
          <div className="crm-invoice-main">
            <section className="crm-panel crm-form-section">
              <div className="crm-section-title">
                <span>01</span>
                <div>
                  <h2>Client et informations</h2>
                  <p>Les coordonnées associées à cette facture.</p>
                </div>
                <Users size={22} />
              </div>
              <div className="crm-form-grid">
                <div className="crm-field crm-field-wide">
                  <label id="invoice-client-label">Client *</label>
                  <Popover open={openClient} onOpenChange={setOpenClient}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-labelledby="invoice-client-label"
                        aria-expanded={openClient}
                        className="w-full justify-between h-11"
                        disabled={isPending || isError}
                      >
                        {client?.nomClient ||
                          (isPending
                            ? "Chargement…"
                            : "Sélectionner un client")}
                        <ChevronsUpDown size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[min(440px,calc(100vw-32px))] p-0"
                      align="start"
                    >
                      <Command>
                        <CommandInput placeholder="Rechercher un client…" />
                        <CommandList>
                          <CommandEmpty>Aucun client trouvé.</CommandEmpty>
                          <CommandGroup>
                            {clients.map((c) => (
                              <CommandItem
                                key={c.id}
                                value={`${c.nomClient} ${c.numero ?? ""}`}
                                onSelect={() => {
                                  update("clientId", c.id);
                                  setOpenClient(false);
                                }}
                              >
                                {c.nomClient}
                                {c.id === draft.clientId && (
                                  <Check className="ml-auto" size={16} />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {isError && (
                    <p role="alert">
                      Impossible de charger les clients.{" "}
                      <button
                        type="button"
                        className="underline"
                        onClick={() => void refetch()}
                      >
                        Réessayer
                      </button>
                    </p>
                  )}
                  {client && (
                    <p className="crm-field-hint">
                      N° {client.numero || "à compléter"} ·{" "}
                      {client.telephone || "Téléphone non renseigné"}
                    </p>
                  )}
                </div>
                <div className="crm-field">
                  <label htmlFor="invoice-date">Date de facturation *</label>
                  <Input
                    id="invoice-date"
                    type="date"
                    required
                    value={draft.date}
                    onChange={(e) => update("date", e.target.value)}
                  />
                </div>
                <div className="crm-field">
                  <label htmlFor="invoice-type">Type de document</label>
                  <select
                    id="invoice-type"
                    value={draft.type}
                    onChange={(e) =>
                      update("type", e.target.value as InvoiceDraft["type"])
                    }
                  >
                    <option value="FACTURE">Facture</option>
                    <option value="PROFORMA">Proforma</option>
                  </select>
                </div>
              </div>
            </section>
            <section className="crm-panel crm-form-section">
              <div className="crm-section-title">
                <span>02</span>
                <div>
                  <h2>Prestations et produits</h2>
                  <p>Quantités, tarifs, remises et taxes par ligne.</p>
                </div>
              </div>
              {!draft.items.length ? (
                <EmptyState
                  title="Ajoutez votre première prestation"
                  description="Une licence, une formation ou une intervention pour votre client."
                />
              ) : (
                <div className="crm-line-list">
                  {draft.items.map((line, index) => (
                    <div className="crm-invoice-line" key={index}>
                      <div className="crm-line-heading">
                        <strong>Ligne {index + 1}</strong>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Supprimer la ligne ${index + 1}`}
                          onClick={() =>
                            update(
                              "items",
                              draft.items.filter((_, i) => i !== index),
                            )
                          }
                        >
                          <Trash2 size={17} />
                        </Button>
                      </div>
                      <div className="crm-form-grid">
                        <div className="crm-field">
                          <label htmlFor={`ref-${index}`}>Référence</label>
                          <Input
                            id={`ref-${index}`}
                            value={line.reference}
                            placeholder="Référence (facultatif)"
                            onChange={(e) =>
                              changeLine(index, { reference: e.target.value })
                            }
                          />
                        </div>
                        <div className="crm-field">
                          <label htmlFor={`desc-${index}`}>Description *</label>
                          <Input
                            id={`desc-${index}`}
                            value={line.description}
                            placeholder="Ex. Assistance RHPaie"
                            onChange={(e) =>
                              changeLine(index, { description: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="crm-line-numbers">
                        {(
                          [
                            {
                              key: "quantity",
                              label: "Quantité",
                              min: 1,
                              step: 1,
                            },
                            {
                              key: "unitPrice",
                              label: "Prix unitaire HT",
                              min: 0,
                              step: 0.01,
                            },
                            {
                              key: "remise",
                              label: "Remise (%)",
                              min: 0,
                              max: 100,
                              step: 0.01,
                            },
                            {
                              key: "tva",
                              label: "TVA (%)",
                              min: 0,
                              max: 100,
                              step: 0.01,
                            },
                          ] as const
                        ).map((field) => (
                          <div className="crm-field" key={field.key}>
                            <label htmlFor={`${field.key}-${index}`}>
                              {field.label}
                            </label>
                            <Input
                              id={`${field.key}-${index}`}
                              type="number"
                              min={field.min}
                              max={"max" in field ? field.max : undefined}
                              step={field.step}
                              value={line[field.key]}
                              onChange={(e) =>
                                changeLine(index, {
                                  [field.key]:
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value),
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div className="crm-line-total">
                        Total TTC de la ligne{" "}
                        <strong>{amount(totals.lines[index].total)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 h-11 border-dashed"
                onClick={addLine}
              >
                <Plus size={18} />
                Ajouter une ligne
              </Button>
            </section>
            <section className="crm-panel crm-form-section">
              <div className="crm-section-title">
                <span>03</span>
                <div>
                  <h2>Règlement et observations</h2>
                  <p>Précisez les modalités de cette facture.</p>
                </div>
              </div>
              <div className="crm-form-grid">
                <div className="crm-field">
                  <label htmlFor="invoice-currency">Devise</label>
                  <select
                    id="invoice-currency"
                    value={draft.devise}
                    onChange={(e) =>
                      update("devise", e.target.value as InvoiceDraft["devise"])
                    }
                  >
                    <option value="CFA">FCFA</option>
                    <option value="EURO">Euro (EUR)</option>
                    <option value="USD">Dollar (USD)</option>
                  </select>
                </div>
                <div className="crm-field">
                  <label htmlFor="invoice-payment">Mode de règlement</label>
                  <select
                    id="invoice-payment"
                    value={draft.modeReglement}
                    onChange={(e) => update("modeReglement", e.target.value)}
                  >
                    {["Espèce", "Virement", "Cheque"].map((mode) => (
                      <option key={mode} value={mode}>
                        {mode === "Cheque" ? "Chèque" : mode}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="crm-field crm-field-wide">
                  <label htmlFor="invoice-note">Observations</label>
                  <Textarea
                    id="invoice-note"
                    placeholder="Informations complémentaires, modalités convenues avec le client…"
                    rows={4}
                    value={draft.observation}
                    onChange={(e) => update("observation", e.target.value)}
                  />
                </div>
              </div>
            </section>
          </div>
          <aside className="crm-invoice-summary">
            <div className="crm-panel crm-form-section">
              <p className="crm-eyebrow">RÉCAPITULATIF</p>
              <h2>Votre facture en un regard</h2>
              <p className="crm-field-hint">
                {draft.items.length} ligne(s) ·{" "}
                {client?.nomClient || "Aucun client sélectionné"}
              </p>
              <dl>
                <div>
                  <dt>Total HT brut</dt>
                  <dd>{amount(totals.totalHT)}</dd>
                </div>
                <div>
                  <dt>Remises</dt>
                  <dd>− {amount(totals.remise)}</dd>
                </div>
                <div>
                  <dt>TVA après remises</dt>
                  <dd>{amount(totals.totalTVA)}</dd>
                </div>
                <div className="crm-grand-total">
                  <dt>Total TTC</dt>
                  <dd aria-live="polite">{amount(totals.totalTTC)}</dd>
                </div>
              </dl>
              <p className="crm-field-hint mb-5">
                Le numéro définitif est attribué à l’enregistrement.
              </p>
              <Button
                type="button"
                className="w-full h-11"
                onClick={() => void save()}
                disabled={saving || isError || !draft.items.length || !client}
              >
                <Save size={18} />
                {saving ? "Enregistrement…" : "Enregistrer la facture"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-3 h-11"
                onClick={() => setPreview(true)}
                disabled={!client || !draft.items.length || !draft.date}
              >
                <Eye size={18} />
                Aperçu
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full mt-3 text-muted-foreground"
                onClick={reset}
              >
                <RotateCcw size={16} />
                Réinitialiser le brouillon
              </Button>
            </div>
          </aside>
        </fieldset>
      </div>
      <FactureView
        facture={{
          numero: "Brouillon",
          date: draft.date,
          type: draft.type,
          devise: draft.devise,
          client: client?.nomClient ?? "",
          clientId: client?.numero ?? "",
          items: draft.items.map((line, i) => ({
            ...line,
            total: totals.lines[i].total,
          })),
          totalHT: totals.totalHT,
          totalRemise: totals.remise,
          totalTVA: totals.totalTVA,
          totalTTC: totals.totalTTC,
        }}
        open={preview}
        close={() => setPreview(false)}
      />
    </div>
  );
}
