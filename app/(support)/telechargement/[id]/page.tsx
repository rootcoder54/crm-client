import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logiciels } from "@/constante/logiciels";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const logiciel = logiciels.find((software) => software.id === id);
  if (!logiciel) return <div>Logiciel introuvable</div>;
  return (
    <div className="flex-1">
      <div>
        <Link href={"/telechargement"}>
          <Button variant="blue" className="m-4">
            <ArrowLeft />
            Retour
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center h-full py-8 px-4">
        <div className="flex flex-col gap-y-2 sm:w-full md:w-[700px] lg:w-[950px] xl:w-[1150px]">
          <div className="flex flex-col space-y-4">
            <Image
              src={logiciel.image}
              alt={logiciel.name}
              width={260}
              height={120}
              className="border"
            />
            <h1 className="text-3xl font-bold text-gray-800">
              Télécharger et installer le logiciel {logiciel.name}
            </h1>
          </div>
          <p className="mt-4 text-lg text-gray-600">
            {logiciel.description || "Description indisponible"}
          </p>
          <div className="flex flex-col mt-8 space-y-4">
            <span className="text-xl font-bold underline">Detail :</span>{" "}
            <div className="grid grid-cols-2 gap-6 bg-zinc-100 border-b-2 border-zinc-400 p-4">
              <div>
                <span className="text-lg font-semibold">
                  Version : <br />
                  <span className="text-lg font-normal">
                    {logiciel.version}
                  </span>
                </span>
              </div>

              <div>
                <span className="text-lg font-semibold">
                  Publier le : <br />
                  <span className="text-lg font-normal">{logiciel.date}</span>
                </span>
              </div>

              <div>
                <span className="text-lg font-semibold">
                  Telecharger : <br />
                  <span className="text-lg font-normal">
                    <a
                      className="hover:underline"
                      href={logiciel.telecharger || "#"}
                    >
                      {logiciel.name}.exe
                    </a>
                  </span>
                </span>
              </div>

              <div>
                <span className="text-lg font-semibold">
                  Taille : <br />
                  <span className="text-lg font-normal">
                    {logiciel.size || "Taille indisponible"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {logiciel.nouveaute && (
            <div className="flex flex-col mt-8 space-y-4">
              <span className="text-xl font-bold underline">Nouveautés :</span>{" "}
              <Accordion type="single" collapsible className="w-full">
                {logiciel.nouveaute.map((nouveaute, index) => (
                  <AccordionItem value={nouveaute.titre} key={index}>
                    <AccordionTrigger className="text-lg">
                      {index + 1} - {nouveaute.titre}
                    </AccordionTrigger>
                    <AccordionContent className="text-lg text-zinc-600 font-normal">
                      {nouveaute.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
