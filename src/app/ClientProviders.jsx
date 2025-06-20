// app/ClientProviders.jsx
"use client";

import { CookiesProvider } from "react-cookie";
import WrapperLoader from "@/components/WrapperLoader";

export default function ClientProviders({ children }) {
  return (
    <CookiesProvider>
      <WrapperLoader>
        {children}
      </WrapperLoader>
    </CookiesProvider>
  );
}