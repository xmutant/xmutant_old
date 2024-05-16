"use client";
import { processes } from "@/data/process";
import Image from "next/image";

export default function Process() {
  return (
    <section className="relative py-24 dark:bg-jacarta-800">
      <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
        <Image
          width={1920}
          height={789}
          src="/img/gradient_light.jpg"
          priority
          alt="gradient"
          className="h-full w-full"
        />
      </picture>
      <div className="container">
        <h2 className="mb-16 text-center font-display text-3xl text-jacarta-700 dark:text-white">
          Create and sell your NFTs
        </h2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {processes.map((elm, i) => (
            <div key={i} className="text-center">
              <div
                className={`mb-6 inline-flex rounded-full ${elm.bgClass} p-3`}
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${elm.bgClass}`}
                >
                  <Image
                    width={24}
                    height={24}
                    src={elm.iconSrc}
                    alt="process"
                  />
                </div>
              </div>
              <h3
                dir="ltr"
                className="mb-4  font-display text-lg text-jacarta-700 dark:text-white"
              >
                {elm.title}
              </h3>
              <p className="dark:text-jacarta-300">{elm.description}</p>
            </div>
          ))}
        </div>

       

        
      </div>
    </section>
  );
}
