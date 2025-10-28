import HeaderPage from "@/components/features/header-page";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const PageFrequents = () => {
  return (
    <div>
      <HeaderPage>
        <Link href={"#"}>
          <Button size={"sm"} variant={"outline"}>
            <Plus /> Nouvelle Question
          </Button>
        </Link>
      </HeaderPage>
      <p>Page Question frequents</p>
    </div>
  );
};

export default PageFrequents;
