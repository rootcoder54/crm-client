import type { Metadata } from "next";
export const metadata: Metadata = {
  title: {default:"Administration | Mali System",template:"%s | Administration Mali System"},
  robots: {index:false,follow:false}
};
export default function AdminLayout({children}:{children:React.ReactNode}) {return children;}
