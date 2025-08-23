import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {  Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Zelos",
  description: "Sistemas chamados para o SENAI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
         <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
