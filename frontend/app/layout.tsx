import type { Metadata } from "next";
import {
  Baskervville,
  Gowun_Batang,
  Inria_Sans,
  Open_Sans,
  Poppins,
  Quicksand,
} from "next/font/google";
// style
import "@/styles/globals.css";
// components
import Navbar from "@/components/Navbar";
import Providers from "./provider";
// slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// faw icon
// loader
//
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import ReduxProvider from "@/redux/provider";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeSwitch from "@/components/ThemeSwitch";
import MainLayout from "@/layouts/MainLayout";
import { AOSInit } from "@/components/aos";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
config.autoAddCss = false;

// fonts
const basker = Quicksand({
  subsets: ["latin"],
  weight: "400",
  style: ["normal"],
  display: "swap",
  preload: true,
});

// metadata
export const metadata: Metadata = {
  title: "HNE-commerce",
  description: "HNE-commerce",
  icons: "/icon.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={basker.className}>
      <body className={`bg-light-bg dark:bg-dark-bg relative`}>
        <ReduxProvider>
          <AOSInit />
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
        </ReduxProvider>
      </body>
    </html>
  );
}
