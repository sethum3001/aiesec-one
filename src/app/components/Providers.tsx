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
    <SessionProvider>
      <MantineProvider>
        <QueryClientProvider client={queryClient}>
          <ModalsProvider>{children}</ModalsProvider>
        </QueryClientProvider>
      </MantineProvider>
    </SessionProvider>
  );
};

export default Providers;
