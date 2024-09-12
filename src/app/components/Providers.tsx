"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalsProvider } from "@mantine/modals";

interface Props {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Providers = ({ children }: Props) => {
  return (
    <SessionProvider> {/* SessionProvider handles user authentication state, using NextAuth. */}
      <MantineProvider> {/* Wraps the app with Mantine's UI components and theme configuration. */}
        <QueryClientProvider client={queryClient}>  {/*To manage server-side data fetching for query client */}
          <ModalsProvider>{children}</ModalsProvider> {/* Manages modal dialogs provided by Mantine. */}
        </QueryClientProvider>
      </MantineProvider>
    </SessionProvider>
  );
};

export default Providers;
