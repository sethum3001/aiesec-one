"use client";

import React, { useState } from "react";
import { Center, Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconCalendarStats,
  IconUser,
  IconLogout
} from "@tabler/icons-react";
import Image from "next/image";
import classes from "./styles.module.scss";
import aiesecHuman from "@app/../../public/aiesec-human-blue.jpg";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;

  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(25), height: rem(25) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const sidebarData = [
  { icon: IconHome2, label: "Home", link: "/" },
  { icon: IconGauge, label: "Dashboard", link: "/dashboard" },
  { icon: IconDeviceDesktopAnalytics, label: "Resources", link: "/resources" },
  { icon: IconCalendarStats, label: "Opportunities", link: "/opportunities" },
  { icon: IconUser, label: "CRM", link: "/crm" }
];

export default function Sidebar() {
  const [active, setActive] = useState<number | null>(null);
  const router = useRouter();

  const links = sidebarData.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        if (link.link) {
          setActive(index);
          router.push(link.link);
        }
      }}
    />
  ));

  const imageStyles: React.CSSProperties = {
    marginTop: rem(8)
  };

  return (
    <nav className={classes.navbar}>
      <Center>
        <Image
          src={aiesecHuman}
          alt="AIESEC Human"
          width={72}
          style={imageStyles}
        />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={5}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink
          icon={IconLogout}
          label="Logout"
          onClick={() => signOut()}
        />
      </Stack>
    </nav>
  );
}
