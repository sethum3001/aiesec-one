import { redirect } from "next/navigation";
import { API_ENDPOINTS, APP_DOMAIN, SHORT_LINK_TAGS } from "@/app/lib/constants";

async function fetchOriginalUrl(shortLink: string) {
  const response = await fetch(
    APP_DOMAIN +
      API_ENDPOINTS.URL +
      "/" +
      SHORT_LINK_TAGS.RESOURCES +
      "/" +
      shortLink,
    {
      method: "GET"
    }
  );
  if (!response.ok) {
    return null;
  }
  if (!response.ok) return undefined;
  return (await response.json()).data;
}

export default async function RedirectedOpportunity({
  params
}: {
  params: { id: string };
}) {
  console.log(params);
  const originalUrl = await fetchOriginalUrl(params.id);
  console.log(originalUrl);
  if (originalUrl) {
    redirect(originalUrl);
  } else {
    redirect("/404");
  }
}
