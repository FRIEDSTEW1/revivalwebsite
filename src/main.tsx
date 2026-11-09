import { StrictMode } from "react"
import { preload } from "react-dom"
import { createRoot } from "react-dom/client"
import { HelmetProvider } from "react-helmet-async"
import "./index.css"
import { App } from "./App"
import { ThemeProvider } from "@/lib/theme"
import { AuthProvider } from "@/lib/auth"
import { homeHero } from "@/lib/homeHero"

if (window.location.pathname === "/") {
  preload(homeHero.src, {
    as: "image",
    imageSrcSet: homeHero.srcSet,
    imageSizes: homeHero.sizes,
    fetchPriority: "high",
  })
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
)
