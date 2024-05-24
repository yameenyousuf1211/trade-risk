import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/context/ReactQueryProvider";
import { Poppins, Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthProvider";
const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Trade Risk",
  description: "Trade Risk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ReactQueryProvider>
        <AuthProvider>
          <body className={`${poppins.className} ${roboto.variable}`}>
            {children}
          </body>
          <Toaster position="top-right" />
        </AuthProvider>
      </ReactQueryProvider>
    </html>
  );
}
