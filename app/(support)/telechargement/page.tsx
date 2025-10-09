//import { logiciels } from "@/data/type/logiciels";
import Image from "next/image";

const Page = () => {
  return (
    <div className="flex-1 w-full">
      <div className="flex flex-col">
        <div className="bg-zinc-100 flex flex-row justify-center">
          <div className="w-3/4 flex">
            <Image src={"/rhpaie.png"} alt="RHPaie" width={100} height={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
