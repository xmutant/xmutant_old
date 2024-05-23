"use client";
import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";

export const ContainerScroll = ({ users, titleComponent }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[65rem] flex items-center justify-center relative p-2 lg:p-20"
      ref={containerRef}
    >
      <div
        className="py-2 w-full relative lg:py-20"
        style={{ perspective: "1000px" }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        {users && users.length > 0 ? (
          <Card
            rotate={rotate}
            translate={translate}
            scale={scale}
            users={users}
          />
        ) : (
          <div>No users found.</div>
        )}
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }) => {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({ rotate, scale, translate, users }) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-8 mx-auto h-[40rem] md:h-[40rem] w-full border-2 border-[#6C6C6C] p-4 bg-[#222222] rounded-[30px] shadow-xl"
    >
      <div className="bg-gray-100 h-full w-full rounded-2xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-hidden p-2">
        {users.map((user, idx) => (
          <article key={idx} className="relative">
            <div className="block rounded-2.5xl border border-jacarta-100 bg-white p-2  transition-shadow hover:shadow-lg dark:border-jacarta-700 dark:bg-jacarta-700">
              <figure className="p-1">
                <Image
                  src={user.image}
                  alt="item"
                  width="230"
                  height="230" // Fixed width and height
                  className="object-cover rounded-[0.625rem] min-w-full min-h-[120px] max-h-[120px]" // Setting width and height to 230px
                  loading="lazy"
                />
              </figure>
              <div className="p-1">
                <h2 className=" dark:text-white text-black  font-semibold   text-sm">
                  {user.collection}
                </h2>
                <h3 className="  text-xs text-black dark:text-white">
                  {user.name}
                </h3>
              </div>
              {/* <div className="absolute top-5 right-2 rounded-full text-xs font-bold bg-white px-2 py-1">
                {user.category}
              </div> */}
            </div>
          </article>
        ))}
      </div>
    </motion.div>
  );
};
