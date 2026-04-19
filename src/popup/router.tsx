import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter
} from "@tanstack/react-router";
import App from "./App";

const rootRoute = createRootRoute({
  component: App
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/"
});

const appearanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/appearance"
});

const launchpadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/launchpad"
});

const fontRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/font"
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login"
});

const customCodeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/custom-code"
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  appearanceRoute,
  launchpadRoute,
  fontRoute,
  loginRoute,
  customCodeRoute
]);

export const router = createRouter({
  routeTree,
  history: createMemoryHistory({
    initialEntries: ["/"]
  }),
  scrollRestoration: true,
  scrollRestorationBehavior: "instant",
  scrollToTopSelectors: ['[data-scroll-restoration-id="popup-viewport"]']
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
