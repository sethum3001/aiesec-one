"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS, APP_DOMAIN, SHORT_LINK_TAGS } from "@/lib/constants";
import { OpportunityResponse } from "@/types/OpportunityResponse";
import {
  Box,
  Card,
  Image,
  Text,
  Group,
  Button,
  LoadingOverlay
} from "@mantine/core";
import styles from "./styles.module.scss";

async function fetchOriginalUrl(id: string) {
  const response = await fetch(
    `${APP_DOMAIN}${API_ENDPOINTS.URL}/${SHORT_LINK_TAGS.OPPORTUNITIES}/${id}`,
    {
      method: "GET"
    }
  );
  if (!response.ok) {
    return null;
  }
  return (await response.json()).data;
}

export default function RedirectedOpportunity({
  params
}: {
  params: { id: string };
}) {
  const [data, setData] = useState<OpportunityResponse | null>(null);
  const [deadlineExpired, setDeadlineExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchOriginalUrl(params.id as string);
      setData(fetchedData);
    };

    fetchData();
  }, [params.id]); // Include params.id in the dependency array

  // Check if data and deadline exist
  useEffect(() => {
    if (data && data.deadline) {
      const deadlineDate = new Date(data.deadline);
      const currentDate = new Date();

      // Check if the deadline is expired
      setDeadlineExpired(deadlineDate < currentDate);
    }
  }, [data]); // Include data in the dependency array

  if (!data) {
    return (
      <LoadingOverlay zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
    );
  }

  const handleRedirect = () => {
    router.push(data.originalUrl);
  };

  return (
    <Box className={styles.container}>
      <Card className={styles.card}>
        <Card.Section>
          {data.coverImageUrl ? (
            <Image src={data.coverImageUrl} alt={data.title} height={160} />
          ) : (
            <Image
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
              alt="dummy image"
              height={160}
            />
          )}
        </Card.Section>
        <Group>
          <Text fz="md" fw={500}>
            {data.title}
          </Text>
          <Text fz="sm" c="dimmed">
            {data.deadline}
          </Text>
        </Group>
        <Text mt="sm" mb="md" c="dimmed" fz="sm">
          {data.description}
        </Text>
        <Button disabled={deadlineExpired} onClick={handleRedirect}>
          Apply Now
        </Button>
        {deadlineExpired && (
          <p className={styles.deadline}>The deadline has expired</p>
        )}
      </Card>
    </Box>
  );
}
