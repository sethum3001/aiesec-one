"use client";

import styles from "./page.module.scss";
import { useSession } from "next-auth/react";
import { Button, Container, Text, Title } from "@mantine/core";
import Image from "next/image";
import aiesecHuman from "@app/../../public/aiesec-human-blue.jpg";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <main className={styles.main}>
      <Image src={aiesecHuman} alt="AIESEC Human" height={120} />
      <Container mb="lg">
        <Title order={1} mt="md" mb="lg">
          AIESEC One
        </Title>
        <hr />
        <Title order={2} mb="xs" mt="lg" style={{ fontWeight: 400 }}>
          Hey {session?.user?.name}!
        </Title>

        <Title order={4} mt={2} mb={8}>
          Welcome to <strong>AIESEC One</strong>
        </Title>
        <Text mb={4} mt={4} style={{ color: "grey" }}>
          The all in one platform to manage
          <br />
          opportunities, resources, and members
          <br />
          of AIESEC in Sri Lanka.
        </Text>
      </Container>
      <Button mt="sm" onClick={() => router.push("/login")}>
        Explore
      </Button>
    </main>
  );
}
