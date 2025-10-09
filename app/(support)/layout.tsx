"use client";
import Navbar from "./_components/Navbar";


const SupportLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col items-center gap-y-4">
      <Navbar />
      {children}
    </div>
  );
};

export default SupportLayout;
