import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { TanstackProvider } from "@/components/organisms";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IELTS TESTING",
    template: `%s - IELTS TESTING`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} antialiased m-0 p-0 box-border pb-20`}
      >
        <TanstackProvider>
          <main>{children}</main>
        </TanstackProvider>
      </body>
    </html>
  );
}
