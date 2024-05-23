"use client";
import "../public/styles/style.css";
import "@rainbow-me/rainbowkit/styles.css";
import "../app/styles/globals.scss";
import "swiper/css";
import "tippy.js/dist/tippy.css";
import "react-modal-video/css/modal-video.css";
import BuyModal from "@/components/modals/BuyModal";
import BidModal from "@/components/modals/BidModal";
import ModeChanger from "@/components/common/ModeChanger";
import { Providers } from "./provider";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

if (typeof window !== "undefined") {
  // Import the script only on the client side
  import("bootstrap/dist/js/bootstrap.esm").then((module) => {
    // Module is imported, you can access any exported functionality here
  });
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        itemScope
        itemType="http://schema.org/WebPage"
        className={
          "overflow-x-hidden font-body text-jacarta-500 dark:bg-jacarta-900"
        }
      >
        <ProgressBar
          height="3px"
          color="#8358FF"
          options={{ showSpinner: true }}
          shallowRouting
        />
        <ModeChanger />
        <Providers>
          {children}
          {/* <BuyModal /> */}
          <BidModal />
        </Providers>
      </body>
    </html>
  );
}
