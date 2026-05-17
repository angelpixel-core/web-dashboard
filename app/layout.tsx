import "./globals.css";
import type { Metadata } from "next";
import { Source_Sans_3, Space_Grotesk } from "next/font/google";

const bodyFont = Source_Sans_3({ subsets: ["latin"], variable: "--font-body" });
const headingFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "FinOps Workflow Monitor",
  description: "T7 dashboard MVP for workflow verification"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>{children}</body>
    </html>
  );
}
