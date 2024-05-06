"use client";
// import { collections3 } from "@/data/collections";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { collections } from "@/data/dataCollection";
import { ClipLoader, GridLoader } from "react-spinners";
const categories = [
  {
    id: 1,
    name: "Generative Art",
    icon: "M12 2c5.522 0 10 3.978 10 8.889a5.558 5.558 0 0 1-5.556 5.555h-1.966c-.922 0-1.667.745-1.667 1.667 0 .422.167.811.422 1.1.267.3.434.689.434 1.122C13.667 21.256 12.9 22 12 22 6.478 22 2 17.522 2 12S6.478 2 12 2zm-1.189 16.111a3.664 3.664 0 0 1 3.667-3.667h1.966A3.558 3.558 0 0 0 20 10.89C20 7.139 16.468 4 12 4a8 8 0 0 0-.676 15.972 3.648 3.648 0 0 1-.513-1.86z",
  },
];

const sortingOptions = [
  { text: "Trending" },
  { text: "Top" },
  { text: "Recent" },
];
export default function Collections() {
  const [currentSorting, setCurrentSorting] = useState(sortingOptions[0]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // data/collections.js
    const collections = []; // Initialize an empty array

    // Fetch data from the API and store it in the `collections` array
    fetch("/api/get-all-collection", {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((data) => {
        const metadataPromises = [];

        data.forEach((collection) => {
          const { address, name, symbol, contractUri, tokens } = collection;
          const ownerName = symbol; // Assuming the symbol represents the owner name
          const avatar = "/images/avatars/avatar.jpg"; // Placeholder avatar image

          const tokenMetadataPromises = tokens.map((token) => {
            const metadataURI = token.metadataURI;
            return fetch(metadataURI)
              .then((response) => response.json())
              .then((metadata) => {
                const { name, description, image, external_url } = metadata;
                return {
                  tokenId: token.tokenId,
                  name,
                  description,
                  image,
                  external_url,
                };
              })
              .catch((error) =>
                console.error(
                  `Error fetching metadata for ${metadataURI}:`,
                  error
                )
              );
          });

          metadataPromises.push(
            Promise.all(tokenMetadataPromises).then((tokenMetadata) => {
              const formattedCollection = {
                id: address,
                name,
                ownerName,
                avatar,
                itemCount: tokens.length,
                images: tokenMetadata.map((metadata) => metadata.image),
                tokenMetadata,
              };
              return formattedCollection;
            })
          );
        });

        Promise.all(metadataPromises)
          .then((formattedCollections) => {
            formattedCollections.forEach((collection) =>
              collections.push(collection)
            );
            setFiltered(collections);
            setIsLoading(false);
          })
          .catch((error) => console.error("Error fetching metadata:", error));
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    // setIsLoading(true);

    let tempfiltered = [];
    if (activeCategory === "all") {
      tempfiltered = filtered;
    } else {
      tempfiltered = filtered.filter((elm) => elm.category === activeCategory);
    }
    setFiltered(tempfiltered);
  }, [activeCategory]);

  return (
    <section className="relative py-24">
      <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
        <Image
          width={1920}
          height={789}
          priority
          src="/img/gradient_light.jpg"
          alt="gradient"
          className="h-full w-full"
        />
      </picture>
      <div className="container">
        <h1 className="py-16 text-center font-display text-4xl font-medium text-jacarta-700 dark:text-white">
          Explore Collections
        </h1>

        <div className="mb-8 flex flex-wrap items-center justify-between">
          <ul className="flex flex-wrap items-center">
            <li className="my-1 mr-2.5">
              <div
                onClick={() => setActiveCategory("all")}
                className={`  ${
                  activeCategory == "all" ? "bg-jacarta-100" : "bg-white"
                }  ${
                  activeCategory == "all"
                    ? " dark:bg-jacarta-700"
                    : "dark:bg-jacarta-900"
                } cursor-pointer group flex h-9 items-center rounded-lg border border-jacarta-100  px-4 font-display text-sm font-semibold text-jacarta-500 transition-colors hover:border-transparent hover:bg-accent hover:text-white dark:border-jacarta-600  dark:text-white dark:hover:border-transparent dark:hover:bg-accent dark:hover:text-white`}
              >
                All
              </div>
            </li>
            {categories.map((elm, i) => (
              <li
                onClick={() => setActiveCategory(elm.name)}
                key={i}
                className="my-1 mr-2.5"
              >
                <div
                  className={`  ${
                    activeCategory == elm.name ? "bg-jacarta-100" : "bg-white"
                  }  ${
                    activeCategory == elm.name
                      ? " dark:bg-jacarta-700"
                      : "dark:bg-jacarta-900"
                  } cursor-pointer group flex h-9 items-center rounded-lg border border-jacarta-100  px-4 font-display text-sm font-semibold text-jacarta-500 transition-colors hover:border-transparent hover:bg-accent hover:text-white dark:border-jacarta-600  dark:text-white dark:hover:border-transparent dark:hover:bg-accent dark:hover:text-white`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 25 28"
                    width="24"
                    height="24"
                    className="mr-1 h-4 w-4 fill-jacarta-700 transition-colors group-hover:fill-white dark:fill-jacarta-100"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d={elm.icon} />
                  </svg>
                  <span>{elm.name}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="dropdown relative my-1 cursor-pointer">
            <div
              className="dropdown-toggle inline-flex w-48 items-center justify-between rounded-lg border border-jacarta-100 bg-white py-2 px-3 text-sm dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white"
              role="button"
              id="categoriesSort"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="font-display">{currentSorting.text}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="h-4 w-4 fill-jacarta-500 dark:fill-white"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" />
              </svg>
            </div>

            <div
              className="dropdown-menu z-10 hidden w-full whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl dark:bg-jacarta-800"
              aria-labelledby="categoriesSort"
            >
              {sortingOptions.map((elm, i) => (
                <button
                  onClick={() => setCurrentSorting(elm)}
                  key={i}
                  className="dropdown-item flex w-full items-center justify-between rounded-xl px-5 py-2 text-left font-display text-sm text-jacarta-700 transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600"
                >
                  {elm.text}
                  {currentSorting == elm && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="h-4 w-4 fill-accent"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <GridLoader color="#3396FF" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-3 lg:grid-cols-4">
            {filtered.length > 0 &&
              filtered.map((elm, i) => (
                <article key={i}>
                  <div className="rounded-2.5xl border border-jacarta-100 bg-white p-[1.1875rem] transition-shadow hover:shadow-lg dark:border-jacarta-700 dark:bg-jacarta-700">
                    <Link
                      href={`/collection/${elm.id}`}
                      className="flex space-x-[0.625rem]"
                    >
                      <span className="w-[74.5%]">
                        <Image
                          width={152}
                          height={242}
                          src={elm.images[0]}
                          alt="item 1"
                          className="h-full w-full rounded-[0.625rem] object-cover"
                          loading="lazy"
                        />
                      </span>
                      <span className="flex w-1/3 flex-col space-y-[0.625rem]">
                        {elm.images.slice(1).map((img, i2) => (
                          <Image
                            width={68}
                            height={74}
                            key={i2}
                            src={img}
                            alt="item 1"
                            className="h-full rounded-[0.625rem] object-cover"
                            loading="lazy"
                          />
                        ))}
                      </span>
                    </Link>

                    <Link
                      href={`/collection/${elm.id}`}
                      className="mt-4 block font-display text-base text-jacarta-700 hover:text-accent dark:text-white dark:hover:text-accent"
                    >
                      {elm.name}
                    </Link>

                    <div className="mt-2 flex items-center justify-between text-sm font-medium tracking-tight">
                      <div className="flex flex-wrap items-center">
                        <Link
                          href={`/user/${elm.id}`}
                          className="mr-2 shrink-0"
                        >
                          <Image
                            width={20}
                            height={20}
                            src={elm.avatar}
                            alt="owner"
                            className="h-5 w-5 rounded-full"
                          />
                        </Link>
                        <span className="mr-1 dark:text-jacarta-400">by</span>
                        <Link href={`/user/${elm.id}`} className="text-accent">
                          <span>{elm.ownerName}</span>
                        </Link>
                      </div>
                      <span className="text-sm dark:text-jacarta-300">
                        {elm.itemCount} Items
                      </span>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
