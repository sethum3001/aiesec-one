"use client";

import React, { useState } from "react";
import { Center, Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import Image from "next/image";
import classes from "./styles.module.scss";
import aiesecHuman from "@app/../../public/aiesec-human-blue.jpg";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface NavbarLinkProps {
  icon: string;
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
        <Image src={Icon} alt={label} width={20} height={20} />
      </UnstyledButton>
    </Tooltip>
  );
}

const sidebarData = [
  { icon: "/Icon1.png", label: "Home", link: "/" },
  { icon: "/Icon2.png", label: "Members", link: "/members" },
  { icon: "/Icon3.png", label: "", link: "/" },
  { icon: "/Icon4.png", label: "Opportunities", link: "/opportunities" },
  { icon: "/Icon5.png", label: "Resources", link: "/resources" },
  { icon: "/Icon6.png", label: "", link: "/" }
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
          icon="/Icon7.png"
          label="Logout"
          onClick={() => signOut()}
        />
      </Stack>
    </nav>
  );
}
