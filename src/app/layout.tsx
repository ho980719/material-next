import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ClientBootstrap from "@/components/common/ClientBootstrap";
import Sidebar from "@/components/common/Sidebar";
import ToastArea from "@/components/common/ToastArea";
import MobileNavbar from "@/components/common/MobileNavbar";
import GlobalLoading from "@/components/common/GlobalLoading";
import { Suspense } from "react";
import {NetworkStatusProvider} from "@/app/contenxt/NetworkStatusContext";
import OfflineIndicator from "@/components/common/OfflineIndicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "자재 관리 앱",
  description: "오프라인을 지원하는 자재 관리 앱",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <NetworkStatusProvider>
        <ClientBootstrap />
        <MobileNavbar />
        <Suspense fallback={null}>
          <GlobalLoading />
        </Suspense>
        <div className="d-flex" style={{ minHeight: "100vh" }}>
          <Sidebar />
          <main className="flex-grow-1">
            <div className="container py-3 py-md-3 px-3 px-md-3">{children}</div>
          </main>
        </div>
        <ToastArea />
        <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('Service Worker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('Service Worker registration failed: ', err);
                  });
                });
              }
            `,
            }}
        />
        <OfflineIndicator />
      </NetworkStatusProvider>
      </body>
    </html>
  );
}
