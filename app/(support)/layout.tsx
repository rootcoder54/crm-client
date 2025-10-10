"use client";
import { useTheme } from "next-themes";
import Navbar from "./_components/Navbar";
import { useEffect } from "react";


const SupportLayout = ({ children }: { children: React.ReactNode }) => {
    const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);
  return (
    <div className="min-h-screen flex flex-col items-center gap-y-4">
      <Navbar />
      {children}
    </div>
  );
};

export default SupportLayout;
