import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Credex | AI Spend Audit",
  description: "Find out if your startup is overspending on AI tools. Free instant audit with actionable recommendations.",
  openGraph: {
    title: "Credex | AI Spend Audit",
    description: "Find out if your startup is overspending on AI tools. Free instant audit with actionable recommendations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Credex | AI Spend Audit",
    description: "Find out if your startup is overspending on AI tools.",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
