import type { Metadata } from "next";
import { Anonymous_Pro } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from '@next/third-parties/google';

const anonymousPro = Anonymous_Pro({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-anonymous-pro",
});

export const metadata: Metadata = {
  title: "Jared Steven | AI Engineer",
  description: "AI Engineer specializing in Natural Language Processing and large-scale model deployment.",
  icons: {
    icon: "/Js.png",
  },
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
      <body className={`${anonymousPro.variable} font-sans antialiased selection:bg-accent-primary selection:text-accent-text`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
