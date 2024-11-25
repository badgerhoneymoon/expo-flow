import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lead Management",
  description: "B2B Lead Management Tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-4">
              <Link 
                href="/company-profile" 
                className="text-sm font-medium hover:text-primary"
              >
                Company Profile
              </Link>
              <Link 
                href="/" 
                className="text-sm font-medium hover:text-primary"
              >
                Upload
              </Link>
              <Link 
                href="/leads" 
                className="text-sm font-medium hover:text-primary"
              >
                Leads
              </Link>
            </div>
          </div>
        </nav>
        {children}
        <Toaster 
          richColors 
          closeButton 
          position="top-center"
          expand={true}
          offset="80px"
        />
      </body>
    </html>
  );
}
