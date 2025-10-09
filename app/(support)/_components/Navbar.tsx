import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { BadgeInfo, ClipboardList, Download, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const pathname = usePathname();
  const menus = [
    {
      name: "Formation",
      href: "/formation",
      isSelect: pathname.startsWith("/formation"),
      icon: <ClipboardList />
    },
    {
      name: "Telechargement",
      href: "/telechargement",
      isSelect: pathname.startsWith("/telechargement"),
      icon: <Download />
    },
    {
      name: "Support",
      href: "/support",
      isSelect: pathname.startsWith("/support"),
      icon: <BadgeInfo />
    }
  ];
  return (
    <div className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-sm flex justify-center items-center py-0">
      <div className="flex justify-between items-center w-full md:w-3/4 px-3 border-b-2 py-2">
        <div className="flex items-center gap-x-3">
          <Link
            href="https://malisystem.com/"
            className="flex items-center gap-1"
          >
            <Image
              src={"/msys.png"}
              alt="logo"
              width={54}
              height={45}
              className="dark:invert"
            />
            <div className="hidden lg:flex lg:flex-col xl:flex-row lg:items-center">
              <span className="font-bold text-2xl">MALI</span>
              <span className="font-bold text-yellow-500 text-2xl">SYSTEM</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-x-1">
          <div className="hidden lg:flex items-center gap-x-1">
            {menus.map((menu, index) => (
              <Link
                key={index}
                href={menu.href}
                className={cn(
                  buttonVariants({ variant: menu.isSelect ? "blue" : "ghost" })
                )}
              >
                {menu.icon}
                {menu.name}
              </Link>
            ))}
          </div>
          <div className="lg:hidden flex">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Menu />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px]">
                <div className="flex flex-col gap-y-2">
                  {menus.map((menu, index) => (
                    <Link
                      key={index}
                      href={menu.href}
                      className={cn(
                        buttonVariants({
                          variant: menu.isSelect ? "blue" : "ghost"
                        }),
                        "justify-start"
                      )}
                    >
                      {menu.icon}
                      {menu.name}
                    </Link>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Link href="/" className={buttonVariants({ variant: "gray" })}>
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
