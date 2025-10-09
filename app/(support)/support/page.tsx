"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import Hero from "../_components/Hero";

const Page = () => {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);
  return (
    <div>
      <Hero />
    </div>
  );
};

export default Page;
