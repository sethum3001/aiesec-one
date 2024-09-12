"use client";

import React, { useState } from "react";
import {
  Avatar,
  Center,
  rem,
  Stack,
  Tooltip,
  UnstyledButton
} from "@mantine/core";
import Image from "next/image";
import classes from "./styles.module.scss";
import aiesecHuman from "@app/../../public/aiesec-human-blue.jpg";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Icon,
  IconHome,
  IconLinkPlus,
  IconLogout,
  IconSparkles,
  IconUsersGroup,
  IconUserCircle
} from "@tabler/icons-react";

// Define the props for the NavbarLink component
interface NavbarLinkProps {
    icon: Icon; // Icon to display for the link
    label: string; // Tooltip label for the link
    active?: boolean; // Flag to indicate if the link is active
    onClick?(): void; // Optional onClick handler for the link
}

// Renders individual sidebar links with a tooltip and an icon
function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 150 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon width={24} height={24} />
      </UnstyledButton>
    </Tooltip>
  );
}

// Data for the sidebar links: each link has an icon, label, and a route (link)
const sidebarData = [
  { icon: IconHome, label: "Home", link: "/" },
  { icon: IconSparkles, label: "Opportunities", link: "/opportunities" },
  { icon: IconLinkPlus, label: "Resources", link: "/resources" },
  { icon: IconUsersGroup, label: "Members", link: "/members" },
  { icon: IconUserCircle, label: "Groups", link: "/groups" }
];

// Renders the navigation bar
export default function Sidebar() {
  const { data } = useSession();
  const [active, setActive] = useState<number | null>(null);
  const router = useRouter();

    // Map through sidebarData to generate NavbarLink components for each item
  const links = sidebarData.map((link, index) => (
    <NavbarLink
      {...link} // Spread properties of the link object into the component props
      key={link.label} // Use label as unique key
      active={index === active} // Set active state if the current link is selected
      onClick={() => {
        if (link.link) {
          setActive(index);
          router.push(link.link);
        }
      }}
    />
  ));

    // Styles for the AIESEC logo
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
        <Stack justify="center" gap={6}>
          {links}
        </Stack>
      </div>

      <Stack align="center" gap={10}>
        {data?.user && (
          <Tooltip
            label={
              <div>
                <h4>{data.user.name}</h4>
                <p>{data.user.email}</p>
              </div>
            }
            position="right"
          >
            <Avatar size={36} src={data.user.image} alt="User" />
          </Tooltip>
        )}
        <NavbarLink
          icon={IconLogout}
          label="Logout"
          onClick={() =>
            signOut({ callbackUrl: `${window.location.origin}/login` })
          }
        />
      </Stack>
    </nav>
  );
}
