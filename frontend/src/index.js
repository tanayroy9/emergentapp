import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { Toaster } from "@/components/ui/sonner";

// Disable error overlay in development
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('error', (e) => {
    if (e.message === 'ResizeObserver loop limit exceeded' || 
        e.message === 'ResizeObserver loop completed with undelivered notifications.') {
      e.stopImmediatePropagation();
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" />
  </React.StrictMode>,
);
