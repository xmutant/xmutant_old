/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";

import tippy from "tippy.js";
import Image from "next/image";
import { allCollections } from "@/data/collections";
import Link from "next/link";
export default function Profile({ id }) {
  const [loved, setLoved] = useState();
  const [item, setItem] = useState(allCollections[0]);

  useEffect(() => {
    const filteredItem = allCollections.filter((elm) => elm.id == id)[0];
    if (filteredItem) {
      setItem(filteredItem);
    }
    tippy("[data-tippy-content]");
  }, []);

  return (
    <section className="relative bg-light-base pb-12 pt-28 dark:bg-jacarta-800">
      <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <figure className="relative">
          <Image
            width={138}
            height={138}
            src={
              item.avatar
                ? item.avatar
                : "/img/collections/collection_avatar.jpg"
            }
            alt="collection avatar"
            className="rounded-xl border-[5px] border-white dark:border-jacarta-600"
          />
          <div
            className="absolute -right-3 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green dark:border-jacarta-600"
            data-tippy-content="Verified Collection"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="h-[.875rem] w-[.875rem] fill-white"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
            </svg>
          </div>
        </figure>
      </div>

      <div className="container">
        <div className="text-center">
          <h2 className="mb-2 font-display text-4xl font-medium text-jacarta-700 dark:text-white">
            {item.name ? item.name : "NFT Funny Cat"}
          </h2>
          <div className="mb-8">
            <span className="text-sm font-bold text-jacarta-400">
              Created by{" "}
            </span>
            <Link
              href={`/user/${item.id}`}
              className="text-sm font-bold text-accent"
            >
              051_Hart
            </Link>
          </div>

          <div className="mb-8 inline-flex flex-wrap items-center justify-center rounded-xl border border-jacarta-100 bg-white dark:border-jacarta-600 dark:bg-jacarta-800">
            <a
              href="#"
              className="w-1/2 rounded-l-xl border-r border-jacarta-100 py-4 hover:shadow-md dark:border-jacarta-600 sm:w-32"
            >
              <div className="mb-1 text-base font-bold text-jacarta-700 dark:text-white">
                7.2K
              </div>
              <div className="text-2xs font-medium tracking-tight dark:text-jacarta-400">
                Items
              </div>
            </a>
            <a
              href="#"
              className="w-1/2 border-jacarta-100 py-4 hover:shadow-md dark:border-jacarta-600 sm:w-32 sm:border-r"
            >
              <div className="mb-1 text-base font-bold text-jacarta-700 dark:text-white">
                5.3K
              </div>
              <div className="text-2xs font-medium tracking-tight dark:text-jacarta-400">
                Owners
              </div>
            </a>
            <a
              href="#"
              className="w-1/2 border-r border-jacarta-100 py-4 hover:shadow-md dark:border-jacarta-600 sm:w-32"
            >
              <div className="mb-1 flex items-center justify-center text-base font-medium text-jacarta-700 dark:text-white">
                <span className="-mt-px inline-block" data-tippy-content="ETH">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0"
                    y="0"
                    viewBox="0 0 1920 1920"
                    // xml:space="preserve"
                    className="h-4 w-4"
                  >
                    <path
                      fill="#8A92B2"
                      d="M959.8 80.7L420.1 976.3 959.8 731z"
                    />
                    <path
                      fill="#62688F"
                      d="M959.8 731L420.1 976.3l539.7 319.1zm539.8 245.3L959.8 80.7V731z"
                    />
                    <path
                      fill="#454A75"
                      d="M959.8 1295.4l539.8-319.1L959.8 731z"
                    />
                    <path
                      fill="#8A92B2"
                      d="M420.1 1078.7l539.7 760.6v-441.7z"
                    />
                    <path fill="#62688F" d="M959.8 1397.6v441.7l540.1-760.6z" />
                  </svg>
                </span>
                <span className="font-bold">2.55</span>
              </div>
              <div className="text-2xs font-medium tracking-tight dark:text-jacarta-400">
                Floor Price
              </div>
            </a>
            <a
              href="#"
              className="w-1/2 rounded-r-xl border-jacarta-100 py-4 hover:shadow-md sm:w-32"
            >
              <div className="mb-1 flex items-center justify-center text-base font-medium text-jacarta-700 dark:text-white">
                <span className="-mt-px inline-block" data-tippy-content="ETH">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0"
                    y="0"
                    viewBox="0 0 1920 1920"
                    // xml:space="preserve"
                    className="h-4 w-4"
                  >
                    <path
                      fill="#8A92B2"
                      d="M959.8 80.7L420.1 976.3 959.8 731z"
                    />
                    <path
                      fill="#62688F"
                      d="M959.8 731L420.1 976.3l539.7 319.1zm539.8 245.3L959.8 80.7V731z"
                    />
                    <path
                      fill="#454A75"
                      d="M959.8 1295.4l539.8-319.1L959.8 731z"
                    />
                    <path
                      fill="#8A92B2"
                      d="M420.1 1078.7l539.7 760.6v-441.7z"
                    />
                    <path fill="#62688F" d="M959.8 1397.6v441.7l540.1-760.6z" />
                  </svg>
                </span>
                <span className="font-bold">17.2K</span>
              </div>
              <div className="text-2xs font-medium tracking-tight dark:text-jacarta-400">
                Volume Traded
              </div>
            </a>
          </div>

          <p className="mx-auto max-w-xl text-lg dark:text-jacarta-300">
            Unique, fully 3D and built to unite the design multiverse. Designed
            and styled by Digimental.
          </p>
        </div>
      </div>
    </section>
  );
}
