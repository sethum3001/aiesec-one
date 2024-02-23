"use client";

import { Card, Divider, Group, Text, Title } from "@mantine/core";
import { GoogleButton } from "../components/GoogleButton";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import Image from "next/image";
import aiesecHuman from "@app/../../public/aiesec-human-white.png";
import React, { useState } from "react";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: process.env.NEXTAUTH_URL });
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (session != null) {
    router.push("/");
    return null;
  } else {
    return (
      <main className={styles.login}>
        <Card
          shadow="sm"
          padding="lg"
          radius="lg"
          withBorder
          className={styles.card}
          px={32}
        >
          <Title order={3} fw={500} mt={4}>
            Welcome to <strong>AIESEC One</strong>
          </Title>
          <Divider my="lg" />
          <Image src={aiesecHuman} alt="AIESEC Human" height={180} />
          <Group grow mb="sm" mt="lg">
            <GoogleButton
              radius="xl"
              size="md"
              onClick={login}
              disabled={isLoading}
            >
              {" "}
              <Text size="15" fw={600}>
                Sign in with Google
              </Text>
            </GoogleButton>
          </Group>
        </Card>
      </main>
    );
  }
}
