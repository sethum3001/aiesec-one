import { redirect } from "next/navigation";
import { API_ENDPOINTS, APP_DOMAIN, SHORT_LINK_TAGS } from "@/lib/constants";

// Function to fetch the original URL using a short link
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

// Component that handles redirecting based on the short link (from the params)
export default async function RedirectedOpportunity({
  params
}: {
  params: { id: string }; // Params contain the 'id' (short link)
}) {
  console.log(params);
  const originalUrl = await fetchOriginalUrl(params.id); //Fetch the original link
  console.log(originalUrl);
  if (originalUrl) {
    redirect(originalUrl);
  } else {
    redirect("/404");
  }
}
