"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";

interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      <MantineProvider>{children}</MantineProvider>
    </SessionProvider>
  );
};

export default Providers;
