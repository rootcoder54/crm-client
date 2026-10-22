import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  ContactRound,
  Database,
  FileClock,
  FileText,
  Inbox,
  KeyRound,
  ListChecks,
  Plus,
  ReceiptText,
  RotateCcw,
  SearchX,
  ShieldCheck,
  UsersRound,
  Video,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

const icons = {
  inbox: Inbox,
  clients: UsersRound,
  requests: ClipboardList,
  invoices: ReceiptText,
  contacts: ContactRound,
  contracts: FileText,
  databases: Database,
  interventions: Wrench,
  drafts: FileClock,
  employees: ShieldCheck,
  licenses: KeyRound,
  articles: BookOpen,
  videos: Video,
  logs: ListChecks,
};

export interface DataTableEmptyConfig {
  title: string;
  description: string;
  icon?: keyof typeof icons;
  action?: { label: string; href: string };
}

interface DataTableEmptyStateProps {
  filtered: boolean;
  config?: DataTableEmptyConfig;
  fallbackTitle?: string;
  onReset: () => void;
}

export function DataTableEmptyState({
  filtered,
  config,
  fallbackTitle,
  onReset,
}: DataTableEmptyStateProps) {
  const Icon = filtered ? SearchX : icons[config?.icon ?? "inbox"];
  const title = filtered
    ? "Aucun résultat pour ces critères"
    : (config?.title ?? fallbackTitle ?? "Votre tableau est encore vide");
  const description = filtered
    ? "Essayez un autre mot-clé ou réinitialisez les filtres pour retrouver vos données."
    : (config?.description ??
      "Les éléments enregistrés apparaîtront ici pour vous permettre de les retrouver et de les suivre facilement.");

  return (
    <Empty
      className="min-h-80 gap-5 rounded-none bg-linear-to-b from-muted/30 to-background px-5 py-12 whitespace-normal"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        aria-hidden="true"
        className="relative mb-2 flex size-20 items-center justify-center"
      >
        <div className="absolute inset-0 rotate-12 rounded-2xl border border-primary/10 bg-primary/5" />
        <div className="relative flex size-16 items-center justify-center rounded-2xl border bg-background text-primary shadow-sm">
          <Icon className="size-7" strokeWidth={1.6} />
        </div>
        {(filtered || config?.action) && (
          <span className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground">
            {filtered ? (
              <SearchX className="size-3" />
            ) : (
              <Plus className="size-3" />
            )}
          </span>
        )}
      </div>
      <EmptyHeader className="max-w-md gap-2.5">
        <EmptyTitle className="text-xl font-semibold text-foreground">
          {title}
        </EmptyTitle>
        <EmptyDescription className="text-sm leading-6">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      {filtered ? (
        <EmptyContent>
          <Button variant="outline" onClick={onReset}>
            <RotateCcw aria-hidden="true" />
            Réinitialiser les filtres
          </Button>
        </EmptyContent>
      ) : config?.action ? (
        <EmptyContent>
          <Button asChild>
            <Link href={config.action.href}>
              <Plus aria-hidden="true" />
              {config.action.label}
            </Link>
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
