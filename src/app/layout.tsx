import type { Metadata, Viewport } from "next";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "IZO PLUS — Penaplast Zavodi",
  description:
    "Sifatli EPS penaplast ishlab chiqarish: oq, qora va maydalangan penaplast. 7–20 kg/m³ zichlik, 1–60 sm qalinlik. Buyurtma: +998 99 513 22 22, Telegram @penaplast_uz",
  keywords: ["penaplast", "EPS", "пенопласт", "penaplast zavodi", "Uzbekistan", "izolyatsiya"],
  openGraph: {
    title: "IZO PLUS — Penaplast Zavodi",
    description:
      "Sifatli EPS penaplast ishlab chiqarish zavodi. Oq, qora va maydalangan penaplast — 7–20 kg/m³, 1–60 sm.",
    type: "website",
    locale: "uz_UZ",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#04070d" },
    { media: "(prefers-color-scheme: light)", color: "#f4f7fb" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeScript = `(function(){try{var t=localStorage.getItem('izoplus-theme');var dark=t? t==='dark' : true;document.documentElement.classList.toggle('dark',dark);}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
