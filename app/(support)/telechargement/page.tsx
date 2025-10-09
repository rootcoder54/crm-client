//import { logiciels } from "@/data/type/logiciels";
import Image from "next/image";
import { DownloadTab } from "../_components/download";

const Page = () => {
  return (
    <div className="flex-1 w-full">
      <div className="flex flex-col">
        <div className="bg-zinc-100 flex flex-row items-center justify-center">
          <div className="flex flex-row items-center p-5">
            <Image
              src={"/rhpaie.png"}
              alt="RHPaie"
              className="size-16 bg-white rounded-circle"
              width={500}
              height={100}
            />
            <div className="flex flex-col ml-5">
              <h1 className="text-3xl font-bold">RHPaie</h1>
              <p className="text-lg">
                Logiciel de paie et gestion du personnel
              </p>
              <a
                href="https://malisystem.com/fonctionnalite.php"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Visiter le site officiel
              </a>
              <div>
                <a
                  href="https://malisystem.com/download/RHPaie_15.exe"
                  className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  download
                >
                  Télécharger RHPaie v15 - 2715.246.202411.4
                </a>
              </div>
            </div>
          </div>
        </div>
        <DownloadTab />
      </div>
    </div>
  );
};

export default Page;
