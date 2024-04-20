"use client";

import {
  Alert,
  Card,
  Container,
  Divider,
  Group,
  Loader,
  Text,
  Title
} from "@mantine/core";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles.module.scss";
import Image from "next/image";
import aiesecHuman from "@app/../../public/aiesec-human-white.png";
import React, { useState } from "react";
import { GoogleButton } from "@/app/components/GoogleButton";

export default function Login() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Check for error message in query params
  const errorMessage = searchParams.get("error");

  const login = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: process.env.NEXTAUTH_URL,
        redirect: true
      });
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (session != null) {
    setTimeout(() => {
      router.push("/");
    }, 1000);
    return (
      <Container fluid className={styles.fullpage}>
        <Loader color="#037ef3" type="dots" />
      </Container>
    );
  } else {
    return (
      <Container fluid className={styles.login}>
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
          {errorMessage && (
            <Alert
              color="red"
              title="Error"
              mt="8"
              radius="lg"
              className={styles.error}
            >
              {errorMessage}
            </Alert>
          )}
        </Card>
      </Container>
    );
  }
}
