"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const noLayoutRoutes = ["/login", "/register"];
  const hideLayout = noLayoutRoutes.includes(pathname);

  return (
    <html lang="en">
      <body>
        {!hideLayout && <Header />}

        <div className={hideLayout ? "" : "page-container"}>
          {children}
        </div>

        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}
