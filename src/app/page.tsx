"use client";

import styles from "./page.module.scss";
import { signOut, useSession } from "next-auth/react";
import { Button, Container, Text, Title } from "@mantine/core";
import Image from "next/image";
import aiesecHuman from "@app/../../public/aiesec-human-blue.jpg";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className={styles.main}>
      <Image src={aiesecHuman} alt="AIESEC Human" height={120} />
      <Container mb="lg">
        <Title order={1} mt="md" mb="lg">
          AIESEC One
        </Title>
        <hr />
        <Title order={2} mb="xs" mt="lg">
          Welcome {session?.user?.name}
        </Title>
        <Text mb={4}>Your email is: {session?.user?.email}</Text>
        <Text mb={4}>Your entity is: {session?.user?.entity}</Text>
        <Text mb={4}>Your role is: {session?.user?.role}</Text>
      </Container>
      <Button mt="sm" onClick={() => signOut()}>
        Sign out
      </Button>
    </main>
  );
}
