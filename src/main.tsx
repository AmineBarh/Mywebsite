import { createRoot } from "react-dom/client";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource/anton";
import "@fontsource-variable/lexend";
import "@fontsource-variable/big-shoulders-display";
import "lenis/dist/lenis.css";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
