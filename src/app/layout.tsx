import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "cyrillic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bysynapso.vercel.app"),

  title: {
    default: "BySynapso – Next-Generation AI Assistant",
    template: "%s | BySynapso",
  },

  description:
    "BySynapso is a next-generation AI platform designed for intelligent conversations, coding, writing, research, translation, and productivity. Experience fast, secure, and powerful artificial intelligence in one place.",

  keywords: [
    "BySynapso",
    "AI",
    "AI Assistant",
    "Artificial Intelligence",
    "Chat AI",
    "ChatGPT Alternative",
    "Claude Alternative",
    "AI Chatbot",
    "Coding AI",
    "AI Writer",
    "Machine Learning",
    "LLM",
    "Productivity",
    "Next.js",
    "Open Source AI",
  ],

  authors: [{ name: "BySynapso Team" }],
  creator: "BySynapso",
  publisher: "BySynapso",
  applicationName: "BySynapso",
  category: "Technology",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "BySynapso",
    url: "https://bysynapso.vercel.app",
    title: "BySynapso – Next-Generation AI Assistant",
    description:
      "Your intelligent AI assistant for chatting, coding, writing, research, and productivity.",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BySynapso AI",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "BySynapso – Next-Generation AI Assistant",
    description:
      "Powerful AI for coding, writing, research, and intelligent conversations.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch.png",
        sizes: "180x180",
      },
    ],
    shortcut: "/favicon.ico",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
