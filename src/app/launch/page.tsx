"use client";

import { Button, Card, Container, Text, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles.module.scss";
import Image from "next/image";
import aiesecHuman from "@app/../../public/aiesec-human-white.png";
import React, { useState } from "react";

export default function Launch() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const launch = () => {
    router.push("/login");
  };

  // Check for error message in query params
  const errorMessage = searchParams.get("error");

  return (
    <Container
      fluid
      className={styles.launch}
      style={{ backgroundImage: "url('/natcon.jpg')", backgroundSize: "cover" }}
    >
      <Card
        shadow="xl"
        padding="lg"
        radius="lg"
        withBorder
        className={styles.card}
        px={32}
      >
        <Image src={aiesecHuman} alt="AIESEC Human" height={180} />

        <Title order={2} fw={500} mt={4} mb={8}>
          <strong>AIESEC One</strong>
        </Title>

        <Text mt={8} mb={16}>
          The first step of the digital revolution
          <br />
          of AIESEC in Sri Lanka
        </Text>
        <Button size="lg" mt="sm" onClick={launch}>
          Launch
        </Button>
      </Card>
    </Container>
  );
}
