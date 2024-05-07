"use client";
import { useRef } from "react";
import cs from "classnames";
import Head from "next/head";
import { MintGenerativeController } from "../../containers/MintGenerative/Controller";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "@/components/headers/Header";
import Footer from "@/components/footer/Footer";

const MintGenerative = () => {
  const anchorRef = useRef(null);

  return (
    <>
      <Head>
        <title>fxhash — mint Generative Token</title>
        <meta
          key="og:title"
          property="og:title"
          content="fxhash — mint Generative Token"
        />
        <meta
          key="description"
          name="description"
          content="Mint your generative Token"
        />
      </Head>
      <Header />
      <section ref={anchorRef} className="pt-[200px] mx-10">
        <h1 className="py-16 text-center font-display text-4xl font-medium text-jacarta-700 dark:text-white">
          Mint a Generative Token
        </h1>
        <Router basename="/mint-generative">
          <MintGenerativeController anchor={anchorRef} />
        </Router>
      </section>
      <Footer />
    </>
  );
};

export default MintGenerative;
