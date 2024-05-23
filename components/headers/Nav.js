"use client";
import { create } from "@/data/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Profile from "./Profile";
import { useAccount, useBalance } from "wagmi";
import { useEffect } from "react";
import tippy from "tippy.js";
import CopyToClipboard from "@/utlis/AddClipboard";

export default function Nav() {
  const pathname = usePathname();
  const isActiveParentMenu = (menus) => {
    return menus.some(
      (elm) => elm.href.split("/")[1] == pathname.split("/")[1]
    );
  };
  useEffect(() => {
    tippy("[data-tippy-content]");
    new CopyToClipboard();
  }, []);
  const { address } = useAccount();
  const balance = useBalance({
    address: address ? address : null,
  });
  return (
    <>
      <li className="js-nav-dropdown group relative">
        <Link
          href="/"
          className={`flex items-center justify-between py-3.5 font-display text-base  ${
            "/".split("/")[1] == pathname.split("/")[1]
              ? "text-accent dark:text-accent"
              : "text-jacarta-700 dark:text-white"
          }  hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent lg:px-5`}
        >
          Home
        </Link>
      </li>
      <li className="group">
        <Link
          href="/collections"
          className={`flex items-center justify-between py-3.5 font-display text-base  ${
            "/create".split("/")[1] == pathname.split("/")[1]
              ? "text-accent dark:text-accent"
              : "text-jacarta-700 dark:text-white"
          }  hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent lg:px-5`}
        >
          Explore
        </Link>
      </li>
      <li className="group">
        <Link
          href="/sandbox"
          className={`flex items-center justify-between py-3.5 font-display text-base  ${
            "/sandbox".split("/")[1] == pathname.split("/")[1]
              ? "text-accent dark:text-accent"
              : "text-jacarta-700 dark:text-white"
          }  hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent lg:px-5`}
          role="button"
        >
          Sandbox
        </Link>
      </li>
      <li className="js-nav-dropdown nav-item dropdown group relative">
        <Link
          href="/create"
          className="dropdown-toggle flex items-center justify-between py-3.5 font-display text-base text-jacarta-700 hover:text-accent focus:text-accent dark:text-white dark:hover:text-accent dark:focus:text-accent lg:px-5"
          id="navDropdown-3"
          aria-expanded="false"
          role="button"
          data-bs-toggle="dropdown"
        >
          Create
          <i className="lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="h-4 w-4 dark:fill-white"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" />
            </svg>
          </i>
        </Link>
        <ul
          className="dropdown-menu group-hover:visible lg:invisible -left-6 top-[85%] z-10 hidden grid-flow-col grid-rows-5 gap-x-4 whitespace-nowrap rounded-xl bg-white transition-all will-change-transform group-hover:opacity-100 dark:bg-jacarta-800 lg:absolute lg:!grid lg:translate-y-4 lg:py-8 lg:px-5 lg:opacity-0 lg:shadow-2xl lg:group-hover:translate-y-2"
          aria-labelledby="navDropdown-1"
        >
          {create.map((elm, i) => (
            <li key={i}>
              <Link
                href={elm.href}
                className="flex items-center rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
              >
                <span
                  className={`mr-3 rounded-xl bg-[${elm.bgColor}] p-[0.375rem]`}
                  style={{ backgroundColor: elm.bgColor }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className={`h-4 w-4 fill-[${elm.svgFill}]`}
                    style={{ fill: elm.svgFill }}
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d={elm.svgPath} />
                  </svg>
                </span>
                <span className="font-display text-sm text-jacarta-700 dark:text-white">
                  {elm.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </li>
      {address ? (
        <li className="js-nav-dropdown nav-item dropdown group relative block lg:hidden md:hidden">
          <Link
            href="/create"
            className="dropdown-toggle flex items-center justify-between py-3.5 font-display text-base text-jacarta-700 hover:text-accent focus:text-accent dark:text-white dark:hover:text-accent dark:focus:text-accent lg:px-5"
            id="navDropdown-3"
            aria-expanded="false"
            role="button"
            data-bs-toggle="dropdown"
          >
            Profile
            <i className="lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="h-4 w-4 dark:fill-white"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" />
              </svg>
            </i>
          </Link>
          <ul
            className="dropdown-menu group-hover:visible lg:invisible -left-6 top-[85%] z-10 hidden grid-flow-col grid-rows-5 gap-x-4 whitespace-nowrap rounded-xl bg-white transition-all will-change-transform group-hover:opacity-100 dark:bg-jacarta-800 lg:absolute lg:!grid lg:translate-y-4 lg:py-8 lg:px-5 lg:opacity-0 lg:shadow-2xl lg:group-hover:translate-y-2"
            aria-labelledby="navDropdown-1"
          >
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
                  <path
                    fill="#8A92B2"
                    d="M420.1 1078.7l539.7 760.6v-441.7z"
                  ></path>
                  <path
                    fill="#62688F"
                    d="M959.8 1397.6v441.7l540.1-760.6z"
                  ></path>
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
          </ul>
        </li>
      ) : null}
    </>
  );
}
