import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import "./globals.css";

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
  metadataBase: new URL("https://asiliko.vercel.app"),

  title: {
    default: "Asiliko – Next-Generation AI Assistant",
    template: "%s | Asiliko",
  },

  description:
    "Asiliko is a next-generation AI platform designed for intelligent conversations, coding, writing, research, translation, and productivity. Experience fast, secure, and powerful artificial intelligence in one place.",

  keywords: [
    "Asiliko",
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
    "ai chat",
    "ai",
    "asiliko ai login",
    "asiliko website",
    "chat asiliko",
    "chat",
    "chatai",
    "asiliko chat",
    "asiliko login",
    "chat",
    "asiliko",
  ],

  authors: [{ name: "Asilbek Egamnazarov" }],
  creator: "Asilbek Egamnazarov",
  publisher: "Asiliko",
  applicationName: "Asiliko",
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
    siteName: "Asiliko",
    url: "https://asiliko.vercel.app",
    title: "Asiliko – Next-Generation AI Assistant",
    description:
      "Your intelligent AI assistant for chatting, coding, writing, research, and productivity.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Asiliko – Next-Generation AI Assistant",
    description:
      "Powerful AI for coding, writing, research, and intelligent conversations.",
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
  const newLocal =
    "h-[calc(100vh-16px)] rounded-lg lg:bg-card lg:border shadow-sm py-2.5 pr-5 overflow-hidden";
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geist.variable,
        jetbrainsMono.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute={"class"}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="py-2 pr-2">
                <main className={newLocal}>{children}</main>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
