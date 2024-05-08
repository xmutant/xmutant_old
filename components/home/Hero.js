/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

import Ipad from "../ipad/LandingComp";
import img1 from "../../public/img/gradient.jpg";
import img2 from "../../public/img/gradient_dark.jpg";

export default function Hero() {
  return (
    <section className="relative pb-10 pt-20 md:pt-32 ">
      <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 dark:hidden">
        <Image
          width={1920}
          height={900}
          src={img1}
          alt="gradient"
          className="w-full"
        />
      </picture>
      <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden dark:block">
        <Image
          width={1920}
          height={900}
          src={img2}
          alt="gradient dark"
          className="w-full"
        />
      </picture>

      <div className="container h-full ">
        <Ipad />
      </div>
    </section>
  );
}
