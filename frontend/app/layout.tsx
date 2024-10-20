import type { Metadata } from "next";
import { Baskervville, Gowun_Batang, Inria_Sans } from "next/font/google";
// style
import "@/styles/globals.css";
// components
import Navbar from "@/components/Navbar";
import Providers from "./provider";
// slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// faw icon
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import ReduxProvider from "@/redux/provider";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeSwitch from "@/components/ThemeSwitch";
import MainLayout from "@/layouts/MainLayout";
import { AOSInit } from "@/components/aos";
config.autoAddCss = false;

// fonts
const basker = Gowun_Batang({
  subsets: ["latin"],
  weight: "400",
  style: ["normal"],
  display: "swap",
  preload: true,
});

// metadata
export const metadata: Metadata = {
  title: "Furniture Store",
  description: "Furniture online store",
  icons: "/icon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <html lang="en" className={basker.className}>
        <AOSInit />
        <body className={`bg-light-bg dark:bg-dark-bg relative`}>
          <Providers>
            {children}
            <ToastContainer
              autoClose={2000}
              position="top-right"
              transition={Zoom}
              closeOnClick={true}
              pauseOnFocusLoss={false}
              limit={1}
            />
          </Providers>
        </body>
      </html>
    </ReduxProvider>
  );
}
