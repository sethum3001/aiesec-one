"use client";

import Page from "@/app/components/sidebar/page";
import { AppShell } from "@mantine/core";

export default function MainAppShell({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppShell>
      <AppShell.Navbar>
        <Page />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
