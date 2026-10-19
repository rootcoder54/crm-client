"use client";
import HeaderPage from "@/components/features/header-page";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

const themes = [
  {
    icon: <SunMoon />,
    nom: "Automatique",
    mode: "system"
  },
  {
    icon: <Sun />,
    nom: "Clair",
    mode: "light"
  },
  {
    icon: <Moon />,
    nom: "Sombre",
    mode: "dark"
  }
];

const SettingPage = () => {
  const { setTheme } = useTheme();
  return (
    <div>
      <HeaderPage
        chemins={[{ title: "Parametrage", url: "/setting" }]}
      ></HeaderPage>
      <div className="flex flex-col space-y-3 p-5">
        <h1 className="text-xl font-bold">Langue et apparence</h1>
        <div className="grid grid-rows-3 md:grid-cols-3 gap-4 md:w-[500px]">
          {themes.map((theme, index) => (
            <Item
              key={index}
              variant="outline"
              onClick={() => setTheme(theme.mode)}
              className="cursor-pointer"
            >
              <ItemContent>
                {theme.icon}
                <ItemTitle>{theme.nom}</ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
