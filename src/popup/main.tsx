import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "@tanstack/react-router";
import React, { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import { router } from "./router";
import { popupSystem } from "./theme";

function SystemColorModeSync() {
  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const syncColorMode = (matches: boolean) => {
      document.documentElement.classList.toggle("dark", matches);
      document.documentElement.classList.toggle("light", !matches);
    };

    syncColorMode(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      syncColorMode(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return null;
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Popup root container not found.");
}

createRoot(container).render(
  <StrictMode>
    <ChakraProvider value={popupSystem}>
      <SystemColorModeSync />
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>
);
