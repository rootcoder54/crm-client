import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@/components/ui/empty";
import Link from "next/link";

export default function EmptyInputGroup() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="text-xl">
            Erreur 404 - Page non trouvé
          </EmptyTitle>
          <EmptyDescription className="text-lg">
            La page que vous recherchez n&apos;existe pas. Vérifiez l&apos;URL
            ou revenez à la page précédente.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <EmptyDescription className="text-lg">
            Besoin d&apos;aide ? <Link href="/support">Contact support</Link>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  );
}
