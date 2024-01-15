import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner";

import { auth } from "@/auth";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Auth",
    default: "Auth",
  },
  description: "Dadauth Next Auth Guide",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster richColors expand />
        </body>
      </html>
    </SessionProvider>
  );
}
