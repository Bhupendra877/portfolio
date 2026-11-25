import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { profile } from "@/data/profile";
import "@/styles/globals.css";
import "@/styles/typography.css";
import "@/styles/animations.css";
import "@/styles/site.css";

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--f-sans", display: "swap" });

const title = `${profile.displayName} | ${profile.designation}`;
export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title,
  description: profile.summary,
  openGraph: { title, description: profile.summary, type: "website", siteName: profile.displayName },
  twitter: { card: "summary_large_image", title, description: profile.summary },
};
export const viewport: Viewport = { themeColor: "#f7f4f0" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable} data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
