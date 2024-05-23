import React, {
  PropsWithChildren,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
// import { useClientEffect } from "../utils/hookts"
import style from "./Theme.module.scss";
import cs from "classnames";

const Colors = {
  light: {
    primary: "#FF005C",
    secondary: "#7000FF",
    success: "#00eda0",
    error: "#FF0000",
    "error-20": "rgba(255, 0, 0, 0.2)",
    warning: "#ffc300",
    "gray-vvlight": "#e7e7e7",
    "gray-vlight": "#d3d3d3",
    "gray-light": "#C4C4C4",
    gray: "#727272",
    "gray-dark": "#484848",
    black: "#000000",
    white: "#FFFFFF",
    border: "#000000",
    "border-input": "#000000",
  },
  dark: {
    primary: "#FF005C",
    secondary: "#c8ff00",
    success: "#00eda0",
    error: "#FF0000",
    "error-20": "rgba(255, 0, 0, 0.2)",
    warning: "#ffc300",
    "gray-vvlight": "#2e2e2e",
    "gray-vlight": "#363636",
    "gray-light": "#505050",
    gray: "#a5a5a5",
    "gray-dark": "#999999",
    black: " white",
    white: "#242424",
    border: "#0f0f0f",
    "border-input": "#7e7e7e",
  },
};

const hasReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)");

const defaultProperties = {
  darkTheme: true,
  spaceBetweenCards: 30,
  borderWidthCards: 3,
  shadowCards: 19,
  cardSize: {},
  displayInfosGenerativeCard: true,
  displayInfosGentkCard: true,
  displayPricesCard: false,
  displayBurntCard: false,
  hoverEffectCard: true,
  quality: 0,
  topBannerMessage: "",
  nsfw: false,
  epilepsy: hasReducedMotion && hasReducedMotion.matches,
  layoutMasonry: false,

  // fx(params)
  showTicketPreMintWarning: true,
  // notifications
  showMintTicketAlerts: true,
  showOfferAlerts: true,
  offerAlertsFloorThreshold: 0.5,
};

const defaultCtx = {
  ...defaultProperties,
  update: () => {},
  theme: {
    colors: Colors.dark,
  },
};

export const SettingsContext = React.createContext(defaultCtx);

export const useSettingsContext = () => React.useContext(SettingsContext);

export function SettingsProvider({ children }) {
  const [context, setContext] = useState(defaultCtx);
  const ref = useRef(context);

  const computeThemeValues = (dark) => {
    return {
      colors: dark ? Colors.dark : Colors.light,
    };
  };

  const updateContext = (ctx) => {
    setContext({
      ...ctx,
      theme: computeThemeValues(ctx.darkTheme),
    });
    ref.current = ctx;
  };

  const update = (key, value) => {
    const newContext = {
      ...ref.current,
      [key]: value,
    };
    updateContext(newContext);
    localStorage.setItem("settings", JSON.stringify(newContext));
  };

  useEffect(() => {
    // check for the settings in the local storage
    const fromStorage = localStorage.getItem("settings");
    const values = fromStorage ? JSON.parse(fromStorage) : defaultProperties;
    updateContext({
      ...defaultProperties,
      ...values,
      update,
    });
  }, []);

  // triggers whenever settings change
  useEffect(() => {
    // update some css variables with numeric inputs
    const root = document.documentElement;
    root.style.setProperty(
      "--cards-border-width",
      `${context.borderWidthCards}px`
    );
    root.style.setProperty("--cards-shadow", `${context.shadowCards}px`);
    root.style.setProperty("--cards-gap", `${context.spaceBetweenCards}px`);
  }, [context]);

  useEffect(() => {
    if (context.darkTheme) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [context.darkTheme]);

  return (
    <SettingsContext.Provider value={context}>
      <div className={cs(style.root_wrapper)}>{children}</div>
    </SettingsContext.Provider>
  );
}
