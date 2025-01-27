"use client";
import CopyToClipboard from "@/utlis/AddClipboard";
import Link from "next/link";
import { useEffect, useState } from "react";
import tippy from "tippy.js";
import { useAccount, useBalance } from "wagmi";
const languages = ["English", "Español", "Deutsch"];
export default function Profile() {
  const [activeLanguage, setActiveLanguage] = useState(languages[0]);
  useEffect(() => {
    tippy("[data-tippy-content]");
    new CopyToClipboard();
  }, []);

  const { address } = useAccount();
  const balance = useBalance({
    address: address ? address : null,
  });
  console.log(balance);
  return (
    <div className="js-nav-dropdown group-dropdown relative">
      <button
        className="dropdown-toggle group ml-2 flex h-10 w-10 items-center justify-center rounded-full border border-jacarta-100 bg-white transition-colors hover:border-transparent hover:bg-accent focus:border-transparent focus:bg-accent dark:border-transparent dark:bg-white/[.15] dark:hover:bg-accent"
        id="profileDropdown"
        aria-expanded="false"
        data-bs-toggle="dropdown"
        aria-label="profile"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="h-4 w-4 fill-jacarta-700 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z" />
        </svg>
      </button>
      <div
        className="dropdown-menu group-dropdown-hover:visible lg:invisible !-right-4 !top-[85%] !left-auto z-10 hidden min-w-[14rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full group-dropdown-hover:opacity-100 dark:bg-jacarta-800 lg:absolute lg:grid lg:!translate-y-4 lg:py-4 lg:px-2 lg:opacity-0 lg:shadow-2xl"
        aria-labelledby="profileDropdown"
      >
        <button
          className="js-copy-clipboard my-4 flex select-none items-center whitespace-nowrap px-5 font-display leading-none text-jacarta-700 dark:text-white"
          data-tippy-content="Copy"
        >
          <span className="max-w-[10rem] overflow-hidden text-ellipsis">
            {address ? address : ""}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="ml-1 mb-px h-4 w-4 fill-jacarta-500 dark:fill-jacarta-300"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M7 7V3a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-4v3.993c0 .556-.449 1.007-1.007 1.007H3.007A1.006 1.006 0 0 1 2 20.993l.003-12.986C2.003 7.451 2.452 7 3.01 7H7zm2 0h6.993C16.549 7 17 7.449 17 8.007V15h3V4H9v3zM4.003 9L4 20h11V9H4.003z" />
          </svg>
        </button>

        <div className="mx-5 mb-6 rounded-lg border border-jacarta-100 p-4 dark:border-jacarta-600">
          <span className="text-sm font-medium tracking-tight dark:text-jacarta-200">
            Balance
          </span>
          <div className="flex items-center">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              x="0"
              y="0"
              viewBox="0 0 1920 1920"
              //   xml:space="preserve"
              className="-ml-1 mr-1 h-[1.125rem] w-[1.125rem]"
            >
              <path
                fill="#8A92B2"
                d="M959.8 80.7L420.1 976.3 959.8 731z"
              ></path>
              <path
                fill="#62688F"
                d="M959.8 731L420.1 976.3l539.7 319.1zm539.8 245.3L959.8 80.7V731z"
              ></path>
              <path
                fill="#454A75"
                d="M959.8 1295.4l539.8-319.1L959.8 731z"
              ></path>
              <path fill="#8A92B2" d="M420.1 1078.7l539.7 760.6v-441.7z"></path>
              <path fill="#62688F" d="M959.8 1397.6v441.7l540.1-760.6z"></path>
            </svg>
            <span className="text-lg font-bold text-green">
              {balance?.data?.formatted} {balance?.data?.symbol}
            </span>
          </div>
        </div>
        <Link
          href="/user/1"
          className="flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="h-4 w-4 fill-jacarta-700 transition-colors dark:fill-white"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z"></path>
          </svg>
          <span className="mt-1 font-display text-sm text-jacarta-700 dark:text-white">
            My Profile
          </span>
        </Link>
        <Link
          href="/edit-profile"
          className="flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="h-4 w-4 fill-jacarta-700 transition-colors dark:fill-white"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M9.954 2.21a9.99 9.99 0 0 1 4.091-.002A3.993 3.993 0 0 0 16 5.07a3.993 3.993 0 0 0 3.457.261A9.99 9.99 0 0 1 21.5 8.876 3.993 3.993 0 0 0 20 12c0 1.264.586 2.391 1.502 3.124a10.043 10.043 0 0 1-2.046 3.543 3.993 3.993 0 0 0-3.456.261 3.993 3.993 0 0 0-1.954 2.86 9.99 9.99 0 0 1-4.091.004A3.993 3.993 0 0 0 8 18.927a3.993 3.993 0 0 0-3.457-.26A9.99 9.99 0 0 1 2.5 15.121 3.993 3.993 0 0 0 4 11.999a3.993 3.993 0 0 0-1.502-3.124 10.043 10.043 0 0 1 2.046-3.543A3.993 3.993 0 0 0 8 5.071a3.993 3.993 0 0 0 1.954-2.86zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          </svg>
          <span className="mt-1 font-display text-sm text-jacarta-700 dark:text-white">
            Edit Profile
          </span>
        </Link>
      </div>
    </div>
  );
}
