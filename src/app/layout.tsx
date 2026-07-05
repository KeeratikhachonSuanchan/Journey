import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Thai, IBM_Plex_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import { LocaleProvider } from "@/lib/i18n/context";
import { getLocale } from "@/lib/i18n/server";
import { ThemeProvider } from "@/lib/theme/context";
import { getTheme } from "@/lib/theme/server";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Journey",
  description: "Personal finance and self-development tracker",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const theme = await getTheme();

  return (
    <html
      lang={locale}
      className={`${plexSans.variable} ${plexSansThai.variable} ${plexMono.variable} h-full antialiased ${theme === "dark" ? "dark" : ""}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider initialTheme={theme}>
          <LocaleProvider locale={locale}>
            <Nav />
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
              {children}
            </main>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
