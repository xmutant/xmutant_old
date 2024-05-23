export const handleDarkMode = () => {
  const htmlElm = document.getElementsByTagName("html")[0];
  const isDarkMode = localStorage?.getItem("isDarkMode");
  if (JSON.parse(isDarkMode)) {
    htmlElm.classList.remove("dark");
    localStorage.setItem("isDarkMode", false);
  } else {
    htmlElm.classList.add("dark");
    localStorage.setItem("isDarkMode", true);
  }
};
