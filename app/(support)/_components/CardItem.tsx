import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const listes = [
  {
    titre: "Manuel d'utilisation de RHPaie",
    description: "Notre manuel pour vous aider à utiliser notre logiciel",
    image: "/rhpaie.png",
    lien: "https://malisystem.com/manual/RHPaie/index.html",
    blank: true
  },
  {
    titre: "Manuel d'utilisation de TimeSheet",
    description: "Notre manuel pour vous aider aavec votre pointage",
    image: "/timesheet.png",
    lien: "https://malisystem.com/manual/TMS/index.html",
    blank: true
  },
  {
    titre: "Manuel de calcul des taxes",
    description: "Les formules de calcul des taxes ITS AMO INPS ...",
    image: "/taxe.png",
    lien: "https://malisystem.com/assets/docs/taxe.pdf",
    blank: true
  },
  {
    titre: "Les Videos pratiques",
    description:
      "Pleines d'informations utiles pour vous aider à utiliser votre plateforme",
    image: "/astuce.png",
    lien: "/support/astuce",
    blank: false
  },
  {
    titre: "Vos questions fréquentes",
    description:
      "Les thématiques qui reviennent le plus souvent dans vos interrogations",
    image: "/question.png",
    lien: "/support/question",
    blank: false
  }
];

const CardItem = () => {
  return (
    <div className="flex flex-col gap-y-4">
      {listes.map((item, index) => (
        <Link key={index} href={item.lien} target={item.blank ? "_blank" : ""}>
          <Card className="flex items-center justify-start gap-x-4 p-6 hover:border-blue-400 hover:bg-blue-400/10 group cursor-pointer">
            <Image src={item.image} alt="logo" width={30} height={30} />
            <div className="flex flex-col gap-y-2">
              <CardTitle className="text-zinc-600 group-hover:text-blue-500 text-lg">{item.titre}</CardTitle>
              <CardDescription className="text-base">{item.description}</CardDescription>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CardItem;
