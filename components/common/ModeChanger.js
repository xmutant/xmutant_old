"use client";

import { useEffect } from "react";

export default function ModeChanger() {
  useEffect(() => {
    const htmlElm = document.getElementsByTagName("html")[0];
    const currentState = localStorage?.getItem("isDarkMode");
    if (!JSON.parse(currentState)) {
      htmlElm.classList.add("dark");
    }
  }, []);
  return <></>;
}
