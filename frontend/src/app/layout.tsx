import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GrowthOS — AI Growth Operating System for E-Commerce",
    template: "%s | GrowthOS",
  },
  description:
    "GrowthOS gives D2C and e-commerce founders institutional-grade intelligence. Run 7 AI agents in parallel to diagnose your store, simulate strategies, and generate CEO-level reports.",
  keywords: [
    "e-commerce AI",
    "D2C growth",
    "store diagnosis",
    "AI agents",
    "ROAS optimization",
    "CAC reduction",
    "AOV optimization",
  ],
  openGraph: {
    title: "GrowthOS — AI Growth Operating System for E-Commerce",
    description: "Institutional-grade intelligence for D2C founders.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('growthos_theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');document.documentElement.setAttribute('data-theme','light');}else{document.documentElement.classList.remove('light');document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
