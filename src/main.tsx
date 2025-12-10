import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";
import { ThemeProvider } from "./providers/theme-provider";
import { PostHogProvider } from 'posthog-js/react'
import { Toaster } from "./providers/toaster";
import { HalloweenProvider } from "./providers/halloween-provider";
import { ChristmasProvider } from "./providers/christmas-provider";
import { SpringProvider } from "./providers/spring-provider";
import { LanguageProvider } from "./providers/language-provider";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const options = {
  api_host: import.meta.env.VITE_POSTHOG_API_HOST,
  loaded: (posthog: any) => {
    if (import.meta.env.DEV) console.log('PostHog loaded');
  },
}

function ConvexAuthProvider({ children }: { children: React.ReactNode }) {
  // Ya no usamos setAuth porque validamos tokens manualmente en Convex
  // El token se pasa como parámetro a cada función de Convex
  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PostHogProvider apiKey={import.meta.env.VITE_POSTHOG_KEY} options={options}>
      <ConvexProvider client={convex}>
        <ConvexAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <LanguageProvider>
              <HalloweenProvider>
                <ChristmasProvider>
                  <SpringProvider>
                    <App />
                    <Toaster/>
                  </SpringProvider>
                </ChristmasProvider>
              </HalloweenProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ConvexAuthProvider>
      </ConvexProvider>
    </PostHogProvider>
  </React.StrictMode>,
);