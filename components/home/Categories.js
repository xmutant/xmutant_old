"use client";

// import { items2 } from "@/data/item";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import tippy from "tippy.js";
const sortingOptions = ["Price: Low to High", "Price: High to Low"];
import { GridLoader } from "react-spinners";

export default function Categories() {
  const [allItems, setAllItems] = useState();
  // const [activeCategory, setActiveCategory] = useState("all");

  // const [activeSort, setActiveSort] = useState(sortingOptions[0]);
  // const [onlyVarified, setOnlyVarified] = useState(false);
  // const [onlyNFSW, setOnlyNFSW] = useState(false);
  // const [onlyLazyMinted, setOnlyLazyMinted] = useState(false);

  useEffect(() => {
    tippy("[data-tippy-content]");
  }, []);

  useEffect(() => {
    tippy("[data-tippy-content]");

    const currentUrl = process.env.NEXT_PUBLIC_URL;

    const fetchData = async () => {
      try {
        const response = await fetch(`${currentUrl}/api/get-home-bids`);
        const data = await response.json();
        setAllItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchData();
  }, []);

  console.log(allItems);

  return (
    <section className="py-24">
      <div className="container">
        <h2 className="mb-8 text-center font-display text-3xl text-jacarta-700 dark:text-white">
          <span
            className="mr-1 inline-block h-6 w-6 bg-contain bg-center text-xl"
            style={{
              backgroundImage:
                "url(https://cdn.jsdelivr.net/npm/emoji-datasource-apple@7.0.2/img/apple/64/26a1.png)",
            }}
          ></span>
          Trending categories
        </h2>
        {allItems && allItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
            {allItems.map((elm, i) => (
              <article key={i}>
                <div className="block rounded-2.5xl border border-jacarta-100 bg-white p-[1.1875rem] transition-shadow hover:shadow-lg dark:border-jacarta-700 dark:bg-jacarta-700">
                  <figure className="relative">
                    <Link href={`/item/${elm.id}`}>
                      <Image
                        width={230}
                        height={230}
                        src={elm.metadata.image}
                        alt="item 5"
                        className="w-full rounded-[0.625rem]"
                        loading="lazy"
                      />
                    </Link>
                    <div className="absolute top-3 right-3 flex items-center space-x-1 rounded-md bg-white p-2 dark:bg-jacarta-700">
                      <span
                        onClick={() => addLike(elm.id)}
                        className={`js-likes relative cursor-pointer before:absolute before:h-4 before:w-4 before:bg-[url('../img/heart-fill.svg')] before:bg-cover before:bg-center before:bg-no-repeat before:opacity-0 ${
                          elm.liked ? "js-likes--active" : ""
                        }`}
                        data-tippy-content="Favorite"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="h-4 w-4 fill-jacarta-500 hover:fill-red dark:fill-jacarta-200 dark:hover:fill-red"
                        >
                          <path fill="none" d="M0 0H24V24H0z" />
                          <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228zm6.826 1.641c-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-1.575-1.412-3.99-1.35-5.494.154-1.49 1.49-1.565 3.875-.192 5.451L12 18.654l7.02-7.03c1.374-1.577 1.299-3.959-.193-5.454z" />
                        </svg>
                      </span>
                      <span className="text-sm dark:text-jacarta-200">
                        {elm.likes}
                      </span>
                    </div>
                    <div className="absolute left-3 -bottom-3">
                      <div className="flex -space-x-2">
                        <a href="#">
                          <Image
                            width={20}
                            height={20}
                            src={elm.metadata.image}
                            alt="creator"
                            className="h-6 w-6 rounded-full border-2 border-white hover:border-accent dark:border-jacarta-600 dark:hover:border-accent"
                            data-tippy-content={`Creator: ${elm.creator}`}
                          />
                        </a>
                        <a href="#">
                          <Image
                            width={20}
                            height={20}
                            src={elm.metadata.image}
                            alt="owner"
                            className="h-6 w-6 rounded-full border-2 border-white hover:border-accent dark:border-jacarta-600 dark:hover:border-accent"
                            data-tippy-content={`Owner: ${elm.owner}`}
                          />
                        </a>
                      </div>
                    </div>
                  </figure>
                  <div className="mt-7 flex items-center justify-between">
                    <Link href={`/item/${elm.id}`}>
                      <span className="font-display text-base text-jacarta-700 hover:text-accent dark:text-white">
                        {elm.title}
                      </span>
                    </Link>
                    <div className="dropup rounded-full hover:bg-jacarta-100 dark:hover:bg-jacarta-600">
                      <a
                        href="#"
                        className="dropdown-toggle inline-flex h-8 w-8 items-center justify-center text-sm"
                        role="button"
                        id="itemActions"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <svg
                          width="16"
                          height="4"
                          viewBox="0 0 16 4"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-jacarta-500 dark:fill-jacarta-200"
                        >
                          <circle cx="2" cy="2" r="2" />
                          <circle cx="8" cy="2" r="2" />
                          <circle cx="14" cy="2" r="2" />
                        </svg>
                      </a>
                      <div
                        className="dropdown-menu dropdown-menu-end z-10 hidden min-w-[200px] whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl dark:bg-jacarta-800"
                        aria-labelledby="itemActions"
                      >
                        <button className="block w-full rounded-xl px-5 py-2 text-left font-display text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600">
                          New bid
                        </button>
                        <hr className="my-2 mx-4 h-px border-0 bg-jacarta-100 dark:bg-jacarta-600" />
                        <button className="block w-full rounded-xl px-5 py-2 text-left font-display text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600">
                          Refresh Metadata
                        </button>
                        <button className="block w-full rounded-xl px-5 py-2 text-left font-display text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600">
                          Share
                        </button>
                        <button className="block w-full rounded-xl px-5 py-2 text-left font-display text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600">
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="mr-1 text-jacarta-700 dark:text-jacarta-200">
                      {elm.price} ETH
                    </span>
                    <span className="text-jacarta-500 dark:text-jacarta-300">
                      {elm.bidCount}
                    </span>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <button
                      className="font-display text-sm font-semibold text-accent"
                      data-bs-toggle="modal"
                      data-bs-target="#buyNowModal"
                    >
                      Buy now
                    </button>
                    <Link
                      href={`/item/${elm.id}`}
                      className="group flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="mr-1 mb-[3px] h-4 w-4 fill-jacarta-500 group-hover:fill-accent dark:fill-jacarta-200"
                      >
                        <path fill="none" d="M0 0H24V24H0z" />
                        <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12h2c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8C9.25 4 6.824 5.387 5.385 7.5H8v2H2v-6h2V6c1.824-2.43 4.729-4 8-4zm1 5v4.585l3.243 3.243-1.415 1.415L11 12.413V7h2z" />
                      </svg>
                      <span className=" rtl:mr-1 font-display text-sm font-semibold group-hover:text-accent dark:text-jacarta-200">
                        View History
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <GridLoader color="#3396FF" />
          </div>
        )}
      </div>
    </section>
  );
}
