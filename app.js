import MemeCoinTracker from "./src/components/MemeCoinTracker";

import "./src/css/styles.css"
// On page load or when changing themes
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

export function setThemePreference(theme) {
  const rootElement = document.documentElement;

  if (theme === "dark") {
    rootElement.classList.add("dark");
    localStorage.theme = "dark";
  } else if (theme === "light") {
    rootElement.classList.remove("dark");
    localStorage.theme = "light";
  } else {
    rootElement.classList.remove("dark");
    localStorage.removeItem("theme");
  }
}

// Whenever the user explicitly chooses light mode
// setThemePreference("light");

// Whenever the user explicitly chooses dark mode
// setThemePreference("dark");

// Whenever the user explicitly chooses to respect the OS preference
// setThemePreference();
