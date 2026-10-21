import Link from "next/link";
import type { ReactNode } from "react";
export default function SupportHero({
  eyebrow,
  title,
  description,
  children,
  back,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <section className="ms-hero">
      <div className="ms-container">
        {back && (
          <Link className="ms-back" href={back.href}>
            ← {back.label}
          </Link>
        )}
        <div className="ms-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {children}
      </div>
    </section>
  );
}
