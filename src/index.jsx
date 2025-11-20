import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import App from "./app";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <TooltipPrimitive.Provider>
      <App />
    </TooltipPrimitive.Provider>
  </StrictMode>
);
