"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from "@/components/ui/item";
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

const Page = () => {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);
  return (
    <div>
      <div className="flex flex-col py-6 px-8 gap-y-9 container">
        <h2 className="text-3xl text-zinc-700 font-bold">
          Notre bibliothèque de support pour vous aider à mieux utiliser nos
          solutions
        </h2>
      </div>
      <div className="flex flex-col gap-y-6 container px-8 pb-8">
        {listes.map((item, index) => (
          <Link
            key={index}
            href={item.lien}
            target={item.blank ? "_blank" : ""}
            className="group"
          >
            <Item variant="outline" className="hover:bg-blue-400/10 group-hover:border-blue-400">
              <ItemMedia variant="image">
                <Image src={item.image} alt="logo" width={30} height={30} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-lg group-hover:text-blue-500">
                  {item.titre}
                </ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </ItemContent>
            </Item>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
