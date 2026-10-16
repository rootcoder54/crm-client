import HeaderPage from "@/components/features/header-page";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const PageFormation = () => {
  return (
    <div>
      <HeaderPage
        chemins={[
          { title: "Formation", url: "/admin/formationuser" },
          { title: "User", url: "/admin/formationuser" }
        ]}
      >
        <Link href={"#"}>
          <Button size={"sm"}>
            <PlusCircle /> Nouvelle Formation
          </Button>
        </Link>
      </HeaderPage>
      <p>Page Formation</p>
    </div>
  );
};

export default PageFormation;
