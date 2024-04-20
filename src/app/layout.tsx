import { Inter } from "next/font/google";
import "@mantine/core/styles.css";
import { ColorSchemeScript } from "@mantine/core";
import Providers from "@/app/components/Providers";
import MainAppShell from "@/app/components/MainAppShell";
import { Metadata } from "next";
import { Suspense } from "react";
import Loading from "@/app/loading";

import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIESEC One",
  description:
    "All in one platform to manage opportunities, resources, and members of AIESEC in Sri Lanka."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <title>AIESEC One</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
      </head>

      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
          <Providers>
            <MainAppShell>{children}</MainAppShell>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
