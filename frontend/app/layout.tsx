import type { Metadata } from "next";
import { Baskervville } from "next/font/google";
// style
import "@/styles/globals.css";
// components
import Navbar from "@/components/Navbar";
import Providers from "./provider";
// faw icon
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import ReduxProvider from "@/redux/provider";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/redux/store";
config.autoAddCss = false;

// fonts
const basker = Baskervville({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

// metadata
export const metadata: Metadata = {
  title: "Furniture Store",
  description: "Furniture online store",
  icons: "./icon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <html lang="en" className={basker.className}>
        <body className={`bg-bg-light dark:bg-bg-dark `}>
          <Providers>
            <Navbar />
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
