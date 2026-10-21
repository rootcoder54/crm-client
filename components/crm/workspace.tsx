"use client";

import { ArrowUpRight, Inbox, RefreshCw, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function PageIntro({
  eyebrow = "MALISYSTEM · ESPACE DE GESTION",
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="crm-intro">
      <div>
        <p className="crm-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="crm-description">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function Metric({
  label,
  value,
  detail,
  icon: Icon,
  href,
  tone = "blue",
}: {
  label: string;
  value: ReactNode;
  detail: string;
  icon: LucideIcon;
  href?: string;
  tone?: "blue" | "green" | "amber" | "violet";
}) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="crm-metric-label">{label}</span>
        <span className={`crm-icon crm-icon-${tone}`}>
          <Icon size={20} />
        </span>
      </div>
      <div className="crm-metric-value">{value}</div>
      <div className="flex items-center justify-between gap-2">
        <p className="crm-metric-detail">{detail}</p>
        {href && <ArrowUpRight size={16} aria-hidden />}
      </div>
    </>
  );
  return href ? (
    <Link className="crm-metric crm-metric-link" href={href}>
      {content}
    </Link>
  ) : (
    <div className="crm-metric">{content}</div>
  );
}

export function FilterTabs({
  value,
  onChange,
  items,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  items: { value: string; label: string; count: number }[];
  label: string;
}) {
  return (
    <div className="crm-filter-tabs" role="group" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          aria-pressed={value === item.value}
          onClick={() => onChange(item.value)}
        >
          {item.label}
          <span>{item.count}</span>
        </button>
      ))}
    </div>
  );
}

export function StatusPill({
  done,
  children,
}: {
  done: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`crm-status ${done ? "crm-status-done" : "crm-status-open"}`}
    >
      <span aria-hidden />
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="crm-empty">
      <Inbox size={32} aria-hidden />
      <h3>{title}</h3>
      <p>{description}</p>
      {href && (
        <Button asChild variant="outline">
          <Link href={href}>{action}</Link>
        </Button>
      )}
    </div>
  );
}

export function QueryState({
  error,
  retry,
}: {
  error?: boolean;
  retry?: () => void;
}) {
  return error ? (
    <div className="crm-query-state" role="alert">
      <h2>Impossible de charger les données</h2>
      <p>Vérifiez votre connexion puis réessayez.</p>
      <Button variant="outline" onClick={retry}>
        <RefreshCw size={16} />
        Réessayer
      </Button>
    </div>
  ) : (
    <div className="crm-query-state" role="status">
      <RefreshCw className="animate-spin" size={24} />
      <p>Chargement de votre espace…</p>
    </div>
  );
}
