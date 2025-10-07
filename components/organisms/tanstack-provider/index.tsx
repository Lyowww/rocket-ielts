"use client";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/atom/sonner";
import { usePathname } from "next/navigation";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retryDelay: 1000,
      },
    },
  });
}

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

let browserQueryClient: QueryClient | undefined = undefined;

const TanstackProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const queryClient = getQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      {children}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
};

export default TanstackProvider;
