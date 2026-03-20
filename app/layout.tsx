import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const manrope = Manrope({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap" 
});

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap" 
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Research OS",
  description: "Operating system for cross-disciplinary research execution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.variable} ${ibmPlexMono.variable} ${sourceSerif.variable} font-sans selection:bg-primary/20 selection:text-primary antialiased`}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
