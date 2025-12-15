import type { Metadata } from "next";
import { Noto_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from '@next/third-parties/google';

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: "Jared Steven | AI Engineer",
  description: "AI Engineer specializing in Natural Language Processing and large-scale model deployment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${notoSerif.variable} antialiased selection:bg-accent-primary selection:text-accent-text`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
